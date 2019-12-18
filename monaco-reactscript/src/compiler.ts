import * as ts from "./lib/typescriptServices";
import { formatCode } from "./prettify";

const getJsxElementsFromBinaryExpression = (
  binaryExpr: ts.BinaryExpression
): ts.JsxElement[] => {
  if (
    !ts.isJsxElement(binaryExpr.left) &&
    !ts.isJsxSelfClosingElement(binaryExpr.left)
  ) {
    return;
  }

  if (
    ts.isJsxElement(binaryExpr.right) ||
    ts.isJsxSelfClosingElement(binaryExpr.right)
  ) {
    return [binaryExpr.left, binaryExpr.right];
  } else if (ts.isBinaryExpression(binaryExpr.right)) {
    const inside = getJsxElementsFromBinaryExpression(binaryExpr.right);
    return [binaryExpr.left, ...inside];
  }

  return [];
};

const getJsxElementsFromExpression = (
  expression: ts.Expression
): ts.JsxElement[] => {
  if (ts.isJsxElement(expression) || ts.isJsxSelfClosingElement(expression)) {
    return [expression];
    // console.log(
    //   printer.printNode(
    //     ts.EmitHint.Unspecified,
    //     stmt.expression,
    //     sourceFile
    //   )
    // );
  } else if (ts.isBinaryExpression(expression)) {
    return getJsxElementsFromBinaryExpression(expression);
  } else if (ts.isParenthesizedExpression(expression)) {
    return getJsxElementsFromExpression(expression.expression);
  } else {
    return [];
  }
};

const createJsxReturnStatement = (jsx: ts.JsxElement[]) => {
  let jsxElement = jsx.length > 1 ? createReactFragment(jsx) : jsx[0];
  return ts.createReturn(ts.createParen(jsxElement));
};

const splitJsx = (sourceFile: ts.SourceFile) => {
  const { statements } = sourceFile;
  let jsxElements = [];
  const lastStmt = statements[statements.length - 1];
  if (ts.isExpressionStatement(lastStmt) || ts.isReturnStatement(lastStmt)) {
    jsxElements = getJsxElementsFromExpression(lastStmt.expression);
  }

  return { jsxElements, body: statements.slice(0, statements.length - 1) };
};

const getParts = (sourceFile: ts.SourceFile) => {
  const { jsxElements, body } = splitJsx(sourceFile);
  let globalStmts = [];
  let funcStmts = [];

  for (var i = 0; i < body.length; i++) {
    var stmt = body[i];
    if (ts.isBlock(stmt)) {
      globalStmts = globalStmts.concat(stmt.statements);
    } else {
      funcStmts.push(stmt);
    }
  }

  return { jsxElements, globalStmts, funcStmts };
};

// export const iden = (program: ts.Program, fileName) => {
//   program.
// };

export const compile = (program: ts.Program, fileName: string) => {
  const sourceFile = program.getSourceFile(fileName);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const { jsxElements, globalStmts, funcStmts } = getParts(sourceFile);
  const checker = program.getTypeChecker();

  const declarations = {};
  const unidentified = [];
  function visit(node) {
    if (ts.isIdentifier(node)) {
      const symbol = checker.getSymbolAtLocation(node);
      // ids.push(node);
      if (!symbol && !declarations[node.text]) {
        unidentified.push(node.text);
      }
    }

    if (ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node)) {
      if (ts.isIdentifier(node.name)) {
        declarations[node.name.text] = node;
      }
    }
    // if (ts.IsDecl)
    ts.forEachChild(node, visit);
  }

  ts.forEachChild(sourceFile, visit);
  console.log(unidentified);
  // console.log(declarations);

  const declaration = ts.createFunctionDeclaration(
    undefined,
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    ts.createIdentifier("Code"),
    undefined,
    [],
    undefined,
    ts.createBlock([...funcStmts, createJsxReturnStatement(jsxElements)], true)
  );

  const importReact = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(ts.createIdentifier("React"), undefined),
    ts.createStringLiteral("react")
  );

  const importLib = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamedImports(
        unidentified.map(i =>
          ts.createImportSpecifier(undefined, ts.createIdentifier(i))
        )
      )
    ),
    ts.createStringLiteral("./lib")
  );

  console.log(
    printer.printNode(ts.EmitHint.Unspecified, importLib, sourceFile)
  );

  const code = [
    importReact,
    ...(unidentified.length > 0 ? [importLib] : []),
    ...globalStmts,
    declaration
  ]
    .map(stmt => printer.printNode(ts.EmitHint.Unspecified, stmt, sourceFile))
    .join("\n");

  const compiled = formatCode(code);
  console.log(compiled);
  return { code: compiled, lib: unidentified };
};

export const format = (sourceFile: ts.SourceFile) => {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const { jsxElements, body } = splitJsx(sourceFile);
  const jsxElement =
    jsxElements.length > 1 ? createReactFragment(jsxElements) : jsxElements[0];

  const code = body
    .map(stmt => printer.printNode(ts.EmitHint.Unspecified, stmt, sourceFile))
    .join("\n");

  const fullCode =
    code +
    "\n\n" +
    printer.printNode(ts.EmitHint.Unspecified, jsxElement, sourceFile);

  const formatted = formatCode(fullCode);
  return formatted.slice(0, formatted.length - 2);
};

function createReactFragment(jsx: ts.JsxElement[]) {
  return ts.createJsxElement(
    ts.createJsxOpeningElement(
      ts.createPropertyAccess(
        ts.createIdentifier("React"),
        ts.createIdentifier("Fragment")
      ),
      undefined,
      ts.createJsxAttributes([])
    ),
    jsx,
    ts.createJsxClosingElement(
      ts.createPropertyAccess(
        ts.createIdentifier("React"),
        ts.createIdentifier("Fragment")
      )
    )
  );
}
