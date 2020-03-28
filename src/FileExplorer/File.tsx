import { h } from "preact";
import { Box } from "preact-box";

export interface Props {
  path: string;
  selectFile?: (path: string) => void;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const File = ({ path, active, selectFile, onClick }: Props) => {
  const handleClick = () => {
    if (selectFile) {
      selectFile(path);
    } else {
      onClick;
    }
  };

  const fileName = path
    .split("/")
    .filter(Boolean)
    .pop();

  return <Box onClick={handleClick}>{fileName}</Box>;
};
