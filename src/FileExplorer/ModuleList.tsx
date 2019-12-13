
import { IFiles, IFile } from "../types";

import { File } from "./File";
import { Directory } from "./Directory";
import { Box } from "../Box";
import { h } from "preact";

export interface Props {
  prefixedPath: string;
  files: IFiles;
  selectFile: (path: string) => void;
  openedPath: string;
  depth?: number;
}

export const ModuleList = ({
  depth = 0,
  openedPath,
  selectFile,
  prefixedPath,
  files
}: Props) => {
  const fileListWithoutPrefix = Object.keys(files)
    .filter(file => file.startsWith(prefixedPath))
    .map(file => file.substring(prefixedPath.length));

  const directoriesToShow = new Set(
    fileListWithoutPrefix
      .filter(file => file.includes("/"))
      .map(file => `${prefixedPath}${file.split("/")[0]}/`)
  );

  const filesToShow = fileListWithoutPrefix
    .filter(file => !file.includes("/"))
    .map(file => ({ path: `${prefixedPath}${file}` }));

  return (
    <Box marginLeft={`${0.5 * depth}rem`}>
      {Array.from(directoriesToShow).map(dir => (
        <Directory
          key={dir}
          prefixedPath={dir}
          files={files}
          selectFile={selectFile}
          openedPath={openedPath}
          depth={depth + 1}
        />
      ))}

      {filesToShow.map(file => (
        <File
          key={file.path}
          selectFile={selectFile}
          path={file.path}
          active={openedPath === file.path}
        />
      ))}
    </Box>
  );
};
