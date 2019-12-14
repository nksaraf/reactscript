import { h, createContext } from "preact";
import { setPragma, setUseTheme, styled } from "goober";
import { useContext } from "preact/hooks";
import {
  background,
  BackgroundProps,
  border,
  BorderProps,
  color,
  ColorProps,
  display,
  DisplayProps,
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
  compose
} from "styled-system";
import { system, ResponsiveValue } from "styled-system";
import * as CSS from "csstype";

export const transform = system({
  transform: true,
  transformBox: true,
  transformOrigin: true,
  transformStyle: true,
  translate: true,
  scale: true,
  rotate: true,
  perspective: true,
  perspectiveOrigin: true,
  overflow: true,
  boxSizing: true,
  cursor: true,
  textDecoration: true
});

export interface TransformProps {
  transform?: ResponsiveValue<CSS.TransformProperty>;
  transformBox?: true;
  transformOrigin?: true;
  transformStyle?: true;
  translate?: true;
  scale?: true;
  rotate?: true;
  perspective?: true;
  perspectiveOrigin?: true;
  overflow?: ResponsiveValue<CSS.OverflowProperty>;
  boxSizing?: ResponsiveValue<CSS.BoxSizingProperty>;
  cursor?: ResponsiveValue<CSS.CursorProperty>;
  textDecoration?: ResponsiveValue<CSS.TextDecorationProperty<any>>;
}

const frGetter = (value: string | number | undefined) =>
  typeof value === "number" ? `repeat(${value}, 1fr)` : value;

const formatAreas = (areas: string[]) => areas;
// ? areas.map(area => `"${area}"`).join(' ') : "";

export const gridStyle = system({
  flow: {
    property: "gridAutoFlow"
  },
  minRowHeight: {
    property: "gridAutoRows",
    transform: (value: any) => `minmax(${value || "20px"}, auto)`
  },
  areas: {
    property: "gridTemplateAreas",
    transform: (value: any) => formatAreas(value)
  },
  columns: {
    property: "gridTemplateColumns",
    transform: (value: any) => frGetter(value) as string
  },
  rows: {
    property: "gridTemplateRows",
    transform: (value: any) => frGetter(value) as string
  }
});

export interface CustomGridProps {
  flow?: ResponsiveValue<string>;
  minRowHeight?: any;
  areas?: any;
  columns?: any;
  rows?: any;
}

export const cellStyle = system({
  colSpan: {
    property: "gridColumnEnd",
    transform: (value: any) =>
      `${value !== undefined ? `span ${value || 1}` : ""}`
  },
  rowSpan: {
    property: "gridRowEnd",
    transform: (value: any) =>
      `${value !== undefined ? `span ${value || 1}` : ""}`
  },
  colIndex: {
    property: "gridColumnStart",
    transform: (value: any) =>
      `${
        value !== undefined
          ? typeof value === "number"
            ? value + 1
            : value
          : ""
      }`
  },
  rowIndex: {
    property: "gridRowStart",
    transform: (value: any) =>
      `${
        value !== undefined
          ? typeof value === "number"
            ? value + 1
            : value
          : ""
      }`
  }
});

export interface CellProps {
  colIndex?: ResponsiveValue<number | string>;
  rowIndex?: ResponsiveValue<number | string>;
  colSpan?: ResponsiveValue<number | string>;
  rowSpan?: ResponsiveValue<number | string>;
  middle?: ResponsiveValue<boolean>;
  fullHeight?: ResponsiveValue<boolean>;
  fullWidth?: ResponsiveValue<boolean>;
}

export interface GridPosition {
  row?: ResponsiveValue<number>;
  column?: ResponsiveValue<number>;
  rowSpan?: ResponsiveValue<number>;
  colSpan?: ResponsiveValue<number>;
}
import { theme } from "./theme";
// const composed = compose(space, layout, typography, color);
// const BoxBase = ({ children, ...props }) => {
//   console.log(props);
//   return <div {...props}>{children}</div>;
// };
// Add styled-system functions to your component
const ThemeContext = createContext({});
export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ theme = {}, children }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

setPragma(h);
setUseTheme(useTheme);

export interface BoxProps
  extends SpaceProps,
    ColorProps,
    DisplayProps,
    BackgroundProps,
    LayoutProps,
    FlexboxProps,
    GridProps,
    BorderProps,
    ShadowProps,
    PositionProps,
    TransformProps,
    TypographyProps,
    CustomGridProps,
    CellProps {
  as?: any;
  gridPosition?: GridPosition;
  textVariant?: string;
  skipTheme?: boolean;
}

const composed = compose(
  space,
  color,
  display,
  layout,
  border,
  shadow,
  flexbox,
  grid,
  background,
  border,
  position,
  transform,
  typography,
  cellStyle,
  gridStyle
);

export const Box = styled("div")(composed);
export const IFrame = styled("iframe")(composed);
Box.displayName = "Box";

export { theme };
