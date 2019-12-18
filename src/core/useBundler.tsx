import { useState } from "preact/hooks";
import { dispatch } from "codesandbox-api";
import { getTemplate } from "codesandbox-utils";
import { createHookContext } from "./createHookContext";
import { createPackageJSON } from "./useSandbox";

const [BundlerProvider, useBundler] = createHookContext(
  (bundlerOptions: IManagerOptions) => {
    const [
      { bundlerURL, fileResolver, skipEval = false, width, height },
      setOptions
    ] = useState(bundlerOptions);

    const updatePreview = (sandboxInfo: ISandboxInfo) => {
      const {
        files,
        showOpenInCodeSandbox = false,
        template,
        dependencies,
        entry
      } = sandboxInfo;

      let packageJSON = JSON.parse(createPackageJSON(dependencies, entry));
      try {
        packageJSON = JSON.parse(files["/package.json"].text);
      } catch (e) {
        console.error("Could not parse package.json file: " + e.message);
      }

      // files["/package.json"] = { text: JSON.stringify(packageJSON) };

      const modules = Object.keys(files).reduce(
        (prev, next) => ({
          ...prev,
          [next]: {
            code: files[next].text,
            path: next
          }
        }),
        {}
      );
      // // TODO move this to a common format
      const normalizedModules: IModules = Object.keys(files).reduce(
        (prev, next) => ({
          ...prev,
          [next]: {
            content: files[next].text,
            path: next
          }
        }),
        {}
      );

      dispatch({
        type: "compile",
        codesandbox: true,
        version: 3,
        modules,
        externalResources: [],
        hasFileResolver: Boolean(fileResolver),
        disableDependencyPreprocessing: false,
        template: template || getTemplate(packageJSON, normalizedModules),
        showOpenInCodeSandbox,
        skipEval
      });
    };

    return { updatePreview, setOptions, bundlerURL, fileResolver };
  }
);

export { BundlerProvider, useBundler };
