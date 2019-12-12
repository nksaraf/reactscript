import { h } from "preact";
import { useMonacoEditor } from "./useMonacoEditor";
// import { useRef, useEffect, useState } from "preact/hooks";
// import ReactTypes from "./@types/react";
export function processSize(size) {
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

export function OtherEditor({
  height = "800px",
  width = "600px",
  className,
  style,
  language = "reactscript",
  theme = "vs-dark",
  didLoad = () => {},
  didMount = () => {}
}) {
  const { ref } = useMonacoEditor({
    language,
    theme,
    onMount: didMount
  });

  const fixedWidth = processSize(width);
  const fixedHeight = processSize(height);
  const other = {
    width: fixedWidth,
    height: fixedHeight
  };

  return (
    <div ref={ref} className={className} style={{ height, width, ...style }} />
  );
}
