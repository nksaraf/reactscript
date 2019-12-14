import { useContext, useState } from "preact/hooks";
import { h, createContext } from "preact";
import {
  IManagerOptions,
  IDependencies,
  IModules,
  ISandboxInfo
} from "./sandpack";
import { dispatch } from "codesandbox-api";
import { getTemplate } from "codesandbox-utils";

export const createHookContext = useHook => {
  const HookContext = createContext({});
  const HookProvider = ({ children, ...options }) => {
    const value = useHook(options);
    return (
      <HookContext.Provider value={value}>{children}</HookContext.Provider>
    );
  };

  const useHookContext = () => {
    return useContext(HookContext);
  };
  return [HookProvider, useHookContext];
};

const [BundlerProvider, useBundler] = createHookContext(
  (bundlerOptions: IManagerOptions) => {
    const [
      { bundlerURL, fileResolver, skipEval = false, width, height },
      setOptions
    ] = useState(bundlerOptions);

    const updatePreview = (sandboxInfo: ISandboxInfo) => {
      const { files, showOpenInCodeSandbox = false, template } = sandboxInfo;

      const modules = Object.keys(files).reduce(
        (prev, next) => ({
          ...prev,
          [next]: {
            code: files[next].code,
            path: next
          }
        }),
        {}
      );

      // let packageJSON = JSON.parse(createPackageJSON(dependencies, entry));
      // try {
      const packageJSON = JSON.parse(files["/package.json"].code);
      // } catch (e) {
      //   console.error("Could not parse package.json file: " + e.message);
      // }

      // // TODO move this to a common format
      const normalizedModules: IModules = Object.keys(files).reduce(
        (prev, next) => ({
          ...prev,
          [next]: {
            content: files[next].code,
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
