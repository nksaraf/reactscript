import { createContext } from "preact";
import { h, Component } from "preact";
import { memo } from "preact/compat";
import {
  Manager,
  prepareSandboxFiles,
  IManagerOptions,
  ISandboxInfo,
  IDependencies
} from "./manager";
import { listen } from "codesandbox-api";
import {
  IFiles,
  IManagerState,
  ISandpackContext,
  IModuleError,
  ManagerStatus
} from "../types";
import {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback
} from "preact/hooks";
import { useCallbackRef } from "./useCallbackRef";

// export interface State {
//   files: IFiles;
//   browserPath: string;
//   openedPath: string;
//   iframe: HTMLIFrameElement | null;
//   managerState: IManagerState | undefined;
//   errors: Array<IModuleError>;
//   status: ManagerStatus;
// }

export interface Props {
  showOpenInCodeSandbox?: boolean;
  className?: string;
  style?: Object;
  files: IFiles;
  initialPath?: string;
  children: any;
  entry?: string;
  dependencies?: {
    [depName: string]: string;
  };
  width?: number | string;
  height?: number | string;
  bundlerURL?: string;
  skipEval?: boolean;
  template?:
    | "create-react-app"
    | "create-react-app-typescript"
    | "parcel"
    | "vue-cli"
    | "angular-cli"
    | "preact-cli";

  onFileChange?: (files: IFiles, sandpack: ISandpackContext) => void;
  fileResolver?: {
    isFile: (path: string) => Promise<boolean>;
    readFile: (path: string) => Promise<string>;
  };
}

const SandpackContext = createContext<ISandpackContext>({} as any);

export const useSandpack = () => {
  return useContext(SandpackContext);
};

export const useManager = (options: IManagerOptions) => {
  const [errors, setErrors] = useState([] as any);
  const [managerState, setManagerState] = useState(undefined);
  const [status, setStatus] = useState("initializing" as ManagerStatus);
  const manager = useRef(null);
  // const [manager, setManager] = useState<Manager>(null);

  // console.log(manager);

  const handleMessage = (m: any) => {
    if (m.type === "state") {
      setManagerState(m.state);
    } else if (m.type === "start") {
      setErrors([]);
    } else if (m.type === "status") {
      setStatus(m.status);
    } else if (m.type === "action" && m.action === "show-error") {
      const { title, path, message, line, column } = m;
      setErrors((e: any) => [...e, { title, path, message, line, column }]);
    }
  };

  const getManagerTranspilerContext = (): Promise<{
    [transpiler: string]: Object;
  }> =>
    new Promise(resolve => {
      const listener = listen((message: any) => {
        if (message.type === "transpiler-context") {
          resolve(message.data);
          listener();
        }
      });

      if (manager.current) {
        manager.current.dispatch({ type: "get-transpiler-context" });
      }
      // if (manager.dispatch) {
      //   manager.dispatch({ type: "get-transpiler-context" });
      // }
    });

  const createManager = (
    el: string | HTMLIFrameElement,
    sandboxInfo: ISandboxInfo
  ) => {
    // setManager();

    manager.current = new Manager(el, sandboxInfo, options);
  };

  useEffect(() => {
    const listener = listen(handleMessage);
    return listener;
  }, []);

  useEffect(() => {
    if (manager.current) {
      manager.current.updateOptions(options);
    }
  }, [options.skipEval]);

  return {
    createManager,
    errors,
    managerState,
    managerStatus: status,
    getManagerTranspilerContext,
    managerRef: manager
  };
};

export const useSandbox = ({
  files,
  dependencies,
  entry,
  template,
  onSandboxChange,
  showOpenInCodeSandbox
}) => {
  const [sandboxFiles, setSandboxFiles] = useState(
    prepareSandboxFiles(files, dependencies, entry)
  );

  function updateSandbox(files: IFiles, dep?: IDependencies, ent?: string) {
    const sandboxFiles = prepareSandboxFiles(
      files,
      dep || dependencies,
      ent || entry
    );

    const sandbox = {
      files: sandboxFiles,
      showOpenInCodeSandbox,
      template
    };

    // setSandboxFiles(sandboxFiles);
    // console.log(manager);
    // if (manager.current) {
    //   manager.current.updatePreview(sandbox);
    // }
    // console.log(onSandboxChange);
    if (onSandboxChange) {
      onSandboxChange(sandbox);
    }
  }

  useEffect(() => {
    updateSandbox(files, dependencies, entry);
  }, [files, dependencies, entry, template]);

  return {
    sandbox: {
      files: sandboxFiles,
      showOpenInCodeSandbox,
      template
    },
    updateSandbox
  };
};

