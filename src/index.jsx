// Must be the first import
import "preact/debug";
import { h, render } from "preact";
import { Box, Button } from "preact-box";
import { glob } from "goober";
import { ReactScriptEditor } from "./core/ReactScriptEditor";
import { BundlerProvider } from "./core/useBundler";
import { SandpackIFrame } from "./core/SandpackIFrame";
import { SandboxProvider } from "./core/useSandbox";
import { createProject } from "./core/reactScript";
import { FileExplorer } from "./FileExplorer/FileExplorer";

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
  // const reactScript = useReactScript();
  return (
    <BundlerProvider bundlerURL={`http://localhost:8000`}>
      <SandboxProvider
        {...createProject()}
        entry="/index.jsx"
        openedPath="/component.react"
      >
        <Box display="flex" width="100vw" height="100vh">
          <Button
            onClick={async e => {
              console.log(await window.chooseFileSystemEntries());
            }}
          >
            Click
          </Button>
          <FileExplorer />
          <ReactScriptEditor style={{ flex: 1 }} />
          <Box display="flex" flexDirection="column" flex={1}>
            <SandpackIFrame
              style={{
                flex: "1",
                width: "100%",
                border: "none",
                outline: "none"
              }}
            />
            <SandpackIFrame
              style={{
                flex: "1",
                width: "100%",
                border: "none",
                outline: "none"
              }}
            />
          </Box>
        </Box>
      </SandboxProvider>
    </BundlerProvider>
  );
};

// const App = () => {
//   return (
//     <ThemeProvider value={theme}>
//       <SandpackProvider
//         {...createProject()}
//         bundlerURL="http://localhost:8000"
//         entry="/index.js"
//         openedFile="/component.react"
//         showOpenInCodeSandbox={false}
//         template="create-react-app"
//       >
//         <Box display="flex" width="100vw" height="100vh">
//           {/* <FileExplorer width={300} /> */}
//           <ReactScriptEditor />
//           <BrowserPreview style={{ flex: 1 }} />
//         </Box>
//       </SandpackProvider>
//     </ThemeProvider>
//   );
// };

const appMount = document.querySelector("#app");
if (appMount) render(<App />, appMount);

export default App;
