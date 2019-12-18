const componentReact = `
{
  const Count = ({ count }) => {
    return <h1>{count}</h1>;
  };
}
const [count, setCount] = React.useState(0);

<div>
  <h1>Hello CodeSadbox</h1>
  <button type="button" onClick={() => setCount(count => count + 1)}>
    Click Me!
  </button>
  <Count count={count} />
</div>
`;

const componentJsx = `
import React from 'react';
const Count = ({ count }) => {
  return <h1>{count}</h1>;
};
export function Code() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h1>Hello CodeSadbox</h1>
      <button type="button" onClick={() => setCount(count => count + 1)}>
        Click Me!
      </button>
      <Count count={count} />
    </div>
  );
}    
`;

const indexJs = `
import React from "react";
import ReactDOM from "react-dom";
import { Code } from "./component";

function App() {
  return <Code />;
}

const rootElement = document.createElement("root");
document.body.appendChild(rootElement);
ReactDOM.render(<App />, rootElement);
`;

const libJs = `
export * from "@playroom/react-box";
`;

export const createProject = () => {
  const files = {
    "/component.react": {
      text: componentReact
    },
    "/component.jsx": {
      text: componentJsx
    },
    "/index.jsx": {
      text: indexJs
    },
    "/lib.js": {
      text: libJs
    }
  };

  const dependencies = {
    react: "latest",
    "react-dom": "latest",
    "prop-types": "latest",
    "@playroom/react-box": "latest",
    "styled-components": "latest"
  };

  return { files, dependencies };
};

export const reactScript = async files => {
  if (window.monaco && window.monaco.languages.reactscript) {
    const workerGetter = await window.monaco.languages.reactscript.getReactScriptWorker();
    const uri = window.monaco.Uri.file("component.tsx").toString();
    const worker = await workerGetter(uri);

    const { code, lib } = await worker.getReactScript(uri);
    const value = await worker.getCode(uri);
    return {
      "/component.react": {
        text: value
      },
      "/component.jsx": {
        text: code
      }
    };
  }

  return {};
};
