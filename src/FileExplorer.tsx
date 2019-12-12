import { useSandpack } from "./SandpackProvider";
import { h } from "preact";
import { Box } from "./Box";
import { ModuleList } from "./ModuleList";

export const FileExplorer = props => {
  const sandpack = useSandpack();
  console.log(sandpack);
  return (
    <Box backgroundColor="#24282a" color="white" paddingTop="0.5em" {...props}>
      <ModuleList
        selectFile={sandpack.openFile}
        files={sandpack.files}
        prefixedPath="/"
        openedPath={sandpack.openedPath}
      />
    </Box>
  );
};
