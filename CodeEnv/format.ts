import prettier from 'prettier/standalone';
import babylon from 'prettier/parser-babylon';
import { parseCode } from './parse';

export interface CursorPosition {
  lineNumber: number;
  column: number;
}

export interface FormattedResult {
  formattedCode: string;
  formattedCursor: CursorPosition;
  error?: any
}

export type FormatFunction = (code: string, cursor: CursorPosition) => FormattedResult;

export const runPrettier = (code: string, cursorOffset: number) => {
  try {
    const { formatted: formattedCode, cursorOffset: formattedCursor } = prettier.formatWithCursor(code, {
      cursorOffset,
      parser: 'babel',
      plugins: [babylon]
    });

    return { formattedCode, formattedCursor, error: null };
  } catch (err) {
    // Just a formatting error so we pass
    console.error(err);
    return { formattedCode: code, formattedCursor: cursorOffset, error: err };
  }
};

export const positionToCursorOffset = (
  code: string,
  { lineNumber: line, column: ch }: CursorPosition
) => {
  return code.split('\n').reduce((pos, currLine, index) => {
    if (index < line - 1) {
      return pos + currLine.length + 1;
    } else if (index === line - 1) {
      return pos + line;
    }
    return pos;
  }, 0);
};

export const cursorOffsetToPosition = (
  code: string,
  cursorOffset: number
): CursorPosition => {
  const substring = code.slice(0, cursorOffset - 1);
  const line = substring.split('\n').length;
  const indexOfLastLine = substring.lastIndexOf('\n');

  return {
    lineNumber: line,
    column: cursorOffset - indexOfLastLine - 1
  };
};

export const wrapJsx = (code: string) => `<>\n${code}\n</>`;

// Removes `<>\n`  and `\n</>` and unindents the two spaces due to the wrapping
export const unwrapJsx = (code: string) => code.replace(/\n {2}/g, '\n').slice(3, -5);

export function formatCode(
  code: string,
  cursor: CursorPosition
): FormattedResult {
  const  { jsx, nonJsx, returnStatement } = parseCode(code);
  var { formattedCode: jsxFormatted, formattedCursor } = formatJsx(jsx, cursor);

  if (nonJsx.length === 0) {
    return { formattedCode: jsxFormatted, formattedCursor };
  }

  var { formattedCode: nonJsxFormatted } = formatNonJsx(nonJsx, cursor);
  return { formattedCode: `${nonJsxFormatted}\n${jsxFormatted}`, formattedCursor };
}

export const formatNonJsx = (
  code: string,
  cursor: CursorPosition
): FormattedResult => {
  const { formattedCode, formattedCursor, error } = runPrettier(
    code,
    positionToCursorOffset(code, cursor)
  );

  if (error) {
    return { formattedCode: code, formattedCursor: cursor  }
  }

  return {
    formattedCode,
    formattedCursor: cursorOffsetToPosition(
      formattedCode,
      formattedCursor
    )
  };
}

// Handles running prettier, ensuring multiple root level JSX values are valid
// by wrapping the code in <>{code}</> then finally removing the layer of indentation
// all while maintaining the cursor position.
export const formatJsx = (
  code: string,
  { lineNumber, column }: CursorPosition
): FormattedResult => {
  // Since we're automatically adding a line due to the wrapping we need to
  // remove one
  const WRAPPED_LINE_OFFSET = 1;
  // Since we are wrapping we need to "unindent" the cursor one level , i.e two spaces.
  const WRAPPED_INDENT_OFFSET = 3;

  const wrappedCode = wrapJsx(code);
  const currentCursorPosition = positionToCursorOffset(wrappedCode, {
    lineNumber: lineNumber + WRAPPED_LINE_OFFSET,
    column
  });

  const { formattedCode, formattedCursor, error } = runPrettier(
    wrappedCode,
    currentCursorPosition
  );

  if (error) {
    return { formattedCode: code, formattedCursor: { lineNumber, column }  };
  }

  const unWrappedCode = unwrapJsx(formattedCode);
  const formattedPosition = cursorOffsetToPosition(
    formattedCode,
    formattedCursor
  );

  return {
    formattedCode: unWrappedCode,
    formattedCursor: {
      lineNumber: formattedPosition.lineNumber - WRAPPED_LINE_OFFSET,
      column: formattedPosition.column - WRAPPED_INDENT_OFFSET
    }
  };
};
