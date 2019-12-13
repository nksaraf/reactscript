import { h } from "preact";
import { setPragma, setUseTheme, styled } from "goober";
import { space, layout, typography, color, compose } from "styled-system";
const composed = compose(space, layout, typography, color);
// const BoxBase = ({ children, ...props }) => {
//   console.log(props);
//   return <div {...props}>{children}</div>;
// };
// Add styled-system functions to your component
const ThemeContext = createContext({});
export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ theme, children }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

setPragma(h);
setUseTheme(useTheme);

export const Box = styled("div")(composed);
Box.displayName = "Box";

export { theme } from "./theme";
