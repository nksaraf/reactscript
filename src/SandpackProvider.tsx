import { createContext } from "preact";
import { h, Component } from "preact";
import { Manager, generatePackageJSON } from "smooshpack";
import { listen } from "codesandbox-api";

import {
  IFiles,
  IManagerState,
  ISandpackContext,
  IModuleError,
  ManagerStatus
} from "./types";
import { useState, useRef, useEffect, useContext } from "preact/hooks";

export interface State {
  files: IFiles;
  browserPath: string;
  openedPath: string;
  iframe: HTMLIFrameElement | null;
  managerState: IManagerState | undefined;
  errors: Array<IModuleError>;
  status: ManagerStatus;
}

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

function createMissingPackageJSON(
  files: IFiles,
  dependencies?: {
    [depName: string]: string;
  },
  entry?: string
) {
  const newFiles = { ...files };

  if (!newFiles["/package.json"]) {
    if (!dependencies) {
      throw new Error(
        "No dependencies specified, please specify either a package.json or dependencies."
      );
    }

    if (!entry) {
      throw new Error(
        "No entry specified, please specify either a package.json with 'main' field or dependencies."
      );
    }

    newFiles["/package.json"] = {
      code: JSON.stringify(
        {
          name: "run",
          main: entry,
          dependencies
        },
        null,
        2
      )
    };
  }

  return newFiles;
}

// export const SandpackProvider = ({ files, dependencies,entry, children, bundlerURL, initialPath}: Props) => {
//   const [allFiles, setAllFiles]  = useState(createMissingPackageJSON(
//     files,
//     dependencies,
//     entry
//   ));
//   const [browserPath, setBrowserPath] = useState(initialPath || "/");
//   const [openedPath, setOpenedath] = useState(entry || "/index.js");
//   const [iFrame, setIFrame] = useState(null);
//   const [errors, setErrors] = useState([] as any);
//   const [managerState, setManagerState]  = useState(undefined);
//   const [status, setStatus]  = useState("initializing" as ManagerStatus);

//   const handleMessage = (m: any) => {
//     console.log(m);
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

//   useEffect(() => {
//     return listen(handleMessage);
//   }, [])

//   return <SandpackContext.Provider value={{} as any}>{children}</SandpackContext.Provider>
// }

// export class SandpackProvider_ extends Component<Props, State> {
//   static defaultProps = {
//     skipEval: false
//   };

//   manager?: Manager;
//   iframe?: HTMLIFrameElement;
//   listener: Function;

//   constructor(props: Props) {
//     super(props);

//     this.state = {
//       files: this.,
//       browserPath: props.initialPath || "/",
//       openedPath: props.entry || "/index.js",
//       iframe: null,
//       managerState: undefined,
//       errors: [],
//       status: "initializing"
//     };

//     this.listener = listen(this.handleMessage);
//   }

//   handleMessage = (m: any) => {
//     console.log(m);
//     if (m.type === "state") {
//       this.setState({ managerState: m.state });
//     } else if (m.type === "start") {
//       this.setState({ errors: [] });
//     } else if (m.type === "status") {
//       this.setState({ status: m.status });
//     } else if (m.type === "action" && m.action === "show-error") {
//       const { title, path, message, line, column } = m;
//       this.setState(state => ({
//         errors: [...state.errors, { title, path, message, line, column }]
//       }));
//     }
//   };

//   getOptions = () => ({
//     bundlerURL: this.props.bundlerURL,
//     fileResolver: this.props.fileResolver,
//     skipEval: this.props.skipEval
//   });

//   setupFrame = (el: HTMLIFrameElement) => {
//     if (el) {
//       this.manager = new Manager(
//         el,
//         {
//           files: generatePackageJSON(
//             this.props.files,
//             this.props.dependencies,
//             this.props.entry
//           ),
//           template: this.props.template,
//           showOpenInCodeSandbox: this.props.showOpenInCodeSandbox
//         },
//         this.getOptions()
//       );

//       this.iframe = el;

//       this.setState({ iframe: el });
//     }
//   };

//   updateFiles = (files: IFiles) => {
//     this.setState({ files });

