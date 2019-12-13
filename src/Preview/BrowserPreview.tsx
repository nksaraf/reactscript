import { h } from "preact";
import { Box } from "../Box";

import { Preview } from "./Preview";
// import Navigator from "../Navigator";

export const BrowserPreview = (props: any) => {
  return (
    <Box {...props}>
      {/* <Navigator /> */}
      <Preview />
    </Box>
  );
};