export const SandpackProvider = ({
  files,
  dependencies,
  entry,
  openedFile,
  children,
  bundlerURL,
  initialPath,
  template,
  showOpenInCodeSandbox,
  fileResolver,
  skipEval,
  onFileChange
}: Props) => {
  const {
    createManager,
    errors,
    managerState,
    managerStatus,
    managerRef,
    getManagerTranspilerContext
  } = useManager({
    bundlerURL,
    fileResolver,
    skipEval
  });

  const { sandbox, updateSandbox } = useSandbox({
    files,
    dependencies,
    entry,
    template,
    onSandboxChange: sandbox => {
      a();
      if (managerRef.current) managerRef.current.updatePreview(sandbox);
    },
    showOpenInCodeSandbox
  });

  const [browserPath, setBrowserPath] = useState(initialPath || "/");
  const [openedPath, setOpenedPath] = useState(
    openedFile || entry || "/index.js"
  );

  const openFile = (path: string) => {
    setOpenedPath(path);
  };

  const onBundlerMount = useCallback(el => {
    createManager(el, sandbox);
  }, []);

  const getSandpackState = (): ISandpackContext => {
    return {
      files: sandbox.files,
      openedPath,
      browserPath,
      errors,
      managerState,
      managerStatus,
      openFile,
      onBundlerMount,
      getManagerTranspilerContext,
      browserFrame: managerRef.current ? managerRef.current.iframe : null,
      updateFiles: updateSandbox,
      bundlerURL: managerRef.current ? managerRef.current.bundlerURL : ""
    };
  };

  return (
    <SandpackContext.Provider value={getSandpackState()}>
      {/* <Bundler onMount={onBundlerMount} bundlerURL={bundlerURL} /> */}
      {children}
    </SandpackContext.Provider>
  );
};

// export const SandpackProvider = ({
//   files,
//   dependencies,
//   entry,
//   openedFile,
//   children,
//   bundlerURL,
//   initialPath,
//   template,
//   showOpenInCodeSandbox,
//   fileResolver,
//   skipEval,
//   onFileChange
// }: Props) => {
//   const [allFiles, setAllFiles] = useState(
//     prepareSandboxFiles(files, dependencies, entry)
//   );
//   const [browserPath, setBrowserPath] = useState(initialPath || "/");
//   const [openedPath, setOpenedPath] = useState(
//     openedFile || entry || "/index.js"
//   );
//   const [errors, setErrors] = useState([] as any);
//   const [managerState, setManagerState] = useState(undefined);
//   const [status, setStatus] = useState("initializing" as ManagerStatus);
//   const manager = useRef<Manager>();

//   const handleMessage = (m: any) => {
//     if (m.type === "state") {
//       setManagerState(m.state);
//     } else if (m.type === "start") {
//       setErrors([]);
//     } else if (m.type === "status") {
//       setStatus(m.status);
//     } else if (m.type === "action" && m.action === "show-error") {
//       const { title, path, message, line, column } = m;
//       setErrors((e: any) => [...e, { title, path, message, line, column }]);
//     }
//   };

//   const getOptions = () => ({
//     bundlerURL: bundlerURL,
//     fileResolver: fileResolver,
//     skipEval: skipEval
//   });

//   useEffect(() => {
//     return listen(handleMessage);
//   }, []);

//   const getManagerTranspilerContext = (): Promise<{
//     [transpiler: string]: Object;
//   }> =>
//     new Promise(resolve => {
//       const listener = listen((message: any) => {
//         if (message.type === "transpiler-context") {
//           resolve(message.data);
//           listener();
//         }
//       });

//       if (manager.current) {
//         manager.current.dispatch({ type: "get-transpiler-context" });
//       }
//     });

//   const openFile = (path: string) => {
//     setOpenedPath(path);
//   };

//   function updateFiles(files: IFiles) {
//     setAllFiles(files);

//     if (onFileChange) {
//       onFileChange(files, getSandpackState());
//     }
//     if (manager.current) {
//       manager.current.updatePreview({
//         showOpenInCodeSandbox,
//         files,
//         template
//       });
//     }
//   }

//   const onBundlerMount = useCallback(el => {
//     // createManager(el,{
//     //   files: prepareSandboxFiles(files, dependencies, entry),
//     //   template,
//     //   showOpenInCodeSandbox
//     // },
//     // getOptions() );
//     manager.current = new Manager(
//       el,
//       {
//         files: prepareSandboxFiles(files, dependencies, entry),
//         template,
//         showOpenInCodeSandbox
//       },
//       getOptions()
//     );
//   }, []);

//   const getSandpackState = (): ISandpackContext => {
//     return {
//       files: allFiles,
//       openedPath,
//       browserPath,
//       errors,
//       managerState,
//       managerStatus: status,
//       openFile: openFile,
//       onBundlerMount: onBundlerMount,
//       getManagerTranspilerContext: getManagerTranspilerContext,
//       browserFrame: manager.current ? manager.current.iframe : null,
//       updateFiles: updateFiles,
//       bundlerURL: manager.current ? manager.current.bundlerURL : undefined
//     };
//   };

//   useEffect(() => {
//     const newFiles = prepareSandboxFiles(files, dependencies, entry);
//     updateFiles(newFiles);
//   }, [files, dependencies, entry, template]);

//   useEffect(() => {
//     if (manager.current) {
//       manager.current.updateOptions(getOptions());
//     }
//   }, [skipEval]);

//   return (
//     <SandpackContext.Provider value={getSandpackState()}>
//       {/* <Bundler onMount={onBundlerMount} bundlerURL={bundlerURL} /> */}
//       {children}
//     </SandpackContext.Provider>
//   );
// };

export const Bundler = memo(
  ({ onMount, bundlerURL }) => {
    const ref = useCallbackRef(null, onMount);
    console.log("bundler");

    return (
      <iframe
        ref={ref}
        title="sandpack-sandbox"
        key={1}
        style={{
          width: 0,
          height: 0,
          border: 0,
          outline: 0,
          position: "absolute",
          visibility: "hidden"
        }}
        sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
        src={bundlerURL}
      />
    );
  },
  (prev, next) => prev.bundlerURL === next.bundlerURL
);
