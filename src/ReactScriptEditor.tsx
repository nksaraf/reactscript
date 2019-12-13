import { h } from "preact";
import { useState } from "preact/hooks";
import { useSandpack } from "./Sandpack/SandpackProvider";
import { MonacoEditor } from "./MonacoEditor/MonacoEditor";
import ReactTypes from "./@types/react";
import { useDebouncedCallback } from "codesandbox-utils";
import { compileCode } from "./reactscript";

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
    noEmit: true,
    typeRoots: ["node_modules/@types"],
    types: ["react"],
    allowSyntheticDefaultImports: true,
    jsx: monaco.languages.reactscript.JsxEmit.Preserve
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

export function ReactScriptEditor({ ...props }) {
  const sandpack = useSandpack();
  // console.log(sandpack);
  const [editor, setEditor] = useState(null);
  const [onChange] = useDebouncedCallback(
    async (value: string, editor: any) => {
      // const filename = editor.getModel().uri.toString();
      // const workerGetter = await monaco.languages.reactscript.getReactScriptWorker();
      // const worker = await workerGetter(filename);
      // console.log(await worker.getReactScript(filename));
      sandpack.updateFiles({
        ...sandpack.files,
        "/component.react": {
          code: value
        },
        "/component.js": {
          code: `
          import React from "react";
          export ${compileCode(value)};
          `
        }
      });

      // const parsed = parser.parse(value, {
      //   sourceType: "module",
      //   ecmaVersion: 2020
      // });
      // let body = [];
      // console.group();
      // walk(parsed, {
      //   enter: function(node, parent, prop, index) {
      //     if (node.type === "Program") {
      //       console.log(node);

      //       body = node.body;
      //       this.skip();
      //     }
      //   },
      //   leave: function(node, parent, prop, index) {
      //     // some code happens
      //   }
      // });
      // console.groupEnd();
      // console.log(body);
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
