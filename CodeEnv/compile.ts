// import { wrapJsx } from "./format";
import { parseCode } from "./parse";

export const wrapJsx = (code: string) => `<>\n${code}\n</>`;

// import { languages } from "monaco-editor";

// export const transpileCode = (code: string) => transpile(code, {
//   target: languages.typescript.ScriptTarget.ES5,
//   allowNonTsExtensions: true,
//   jsx: languages.typescript.JsxEmit.React,
//   noEmit: true,
// });

export const createCodeComponent = (
  name: string,
  { jsx, nonJsx }: { jsx: string; nonJsx: string }
) => {
  return `function ${name}() { ${
    nonJsx.length > 0 ? `${nonJsx};` : ""
  } \n return ${wrapJsx(jsx)}; }\n`;
};

export const iife = (functionString: string) => `(${functionString})()`;

export const linkCode = ({ jsx, nonJsx }: { jsx: string; nonJsx: string }) => {
  if (nonJsx.length === 0) {
    return wrapJsx(jsx);
  } else {
    return iife(createCodeComponent("Code", { jsx, nonJsx }));
  }
};

export function compileCode(code: string) {
  //transpileCode
  return linkCode(parseCode(code));
}
