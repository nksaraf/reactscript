import { dispatch, listen, registerFrame, Protocol } from "codesandbox-api";
import { getTemplate, version } from "codesandbox-utils";
import { useEffect, useState, useRef } from "preact/hooks";
import { memo } from "preact/compat";

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
      code: createPackageJSON(dependencies, entry)
    };
  }

  return newFiles;
}

export interface IManagerOptions {
  /**
   * Location of the bundler.
   */
  bundlerURL?: string;
  /**
   * Width of iframe.
   */
  width?: string;
  /**
   * Height of iframe.
   */
  height?: string;
  /**
   * If we should skip the third step: evaluation.
   */
  skipEval?: boolean;

  /**
   * You can pass a custom file resolver that is responsible for resolving files.
   * We will use this to get all files from the file system.
   */
  fileResolver?: {
    isFile: (path: string) => Promise<boolean>;
    readFile: (path: string) => Promise<string>;
  };
}

export interface IFile {
  code: string;
}

export interface IFiles {
  [path: string]: IFile;
}

export interface IModules {
  [path: string]: {
    code: string;
    path: string;
  };
}

export interface IDependencies {
  [depName: string]: string;
}

export interface ISandboxInfo {
  files: IFiles;
  dependencies?: IDependencies;
  entry?: string;
  /**
   * What template we use, if not defined we infer the template from the dependencies or files.
   *
   * @type {string}
   */
  template?: string;

  showOpenInCodeSandbox?: boolean;

  /**
   * Only use unpkg for fetching the dependencies, no preprocessing. It's slower, but doesn't talk
   * to AWS.
   */
  disableDependencyPreprocessing?: boolean;
}

export const useCodesandbox = handleMessage => {
  useEffect(() => {
    const listener = listen(handleMessage);
    return listener;
  });

  return { dispatch, registerFrame, Protocol };
};
