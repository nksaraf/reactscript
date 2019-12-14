import { registerFrame } from "codesandbox-api";
import { useBundler } from "./bundler";
import { useRef } from "preact/hooks";
import { h } from "preact";
import { useCodesandbox } from "./sandpack";

export const SandpackFrame = ({ ...props }) => {
  const { bundlerURL } = useBundler();
  const iframe = useRef();

  const handleMessage = (message: any) => {
    if (message.type === "initialized") {
      if (iframe.current && iframe.current.contentWindow) {
        registerFrame(iframe.current.contentWindow, bundlerURL);
        // if (fileResolver) {
        //   this.fileResolverProtocol = new Protocol(
        //     "file-resolver",
        //     async (data: { m: "isFile" | "readFile"; p: string }) => {
        //       if (data.m === "isFile") {
        //         return fileResolver!.isFile(data.p);
        //       }
        //       return fileResolver!.readFile(data.p);
        //     },
        //     iframe.current.contentWindow
        //   );
        // }
      }
    }
  };

  useCodesandbox(handleMessage);

  return (
    <iframe
      ref={iframe}
      title="sandpack-sandbox"
      key={1}
      {...props}
      // style={{
      //   width: "100%",
      //   height: "50%",
      //   border: 0,
      //   outline: 0
      //   // position: "absolute"
      //   // visibility: "hidden"
      // }}
      sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
      src={bundlerURL}
    />
  );
};
