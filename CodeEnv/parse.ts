export function parseCode(code: string) {
  const trimmed = code.trim() || '';
  if (trimmed.length === 0 || trimmed.search(/<[>A-Za-z]/) === 0) {
    return { jsx: trimmed, nonJsx: '', returnStatement: false };
  } else {
    if (trimmed.search('return') < 0) {
      const jsxStart = trimmed.search(/<[>A-Za-z]/);
      const nonJsx = trimmed.substring(0, jsxStart - 1).trim();
      const jsx = trimmed
        .substring(jsxStart)
        .replace(/^\(+/g, '')
        .replace(/[\);]+$/g, '')
        .trim();

      return { jsx, nonJsx, returnStatement: false };
    } else {
      const returnStart = trimmed.search('return ');
      const nonJsx = trimmed.substring(0, returnStart - 1).trim();
      const jsx = trimmed
        .substring(returnStart)
        .replace(/^return/, '')
        .trim()
        .replace(/^\(+/g, '')
        .replace(/[\);]+$/g, '')
        .trim();
      return { jsx, nonJsx, returnStatement: true };
    }
  }
};