//     if (this.props.onFileChange) {
//       this.props.onFileChange(files, this._getSandpackState());
//     }
//     if (this.manager) {
//       this.manager.updatePreview({
//         showOpenInCodeSandbox: this.props.showOpenInCodeSandbox,
//         files,
//         template: this.props.template
//       });
//     }
//   };

//   componentDidUpdate(props: Props) {
//     if (
//       props.files !== this.props.files ||
//       props.dependencies !== this.props.dependencies ||
//       props.entry !== this.props.entry ||
//       props.template !== this.props.template
//     ) {
//       const newFiles = this.createMissingPackageJSON(
//         this.props.files,
//         this.props.dependencies,
//         this.props.entry
//       );

//       this.updateFiles(newFiles);
//     }

//     if (this.manager && this.props.skipEval !== props.skipEval) {
//       this.manager.updateOptions(this.getOptions());
//     }
//   }

//   componentWillUnmount() {
//     this.listener();
//   }

//   openFile = (path: string) => {
//     this.setState({ openedPath: path });
//   };

//   /**
//    * Get information about the transpilers that are currently registered to the
//    * preset
//    */
//   getManagerTranspilerContext = (): Promise<{ [transpiler: string]: Object }> =>
//     new Promise(resolve => {
//       const listener = listen((message: any) => {
//         if (message.type === "transpiler-context") {
//           resolve(message.data);

//           listener();
//         }
//       });

//       if (this.manager) {
//         this.manager.dispatch({ type: "get-transpiler-context" });
//       }
//     });

//   _getSandpackState = (): ISandpackContext => {
//     const {
//       iframe,
//       files,
//       browserPath,
//       openedPath,
//       managerState,
//       errors,
//       status
//     } = this.state;

//     return {
//       files,
//       openedPath,
//       browserPath,
//       errors,
//       managerState,
//       managerStatus: status,
//       openFile: this.openFile,
//       getManagerTranspilerContext: this.getManagerTranspilerContext,
//       browserFrame: iframe,
//       updateFiles: this.updateFiles,
//       bundlerURL: this.manager ? this.manager.bundlerURL : undefined
//     };
//   };

//   render() {
//     const { children, className, style } = this.props;
//     const { iframe } = this.state;
//     console.log("here agaub");

//     return (
//       <SandpackContext.Provider value={this._getSandpackState()}>
//         <div style={style} className={`${className || ""} sandpack`}>
//           {/* We create a hidden iframe, the bundler will live in this.
//             We expose this iframe to the Consumer, so other components can show the full
//             iframe for preview. An implementation can be found in `Preview` component. */}
//           <iframe
//             ref={this.setupFrame}
//             title="sandpack-sandbox"
//             style={{
//               width: 0,
//               height: 0,
//               border: 0,
//               outline: 0,
//               position: "absolute",
//               visibility: "hidden"
//             }}
//             sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
//             src={this.props.bundlerURL}
//           />
//           {children}
//         </div>
//       </SandpackContext.Provider>
//     );
//   }
// }

// export default class SandpackProvider extends PureComponent<Props, State> {
//   static defaultProps = {
//     skipEval: false
//   };

//   manager?: Manager;
//   iframe?: HTMLIFrameElement;
//   listener: Function;

//   constructor(props: Props) {
//     super(props);

//     this.state = {
//       files: this.createMissingPackageJSON(
//         props.files,
//         props.dependencies,
//         props.entry
//       ),
//       browserPath: props.initialPath || "/",
//       openedPath: props.entry || "/index.js",
//       iframe: null,
//       managerState: undefined,
//       errors: [],
//       status: "initializing"
//     };

//     this.listener = listen(this.handleMessage);
//   }

//   handleMessage = (m: any) => {
//     if (m.type === "state") {
//       this.setState({ managerState: m.state });
//     } else if (m.type === "start") {
//       this.setState({ errors: [] });
//     } else if (m.type === "status") {
//       this.setState({ status: m.status });
//     } else if (m.type === "action" && m.action === "show-error") {
//       const { title, path, message, line, column } = m;
//       this.setState(state => ({
//         errors: [...state.errors, { title, path, message, line, column }]
//       }));
//     }
//   };

