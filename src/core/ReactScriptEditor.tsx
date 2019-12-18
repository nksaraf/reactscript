import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import ky from "ky";
// import { useSandpack } from "./Sandpack/SandpackProvider";
import { MonacoEditor } from "../MonacoEditor/MonacoEditor";
import ReactTypes from "../@types/react";
import { useDebouncedCallback } from "codesandbox-utils";
import { useSandbox } from "./useSandbox";

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

export function ReactScriptEditor({ ...props }) {
  const {
    sandboxFiles,
    openedPath,
    writeFile,
    writeFiles,
    downloadFile
    // setSandboxFiles,
    // sandboxFiles,
    // addFile,
  } = useSandbox();

  useEffect(() => {
    downloadFile("http://localhost:5000/server/build/index.esm.js", "/lib.js");
  }, []);

  const [editor, setEditor] = useState(null);

  const [onChange] = useDebouncedCallback(
    (value: string) => {
      // if (openedPath && sandboxFiles[openedPath].text !== value) {
      writeFile(openedPath, value);
      // }
    },
    500,
    []
  );

  const files = sandboxFiles;
  console.log(files);

  return (
    <MonacoEditor
      value={files[openedPath] ? files[openedPath].text : ""}
      onChange={onChange}
      height="100%"
      fileName="component.tsx"
      options={monacoOptions}
      {...props}
      theme="vs-dark"
      language="reactscript"
      editorWillMount={editorWillMount}
      editorDidMount={editor => {
        setEditor(editor);
      }}
    />
  );
}
