import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import ky from "ky";
// import { useSandpack } from "./Sandpack/SandpackProvider";
import { MonacoEditor } from "../MonacoEditor/MonacoEditor";
import ReactTypes from "../@types/react";
import { useDebouncedCallback } from "codesandbox-utils";
import { useSandbox } from "./useSandbox";
import { useClipboard } from "./useClipboard";

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
  const clipboard = useClipboard();
  const [editor, setEditor] = useState(null);

  const {
    sandboxFiles,
    openedPath,
    writeFile,
    writeFiles,
    downloadFile,
    dispatch
    // setSandboxFiles,
    // sandboxFiles,
    // addFile,
  } = useSandbox();

  useEffect(() => {
    dispatch({
      type: "IMPORT_LIB",
      data: {
        url: "http://localhost:5000/server/build/index.esm.js",
        path: "/served.js"
      }
    });
  }, []);

  const editorDidMount = (editor, monaco) => {
    setEditor(editor);
    const copyComponentToClipboard = () => {
      clipboard.copy(sandboxFiles["/component.jsx"].text);
    };

    const keyDownListener = (e: any) => {
      if (
        e.code === "KeyS" &&
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
        editor.trigger("", "editor.action.formatDocument", null);
      } else if (
        e.code === "KeyE" &&
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
        copyComponentToClipboard();
      } else if (
        e.code === "KeyP" &&
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
        e.shiftKey
      ) {
        e.preventDefault();
        editor.trigger("", "editor.action.quickCommand", null);
      }
    };

    window.addEventListener("keydown", keyDownListener);

    editor.addAction({
      label: "Export ReactScript Component",
      id: "export-reactscript",
      run: () => {}
    });

    // editor.addCommand(
    //   // tslint:disable:no-bitwise i am a 7331 haxx0r
    //   monaco.KeyMod.Alt | monaco.KeyCode.Space,
    //   () => {
    //     if (monacoEditor) {
    //       monacoEditor.trigger("", "editor.action.triggerSuggest", null);
    //     }
    //   },
    //   ""
    // );

    editor.addCommand(
      // tslint:disable:no-bitwise i am a 7331 haxx0r
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_E,
      copyComponentToClipboard,
      ""
    );
  };

  const [onChange] = useDebouncedCallback(
    (value: string) => {
      // if (openedPath && sandboxFiles[openedPath].text !== value) {
      writeFile(openedPath, value);
      // }
    },
    500,
    []
  );

  return (
    <MonacoEditor
      value={sandboxFiles[openedPath] ? sandboxFiles[openedPath].text : ""}
      onChange={onChange}
      height="100%"
      fileName="component.tsx"
      options={monacoOptions}
      {...props}
      theme="vs-dark"
      language="reactscript"
      editorWillMount={editorWillMount}
      editorDidMount={editorDidMount}
    />
  );
}
