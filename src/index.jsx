// Must be the first import
import "preact/debug";
import { h, render, createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import { theme } from "./theme";
import { setPragma, setUseTheme } from "goober";
import { MonacoEditor } from "./Editor";
import ReactTypes from "./@types/react";
import { SandpackProvider } from "./SandpackProvider";
import { Box } from "./Box";
import { FileExplorer } from "./FileExplorer";
import { BrowserPreview } from "./BrowserPreview";

const ThemeContext = createContext({});

setPragma(h);
setUseTheme(() => {
  return useContext(ThemeContext);
});

const files = {
  "/index.js": {
    code: `import React from "react";
import ReactDOM from "react-dom";

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}

const rootElement = document.createElement("root");
document.body.appendChild(rootElement);
ReactDOM.render(<App />, rootElement);
    `
  }
};

const dependencies = {
  react: "latest",
  "react-dom": "latest"
};

// const files = {
//   "/index.js": {
//     code: "document.body.innerHTML = `<div>Hello world</div>`"
//   }
// };

// const dependencies = {
//   uuid: "latest"
// };

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

const App = () => {
  const [value, setValue] = useState("<div></div>");
  console.log("here");
  return (
    <ThemeContext.Provider value={theme}>
      <SandpackProvider
        files={files}
        bundlerURL="http://localhost:8000"
        dependencies={dependencies}
        entry="/index.js"
      >
        <Box display="flex" width="100%" height="100%">
          <FileExplorer width={300} />
          {/* <CodeMirror style={{ flex: 1 }} /> */}
          <MonacoEditor
            style={{ border: "1px solid grey" }}
            language="reactscript"
            editorWillMount={editorWillMount}
            value={files["/index.js"].code}
          />
          <BrowserPreview style={{ flex: 1 }} />
        </Box>
      </SandpackProvider>
    </ThemeContext.Provider>
  );
};

const appMount = document.querySelector("#app");
if (appMount) render(<App />, appMount);

export default App;
