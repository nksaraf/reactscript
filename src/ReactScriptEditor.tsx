import { h } from "preact";
import { useState } from "preact/hooks";
// import { useSandpack } from "./Sandpack/SandpackProvider";
import { MonacoEditor } from "./MonacoEditor/MonacoEditor";
import ReactTypes from "./@types/react";
import { useDebouncedCallback } from "codesandbox-utils";
import { compileCode } from "./reactscript";
import { useSandbox } from "./Sandpack/sandbox";
import { IFile } from "./Sandpack/sandpack";
import { useMonacoLoader } from "MonacoEditor/useMonacoLoader";

const monacoOptions = {
  automaticLayout: true,
  fontSize: 14,
  minimap: { enabled: false },
  scrollbar: {
    useShadows: false
  },
  scrollBeyondLastLine: false,
  hideCursorInOverviewRuler: true,
  occurrencesHighlight: false,
  quickSuggestionsDelay: 0,
  tabCompletion: true,
  renderLineHighlight: "none",
  lineNumbers: "off",
  autoIndent: true,
  tabSize: 2
};

const editorWillMount = monaco => {
  monaco.languages.reactscript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.reactscript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.reactscript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.reactscript.ModuleKind.CommonJS,
    typeRoots: ["node_modules/@types"],
    types: ["react"],
    allowSyntheticDefaultImports: true,
    jsx: monaco.languages.reactscript.JsxEmit.Preserve
  });

  monaco.languages.reactscript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
  });

  monaco.languages.reactscript.typescriptDefaults.addExtraLib(
    ReactTypes,
    "file:///react.d.ts"
  );
  return {};
};

export function CodeEditor({ ...props }) {
  const sandpack = useSandpack();
  const [editor, setEditor] = useState(null);
  const [onChange] = useDebouncedCallback(
    async (value: string, editor: any) => {
      sandpack.updateFiles({
        ...sandpack.files,
        [sandpack.openedPath]: {
          code: value
        }
      });
    },
    300,
    []
  );

  return (
    <MonacoEditor
      value={sandpack.files[sandpack.openedPath].code}
      onChange={onChange}
      height="100%"
      options={monacoOptions}
      {...props}
      theme="vs-light"
      style={{ border: "1px solid grey" }}
      language="reactscript"
      editorWillMount={editorWillMount}
      editorDidMount={editor => setEditor(editor)}
    />
  );
}

export const reactScript = async files => {
  if (window.monaco && window.monaco.languages.reactscript) {
    const workerGetter = await window.monaco.languages.reactscript.getReactScriptWorker();
    const uri = window.monaco.Uri.file("component.tsx").toString();
    console.log(uri);
    const worker = await workerGetter(uri);
    console.log("here");

    const compiled = await worker.getReactScript(uri);
    const value = await worker.getCode(uri);
    console.log(compiled, value);
    return {
      ...files,
      "/component.react": {
        code: value
      },
      "/component.jsx": {
        code: compiled
      }
    };
  }
  return files;
};

// export const useReactScript = () => {
//   const monaco = useMonacoLoader();
//   if (monaco) {
//     return reactScript;
//   } else {
//     return files => {
//       return files;
//     };
//   }
// };

export function ReactScriptEditor({ ...props }) {
  const { sandbox, openedPath, updateFiles } = useSandbox();
  // console.log(sandpack);
  const [editor, setEditor] = useState(null);
  const [onChange] = useDebouncedCallback(
    async (value: string) => {
      if (
        openedPath &&
        sandbox.files[openedPath].code !== value &&
        updateFiles
      ) {
        updateFiles((files: IFile) => ({
          ...files,
          [openedPath]: { code: value }
        }));
      }
    },
    500,
    []
  );

  // console.log(sandbox.files, openedPath);

  return (
    <MonacoEditor
      value={sandbox.files[openedPath].code}
      onChange={onChange}
      height="100%"
      fileName="component.tsx"
      options={monacoOptions}
      {...props}
      theme="vs-dark"
      language="reactscript"
      editorWillMount={editorWillMount}
      editorDidMount={editor => setEditor(editor)}
    />
  );
}
