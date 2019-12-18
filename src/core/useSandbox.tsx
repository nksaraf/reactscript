import { useCodesandbox } from "./useCodesandbox";
import { IFiles } from "../types";
import { useState, useEffect } from "preact/hooks";
import { useBundler } from "./useBundler";
import { createHookContext } from "./createHookContext";
import { useFileSystem, types } from "./useFileSystem";
import { reactScript } from "./reactScript";
import { isEqual } from "deep-fast-equal";

export function prepareSandboxFiles(
  files: IFiles,
  dependencies?: IDependencies,
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
      text: createPackageJSON(dependencies, entry)
    };
  }

  return newFiles;
}

export function createPackageJSON(
  dependencies = {},
  entry: string = "/index.js"
) {
  return JSON.stringify(
    {
      name: "sandpack-project",
      main: entry,
      dependencies
    },
    null,
    2
  );
}

const [SandboxProvider, useSandbox] = createHookContext(
  ({
    files = {},
    dependencies = {},
    entry = "/index.js",
    template = "create-react-app",
    openedPath: defaultOpenedPath = "/index.js",
    sandboxTransform,
    onSandboxChange,
    showOpenInCodeSandbox = false
  }) => {
    const updateSandbox = async (files: any) => {
      // setCompiling(true);
      let updatedFiles = prepareSandboxFiles(files, dependencies, entry);

      // if (sandboxTransform) {
      //   updatedFiles = await sandboxTransform(updatedFiles);
      // }

      let sandbox = {
        files: updatedFiles,
        showOpenInCodeSandbox,
        template,
        dependencies,
        entry
      };

      if (onSandboxChange) {
        onSandboxChange(sandbox);
      }
      // console.log(sandbox);
      updatePreview(sandbox);
      return updatedFiles;
      // setSandbox(sandbox);
      // setSandboxFiles(updatedFiles);
      // setCompiling(false);
    };

    // const middleware = dispatch => {
    //   return ({ type, data }) => {
    //     switch (type) {
    //       case types.WRITE_FILE:
    //         (async () => {
    //           const content = await ky(data.url).json();
    //           console.log(data);
    //           dispatch({
    //             type: types.WRITE_FILE,
    //             data: { path: data.path, text: content }
    //           });
    //         })();
    //         break;
    //       default:
    //         return dispatch({ type, data });
    //     }
    //   };
    // };

    const {
      files: sandboxFiles,
      writeFiles,
      downloadFile,
      // updateFiles: setSandboxFiles,
      writeFile
    } = useFileSystem(
      "/sandbox",
      prepareSandboxFiles(files, dependencies, entry),
      dispatch => {
        return ({ type, data }) => {
          switch (type) {
            case types.WRITE_FILE:
              if (data.path.split(".").pop() === "react") {
                (async () => {
                  const files = { ...(await reactScript({})) };

                  dispatch({
                    type: types.WRITE_FILES,
                    data: { files }
                  });
                })();
              }
              dispatch({ type, data });
            default:
              dispatch({ type, data });
          }
        };
      }
    );

    const [compiling, setCompiling] = useState(false);

    const [openedPath, setOpenedPath] = useState(defaultOpenedPath);

    const { updatePreview } = useBundler();

    useEffect(() => {
      console.log("previewing");
      updateSandbox(sandboxFiles);
    }, [sandboxFiles]);

    // const updateFiles = (files: IFiles) => {
    //   const _files = typeof files === "function" ? files(sandboxFiles) : files;

    //   setSandboxFiles(_files);
    // };

    // useEffect(() => {
    //   if (!compiling) {
    //     updateSandbox(sandboxFiles);
    //   }
    // }, [sandboxFiles]);

    // useEffect(() => {
    //   updateSandbox(files, dependencies, entry);
    // }, [files, dependencies, entry, template]);

    useCodesandbox(message => {
      if (message.type === "initialized") {
        updatePreview({
          dependencies,
          entry,
          files: sandboxFiles,
          template,
          showOpenInCodeSandbox
        });
      }
    });

    return {
      // sandbox,
      downloadFile,
      sandboxFiles,
      // readFiles,
      openedPath,
      writeFiles,
      writeFile
    };
  }
);

export { useSandbox, SandboxProvider };
