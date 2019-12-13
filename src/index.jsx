// Must be the first import
import "preact/debug";
import { h, render } from "preact";
import { theme, ThemeProvider, Box } from "./Box";
import { glob } from "goober";
import { ReactScriptEditor } from "./ReactScriptEditor";
import { SandpackProvider } from "./Sandpack/SandpackProvider";
// import { FileExplorer } from "./FileExplorer/FileExplorer";
import { BrowserPreview } from "./Preview/BrowserPreview";
import { createProject } from "./reactscript";
// const components = require("http://localhost:5000/server/build/index.esm.js");
// console.log(components);

glob`
  html,
  body {
    background: light;
    margin: 0;
    padding: 0;
    font-family: "SF Mono";
  }

  * {
    box-sizing: border-box;
  }
`;

const App = () => {
  return (
    <ThemeProvider value={theme}>
      <SandpackProvider
        {...createProject()}
        bundlerURL="http://localhost:8000"
        entry="/index.js"
        openedFile="/component.react"
        showOpenInCodeSandbox={false}
        template="create-react-app"
      >
        <Box display="flex" width="100vw" height="100vh">
          {/* <FileExplorer width={300} /> */}
          <ReactScriptEditor />
          <BrowserPreview style={{ flex: 1 }} />
        </Box>
      </SandpackProvider>
    </ThemeProvider>
  );
};

const appMount = document.querySelector("#app");
if (appMount) render(<App />, appMount);

export default App;
