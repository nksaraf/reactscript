import { h } from "preact";

import { File } from "./File";
// import { ModuleList } from "./ModuleList";

import { IFiles } from "./types";
import { useState } from "preact/hooks";
import { Box } from "./Box";

export interface Props {
  prefixedPath: string;
  files: IFiles;
  selectFile: (path: string) => void;
  openedPath: string;
  depth: number;
}

export const Directory = ({
  prefixedPath,
  files,
  selectFile,
  openedPath,
  depth
}: Props) => {
  const [open, setOpen] = useState(true);

  const toggleOpen = () => {
    setOpen(o => !o);
  };

  return (
    <Box key={prefixedPath}>
      <File onClick={toggleOpen} path={prefixedPath + "/"} />
      {open && (
        <div></div>
        // <ModuleList
        //   prefixedPath={prefixedPath}
        //   files={files}
        //   selectFile={selectFile}
        //   openedPath={openedPath}
        //   depth={depth}
        // />
      )}
    </Box>
  );
};
