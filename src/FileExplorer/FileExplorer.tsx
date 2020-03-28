// import { useSandpack } from "../core/SandpackProvider";
import { h } from "preact";
import { Box } from "preact-box";

import { ModuleList } from "./ModuleList";
import { useSandbox } from "../core/useSandbox";

export const FileExplorer = props => {
  const { openedPath, sandboxFiles, openFile } = useSandbox();
  return (
    <Box backgroundColor="#24282a" color="white" paddingTop="0.5em" {...props}>
      <ModuleList
        selectFile={openFile}
        files={sandboxFiles}
        prefixedPath="/"
        openedPath={openedPath}
      />
    </Box>
  );
};
