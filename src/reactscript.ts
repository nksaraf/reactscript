export const createProject = () => {
  const startText = `<div className="App">
<h1>Hello CodeSandbox</h1>
<h2>Start editing to see some magic happen!</h2>
</div>
`;

  const files = {
    "/component.react": {
      code: startText
    },
    "/component.js": {
      code: `
    import React from "react";
    export ${compileCode(startText)}
    `
    },
    "/index.js": {
      code: `import React from "react";
import ReactDOM from "react-dom";
import { Code } from "./component";

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <Code />
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

  return { files, dependencies };
};

export function parseCode(code: string) {
  const trimmed = code.trim() || "";
  if (trimmed.length === 0 || trimmed.search(/<[>A-Za-z]/) === 0) {
    return { jsx: trimmed, nonJsx: "", returnStatement: false };
  } else {
    if (trimmed.search("return") < 0) {
      const jsxStart = trimmed.search(/<[>A-Za-z]/);
      const nonJsx = trimmed.substring(0, jsxStart - 1).trim();
      const jsx = trimmed
        .substring(jsxStart)
        .replace(/^\(+/g, "")
        .replace(/[\);]+$/g, "")
        .trim();

      return { jsx, nonJsx, returnStatement: false };
    } else {
      const returnStart = trimmed.search("return ");
      const nonJsx = trimmed.substring(0, returnStart - 1).trim();
      const jsx = trimmed
        .substring(returnStart)
        .replace(/^return/, "")
        .trim()
        .replace(/^\(+/g, "")
        .replace(/[\);]+$/g, "")
        .trim();
      return { jsx, nonJsx, returnStatement: true };
    }
  }
}

export const wrapJsx = (code: string) =>
  `<React.Fragment>\n${code}\n</React.Fragment>`;

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
  } \n return (${wrapJsx(jsx)}); }\n`;
};

export const iife = (functionString: string) => `(${functionString})()`;

// export const linkCode = ({ jsx, nonJsx }: { jsx: string; nonJsx: string }) => {
//   return iife(createCodeComponent("Code", { jsx, nonJsx }));
// };

export function compileCode(code: string) {
  //transpileCode
  console.log(code);
  var compiled = createCodeComponent("Code", parseCode(code));
  console.log(compiled);
  return compiled;
}
