import { createContext } from "preact";
import { h, Component } from "preact";
import { memo } from "preact/compat";
import {
  // Manager,
  prepareSandboxFiles,
  IManagerOptions,
  ISandboxInfo,
  IDependencies,
  useCodesandbox
} from "./sandpack";
import { listen } from "codesandbox-api";
import { IFiles, ISandpackContext, ManagerStatus } from "../types";
import { useState, useRef, useEffect } from "preact/hooks";
import { useBundler } from "./bundler";
import { createHookContext } from "./bundler";

export function createPackageJSON(
  dependencies: IDependencies = {},
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
    const [sandboxFiles, setSandboxFiles] = useState(
      prepareSandboxFiles(files, dependencies, entry)
    );

    const [openedPath, setOpenedPath] = useState(defaultOpenedPath);

    const { updatePreview } = useBundler();

    function updateFiles(files: IFiles) {
      setSandboxFiles(oldFiles => {
        let updatedFiles;
        if (typeof files === "function") {
          updatedFiles = files(oldFiles);
        } else {
          updatedFiles = files;
        }

        updatedFiles = prepareSandboxFiles(updatedFiles, dependencies, entry);

        if (sandboxTransform) {
          updatedFiles = sandboxTransform(updatedFiles);
        }

        let sandbox = {
          files: updatedFiles,
          showOpenInCodeSandbox,
          template
        };

        if (onSandboxChange) {
          onSandboxChange(sandbox);
        }

        updatePreview(sandbox);
        return updatedFiles;
      });
    }

    // useEffect(() => {
    //   updateSandbox(files, dependencies, entry);
    // }, [files, dependencies, entry, template]);

    useCodesandbox(message => {
      if (message.type === "initialized") {
        updatePreview({
          files: sandboxFiles,
          showOpenInCodeSandbox,
          template
        });
      }
    });

    // useEffect(() => {
    //   fetch("http://localhost:5000/server/build/index.esm.js")
    //     .then(body => body.text())
    //     .then(content => {
    //       console.log(content);
    //       updateFiles(files => ({
    //         ...files,
    //         "/index.js": {
    //           code:
    //             "import * as components from './lib'; console.log(components);" +
    //             files["/index.js"].code
    //         },
    //         "/lib.js": { code: content }
    //       }));
    //     });
    // }, []);

    return {
      sandbox: {
        files: sandboxFiles,
        showOpenInCodeSandbox,
        template
      },
      openedPath,
      updateFiles
    };
  }
);

export { useSandbox, SandboxProvider };
