import * as ts from "./lib/typescriptServices";
import { formatCode } from "./prettify";

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const print = (node, sourceFile) => {
  return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
};

const getJsxElementsFromBinaryExpression = (
  binaryExpr: ts.BinaryExpression
): (ts.JsxElement | ts.JsxSelfClosingElement)[] => {
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
): (ts.JsxElement | ts.JsxSelfClosingElement)[] => {
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
  } else if (ts.isReturnStatement(expression)) {
    return getJsxElementsFromExpression(expression.expression);
  } else {
    return [];
  }
};

const createJsxReturnStatement = (jsx: ts.JsxElement[]) => {
  let jsxElement = jsx.length > 1 ? createReactFragment(jsx) : jsx[0];
  return ts.createReturn(ts.createParen(jsxElement));
};

const splitJsx = (statements: ts.NodeArray<ts.Statement>) => {
  let jsxElements = [];
  const lastStmt = statements[statements.length - 1];
  if (ts.isExpressionStatement(lastStmt) || ts.isReturnStatement(lastStmt)) {
    jsxElements = getJsxElementsFromExpression(lastStmt.expression);
  }

  return { jsxElements, body: statements.slice(0, statements.length - 1) };
};

const getParts = (statements: ts.NodeArray<ts.Statement>) => {
  const { jsxElements, body } = splitJsx(statements);
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

const getFunction = (stmt: ts.Node): ts.NodeArray<ts.Statement> => {
  if (
    // (ts.isVariableStatement(stmt) |
    stmt.modifiers &&
    stmt.modifiers[0].kind === ts.SyntaxKind.ExportKeyword
  ) {
    if (ts.isVariableStatement(stmt)) {
      if (stmt.declarationList.declarations.length === 1) {
        const decl = stmt.declarationList.declarations[0];
        if (
          ts.isIdentifier(decl.name) &&
          decl.name.text.charAt(0) === decl.name.text.charAt(0).toUpperCase()
        ) {
          if (ts.isArrowFunction(decl.initializer)) {
            const body = decl.initializer.body;
            if (ts.isBlock(body)) {
              return body.statements;
            } else {
              return [ts.createReturn(body)];
            }
          } else if (ts.isFunctionExpression(decl.initializer)) {
            return decl.initializer.body.statements;
          }
        }
      }
    } else if (ts.isFunctionDeclaration(stmt)) {
      return stmt.body.statements;
    }

    return undefined;
  }
};

export const compile = (program: ts.Program, fileName: string) => {
  const sourceFile = program.getSourceFile(fileName);

  const { statements } = sourceFile;

  // const source = ts.createSourceFile(
  //   "test.tsx",
  //   text,
  //   ts.ScriptTarget.Latest,
  //   /*setParentNodes*/ false,
  //   ts.ScriptKind.TSX
  // );

  // const { statements } = source;

  let jsx = [];
  statements.forEach(stmt => {
    const func = getFunction(stmt);
    if (func) {
      console.log(formatCode(writeScript(func, sourceFile)));
    }
    // if (ts.isImportDeclaration(stmt)) {
    // }
  });

  const { jsxElements, globalStmts, funcStmts } = getParts(statements);
  const checker = program.getTypeChecker();

  const declarations = {};
  const unidentified = {};
  function visit(node) {
    if (ts.isIdentifier(node)) {
      const symbol = checker.getSymbolAtLocation(node);
      // ids.push(node);
      if (
        !symbol &&
        !declarations[node.text] &&
        !ts.isPropertyAccessExpression(node.parent) &&
        node.text.length > 0
      ) {
        unidentified[node.text] = "";
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
        Object.keys(unidentified).map(i =>
          ts.createImportSpecifier(undefined, ts.createIdentifier(i))
        )
      )
    ),
    ts.createStringLiteral("./lib")
  );

  const code = [
    importReact,
    ...(Object.keys(unidentified).length > 0 ? [importLib] : []),
    ...globalStmts,
    declaration
  ]
    .map(stmt => printer.printNode(ts.EmitHint.Unspecified, stmt, sourceFile))
    .join("\n");

  const compiled = formatCode(code);
  console.log(compiled);
  return { code: compiled, lib: unidentified };
};

export const writeScript = (statements: any, sourceFile: any) => {
  const { jsxElements, body } = splitJsx(statements);
  const jsxElement =
    jsxElements.length > 1 ? createReactFragment(jsxElements) : jsxElements[0];
  const code = body.map(stmt => print(stmt, sourceFile)).join("\n");
  const fullCode = code + "\n\n" + print(jsxElement, sourceFile);
  return fullCode;
};

export const format = (sourceFile: ts.SourceFile) => {
  const { statements } = sourceFile;

  try {
    const formatted = formatCode(writeScript(statements, sourceFile));
    return formatted.slice(0, formatted.length - 2);
  } catch (e) {
    return formatCode(sourceFile.getFullText());
  }
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
