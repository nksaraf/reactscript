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
      updatePreview(sandbox);
      return updatedFiles;
    };
    const {
      files: sandboxFiles,
      writeFiles,
      downloadFile,
      dispatch,
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
                  dispatch({
                    type: types.WRITE_FILES,
                    data: { files: { ...(await reactScript({})) } }
                  });
                })();
              }
              dispatch({ type, data });
              break;
            case "IMPORT_LIB":
              dispatch({
                type: types.DOWNLOAD_FILE,
                data
              });
              dispatch({
                type: types.APPEND_TO_FILE,
                data: {
                  path: "/lib.js",
                  text: `\nexport * from '.${data.path}'`
                }
              });
              break;

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

    window.dispatch = dispatch;

    return {
      // sandbox,
      downloadFile,
      sandboxFiles,
      // readFiles,
      openedPath,
      writeFiles,
      writeFile,
      dispatch
    };
  }
);

export { useSandbox, SandboxProvider };
