// Must be the first import
import { h, render, createContext } from "preact";
import "preact/debug";
import { useContext } from "preact/hooks";
import { theme } from "./theme";
import { styled, setPragma, setUseTheme } from "goober";
import { space, layout, typography, color, compose } from "styled-system";
import { OtherEditor } from "./Editor";

const ThemeContext = createContext({});

setPragma(h);
setUseTheme(() => {
  return useContext(ThemeContext);
});

const composed = compose(space, layout, typography, color);

const BoxBase = ({ children, ...props }) => {
  console.log(props);
  return <div {...props}>{children}</div>;
};

// Add styled-system functions to your component
const Box = styled(BoxBase)(composed);

const files = {
  "/index.js": {
    code: "document.body.innerHTML = `<div>${require('uuid')}</div>`"
  }
};

const dependencies = {
  uuid: "latest"
};

const App = () => (
  // <SandpackProvider files={files} dependencies={dependencies} entry="/index.js">
  <ThemeContext.Provider value={theme}>
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      {/* <FileExplorer style={{ width: 300 }} /> */}
      {/* <CodeMirror style={{ flex: 1 }} /> */}
      <OtherEditor style={{ border: "1px solid grey" }} />
      {/* <BrowserPreview style={{ flex: 1 }} /> */}
      <Box color="red.300">Hello world</Box>
    </div>
  </ThemeContext.Provider>
  // </SandpackProvider>
);

const appMount = document.querySelector("#app");
if (appMount) render(<App />, appMount);

export default App;