//   getOptions = () => ({
//     bundlerURL: this.props.bundlerURL,
//     fileResolver: this.props.fileResolver,
//     skipEval: this.props.skipEval
//   });

//   setupFrame = (el: HTMLIFrameElement) => {
//     if (el) {
//       this.manager = new Manager(
//         el,
//         {
//           files: generatePackageJSON(
//             this.props.files,
//             this.props.dependencies,
//             this.props.entry
//           ),
//           template: this.props.template,
//           showOpenInCodeSandbox: this.props.showOpenInCodeSandbox
//         },
//         this.getOptions()
//       );

//       this.iframe = el;

//       this.setState({ iframe: el });
//     }
//   };

//   updateFiles = (files: IFiles) => {
//     this.setState({ files });

//     if (this.props.onFileChange) {
//       this.props.onFileChange(files, this._getSandpackState());
//     }
//     if (this.manager) {
//       this.manager.updatePreview({
//         showOpenInCodeSandbox: this.props.showOpenInCodeSandbox,
//         files,
//         template: this.props.template
//       });
//     }
//   };

//   componentDidUpdate(props: Props) {
//     if (
//       props.files !== this.props.files ||
//       props.dependencies !== this.props.dependencies ||
//       props.entry !== this.props.entry ||
//       props.template !== this.props.template
//     ) {
//       const newFiles = this.createMissingPackageJSON(
//         this.props.files,
//         this.props.dependencies,
//         this.props.entry
//       );

//       this.updateFiles(newFiles);
//     }

//     if (this.manager && this.props.skipEval !== props.skipEval) {
//       this.manager.updateOptions(this.getOptions());
//     }
//   }

//   componentWillUnmount() {
//     this.listener();
//   }

//   openFile = (path: string) => {
//     this.setState({ openedPath: path });
//   };

//   /**
//    * Get information about the transpilers that are currently registered to the
//    * preset
//    */
//   getManagerTranspilerContext = (): Promise<{ [transpiler: string]: Object }> =>
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

//   _getSandpackState = (): ISandpackContext => {
//     const {
//       iframe,
//       files,
//       browserPath,
//       openedPath,
//       managerState,
//       errors,
//       status
//     } = this.state;

//     return {
//       files,
//       openedPath,
//       browserPath,
//       errors,
//       managerState,
//       managerStatus: status,
//       openFile: this.openFile,
//       getManagerTranspilerContext: this.getManagerTranspilerContext,
//       browserFrame: iframe,
//       updateFiles: this.updateFiles,
//       bundlerURL: this.manager ? this.manager.bundlerURL : undefined
//     };
//   };

//   render() {
//     const { children, className, style } = this.props;
//     const { iframe } = this.state;

//     return (
//       <Broadcast channel="sandpack" value={this._getSandpackState()}>
//         <div style={style} className={`${className || ""} sandpack`}>
//           {/* We create a hidden iframe, the bundler will live in this.
//             We expose this iframe to the Consumer, so other components can show the full
//             iframe for preview. An implementation can be found in `Preview` component. */}
//           <iframe
//             ref={this.setupFrame}
//             title="sandpack-sandbox"
//             style={{
//               width: 0,
//               height: 0,
//               border: 0,
//               outline: 0,
//               position: "absolute",
//               visibility: "hidden"
//             }}
//             sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
//             src={this.props.bundlerURL}
//           />
//           {children}
//         </div>
//       </Broadcast>
//     );
//   }
// }

// function createMissingPackageJSON(
//   files: IFiles,
//   dependencies?: {
//     [depName: string]: string;
//   },
//   entry?: string
// ) {
//   const newFiles = { ...files };

//   if (!newFiles["/package.json"]) {
//     if (!dependencies) {
//       throw new Error(
//         "No dependencies specified, please specify either a package.json or dependencies."
//       );
//     }

//     if (!entry) {
//       throw new Error(
//         "No entry specified, please specify either a package.json with 'main' field or dependencies."
//       );
//     }

//     newFiles["/package.json"] = {
//       code: JSON.stringify(
//         {
//           name: "run",
//           main: entry,
//           dependencies
//         },
//         null,
//         2
//       )
//     };
//   }

