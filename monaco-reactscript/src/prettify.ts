import prettier from "./lib/standalone";
import babylon from "./lib/parser-babylon";

export const formatCode = (code: string): string => {
  const text = prettier.format(code, {
    parser: "babel",
    plugins: [babylon],
    singleQuote: true
  });

  return text;
};
