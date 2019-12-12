import { h } from "preact";
import { styled } from "goober";
import { space, layout, typography, color, compose } from "styled-system";
const composed = compose(space, layout, typography, color);
// const BoxBase = ({ children, ...props }) => {
//   console.log(props);
//   return <div {...props}>{children}</div>;
// };
// Add styled-system functions to your component
export const Box = styled("div")(composed);
Box.displayName = "Box";
