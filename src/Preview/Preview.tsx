import { h } from "preact";
import { ISandpackContext } from "../types";
import { useRef, useEffect } from "preact/hooks";
import { useSandpack, Bundler } from "../Sandpack/SandpackProvider";
import { memo } from "preact/compat";

export interface PreviewProps {
  sandpack: ISandpackContext;
}

export const Preview = memo(() => {
  const ref = useRef(null);
  const sandpack = useSandpack();
  const browserFrame = sandpack.browserFrame;
  useEffect(() => {
    if (browserFrame) {
      browserFrame.style.width = "100%";
      browserFrame.style.height = "500px";
      browserFrame.style.visibility = "visible";
      browserFrame.style.position = "relative";
    }
  }, [browserFrame]);

  return (
    <div ref={ref}>
      <Bundler
        onMount={sandpack.onBundlerMount}
        bundlerURL={sandpack.bundlerURL}
      />
    </div>
  );
});

// class Preview extends React.Component<PreviewProps> {
//   container?: HTMLDivElement;

//   setContainerElement = (el: HTMLDivElement) => {
//     this.container = el;
//   };

//   initializeFrame = () => {
//     const { browserFrame } = this.props.sandpack;

//     if (browserFrame && this.container) {
//       browserFrame.style.width = "100%";
//       browserFrame.style.height = "500px";
//       browserFrame.style.visibility = "visible";
//       browserFrame.style.position = "relative";

//       this.container.appendChild(browserFrame);
//     }
//   };

//   componentDidUpdate(prevProps: PreviewProps) {
//     if (prevProps.sandpack.browserFrame !== this.props.sandpack.browserFrame) {
//       this.initializeFrame();
//     }
//   }

//   render() {}
// }

// export default withSandpack(Preview);
