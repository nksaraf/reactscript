export const createProject = () => {
  const startText = `
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

  const files = {
    "/component.react": {
      text: startText
    },
    "/component.jsx": {
      text: `
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
    `
    },
    "/index.jsx": {
      text: `
import React from "react";
import ReactDOM from "react-dom";
import { Code } from "./component";

function App() {
  return <Code />;
}

const rootElement = document.createElement("root");
document.body.appendChild(rootElement);
ReactDOM.render(<App />, rootElement);
    `
    }
  };

  const dependencies = {
    react: "latest",
    "react-dom": "latest",
    "prop-types": "latest"
  };

  return { files, dependencies };
};

export const reactScript = async files => {
  // console.log(files);
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
