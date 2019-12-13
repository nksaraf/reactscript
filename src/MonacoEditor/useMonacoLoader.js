import { useEffect, useState } from "preact/hooks";

export function noop() {}

export const useMonacoLoader = (handleLoad = () => {}) => {
  const [monaco, setMonaco] = useState(window.monaco);
  const onMonacoLoad = e => {
    var paths = {
      "vs/basic-languages": "../../node_modules/monaco-languages/release/dev",
      "vs/language/typescript": "../../monaco-reactscript/release/dev",
      vs: "../../node_modules/monaco-editor-core/min/vs"
    };
    if (document.location.protocol === "http:") {
      // Add support for running local http server
      let testIndex = document.location.pathname.indexOf("/dist/");
      if (testIndex !== -1) {
        let prefix = document.location.pathname.substr(0, testIndex);
        paths["vs/language/typescript"] =
          prefix + "/monaco-reactscript/release/dev";
      }
    }
    window.require.config({
      paths
    });
    window.require(["vs/editor/editor.main"], () => {
      window.require(
        [
          "vs/basic-languages/monaco.contribution",
          "vs/language/typescript/monaco.contribution"
        ],
        () => {
          handleLoad();
          setMonaco(window.monaco);
          setLoaded(true);
        }
      );
    });

    if (e) {
      e.target.removeEventListener("load", onMonacoLoad);
    }
  };

  const loadScript = (src, onLoad) => {
    const loaderScript = window.document.createElement("script");
    loaderScript.type = "text/javascript";
    // @note: Due to the way AMD is being used by Monaco, there is currently no graceful way to integrate Monaco into webpack (cf. https://github.com/Microsoft/monaco-editor/issues/18):
    loaderScript.src = src;
    loaderScript.addEventListener("load", onLoad);
    window.document.body.appendChild(loaderScript);
  };

  useEffect(() => {
    // @note: safe to not check typeof window since it'll call on componentDidMount lifecycle:
    if (!window.monaco) {
      if (!window.require) {
        loadScript(
          "../../node_modules/monaco-editor-core/min/vs/loader.js",
          onMonacoLoad
        );
      } else {
        onMonacoLoad({});
      }
    }
  }, []);

  return monaco;
};