//   return newFiles;
// }

const SandpackContext = createContext<ISandpackContext>({} as any);

// export const SandpackProvider = ({
//   fileResolver,
//   skipEval = false,
//   children,
//   className,
//   style,
//   bundlerURL,
//   initialPath,
//   files,
//   dependencies,
//   entry,
//   onFileChange,
//   showOpenInCodeSandbox,
//   template
// }: Props) => {
//   const [iFrame, setIFrame] = useState(null);
//   const manager = useRef<Manager>();
//   const [openedPath, setOpenedPath] = useState(entry || "/index.js");
//   const [browserPath, setBrowserPath] = useState(initialPath || "/");

//   const [_files, setFiles] = useState(
//     createMissingPackageJSON(files, dependencies, entry)
//   );
//   const [managerState, setManagerState] = useState(undefined as any);
//   const [errors, setErrors] = useState([] as any[]);
//   const [status, setStatus] = useState("initializing" as ManagerStatus);

//   const handleMessage = (m: any) => {
//     console.log(m);
//     if (m.type === "state") {
//       setManagerState(m.state);
//     } else if (m.type === "start") {
//       setErrors([]);
//     } else if (m.type === "status") {
//       setStatus(m.status);
//     } else if (m.type === "action" && m.action === "show-error") {
//       const { title, path, message, line, column } = m;
//       setErrors(errors => [...errors, { title, path, message, line, column }]);
//     }
//   };

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
//     setFiles(files);

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

//   const getSandpackState = (): ISandpackContext => {
//     // const {
//     //   iframe,
//     //   files,
//     //   browserPath,
//     //   openedPath,
//     //   managerState,
//     //   errors,
//     //   status
//     // } = this.state;

//     return {
//       files: _files,
//       openedPath,
//       browserPath,
//       errors,
//       managerState,
//       managerStatus: status,
//       openFile: openFile,
//       getManagerTranspilerContext: getManagerTranspilerContext,
//       browserFrame: iFrame,
//       updateFiles: updateFiles,
//       bundlerURL: manager.current ? manager.current.bundlerURL : undefined
//     };
//   };

//   useEffect(() => {
//     const listener = listen(handleMessage);
//     return listener;
//   }, []);

//   useEffect(() => {
//     const newFiles = createMissingPackageJSON(files, dependencies, entry);

//     updateFiles(newFiles);
//   }, [files, dependencies, entry, template]);

//   useEffect(() => {
//     if (manager.current) {
//       manager.current.updateOptions(getOptions());
//     }
//   }, [skipEval]);

//   const getOptions = () => ({
//     bundlerURL,
//     fileResolver,
//     skipEval
//   });

//   const setupFrame = (el: HTMLIFrameElement) => {
//     if (el) {
//       console.log(el);
//       manager.current = new Manager(
//         el,
//         {
//           files: generatePackageJSON(files, dependencies, entry),
//           template,
//           showOpenInCodeSandbox
//         },
//         getOptions()
//       );
//       console.log(manager.current);

//       setIFrame(el);
//     }
//   };

//   // browserPath: props.initialPath || "/",
//   // openedPath: props.entry || "/index.js",
//   // iframe: null,
//   // managerState: undefined,
//   // errors: [],
//   // status: "initializing"
//   return (
//     <SandpackContext.Provider value={getSandpackState()}>
//       {/* <div style={style} className={`${className || ""} sandpack`}> */}
//       {/* We create a hidden iframe, the bundler will live in this.
//     We expose this iframe to the Consumer, so other components can show the full
//     iframe for preview. An implementation can be found in `Preview` component. */}
//       <iframe
//         ref={setupFrame}
//         title="sandpack-sandbox"
//         style={{
//           width: 0,
//           height: 0,
//           border: 0,
//           outline: 0,
//           position: "absolute",
//           visibility: "hidden"
//         }}
//         sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
//         src={bundlerURL}
//       />
//       {children}
//       {/* </div> */}
//     </SandpackContext.Provider>
//   );
// };

export const useSandpack = () => {
  return useContext(SandpackContext);
};
