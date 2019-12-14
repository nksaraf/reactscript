import * as ts from "./lib/typescriptServices";
console.log(ts);

interface DocEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
}

function formatEnum(value, enumObject, isFlags) {
  if (value === void 0) {
    value = 0;
  }
  var members = getEnumMembers(enumObject);
  if (value === 0) {
    return members.length > 0 && members[0][0] === 0 ? members[0][1] : "0";
  }
  if (isFlags) {
    var result = "";
    var remainingFlags = value;
    for (var i = members.length - 1; i >= 0 && remainingFlags !== 0; i--) {
      var _a = members[i],
        enumValue = _a[0],
        enumName = _a[1];
      if (enumValue !== 0 && (remainingFlags & enumValue) === enumValue) {
        remainingFlags &= ~enumValue;
        result = "" + enumName + (result ? "|" : "") + result;
      }
    }
    if (remainingFlags === 0) {
      return result;
    }
  } else {
    for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
      var _b = members_1[_i],
        enumValue = _b[0],
        enumName = _b[1];
      if (enumValue === value) {
        return enumName;
      }
    }
  }
  return value.toString();
}

function getEnumMembers(enumObject) {
  var result = [];
  for (var name in enumObject) {
    var value = enumObject[name];
    if (typeof value === "number") {
      result.push([value, name]);
    }
  }
  return result.sort();
}

function formatSyntaxKind(kind) {
  return formatEnum(kind, ts.SyntaxKind, /*isFlags*/ false);
}

function printAllChildren(node: ts.Node, depth = 0) {
  depth++;
  if (node.getChildCount() > 0) {
    console.group(
      new Array(depth + 1).join("----"),
      formatSyntaxKind(node.kind),
      node.pos,
      node.end
    );
    node.getChildren().forEach(c => printAllChildren(c, depth));
    console.groupEnd();
  } else {
    console.log(
      new Array(depth + 1).join("----"),
      formatSyntaxKind(node.kind),
      node.pos,
      node.end
    );
  }
}

/** True if this is visible outside this file, false otherwise */
function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) &
      ts.ModifierFlags.Export) !==
      0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}

export const util = (program: ts.Program, fileName: string) => {
  let checker = program.getTypeChecker();
  function visit(node: ts.Node) {
    // Only consider exported nodes
    if (ts.isJsxElement(node)) {
      let symbol = checker.getSymbolAtLocation(node.name);
      console.log(node);
    }
    if (isNodeExported(node)) {
      let symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) {
        console.log(symbol);
      }
    }
    ts.forEachChild(node, visit);
  }

  function serializeSymbol(symbol: ts.Symbol): DocEntry {
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(
        symbol.getDocumentationComment(checker)
      ),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
      )
    };
  }

  /** Serialize a class symbol information */
  function serializeClass(symbol: ts.Symbol) {
    let details = serializeSymbol(symbol);

    // Get the construct signatures
    let constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!
    );
    details.constructors = constructorType
      .getConstructSignatures()
      .map(serializeSignature);
    return details;
  }

  function visitnote() {
    function visitor(ctx: ts.TransformationContext, sf: ts.SourceFile) {
      const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult => {
        // here we can check each node and potentially return
        // new nodes if we want to leave the node as is, and
        // continue searching through child nodes:
        return ts.visitEachChild(node, visitor, ctx);
      };
      return visitor;
    }
    return (ctx: ts.TransformationContext): ts.Transformer => {
      return (sf: ts.SourceFile) => ts.visitNode(sf, visitor(ctx, sf));
    };
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: ts.Signature) {
    return {
      parameters: signature.parameters.map(serializeSymbol),
      returnType: checker.typeToString(signature.getReturnType()),
      documentation: ts.displayPartsToString(
        signature.getDocumentationComment(checker)
      )
    };
  }

  const emitResult = program.emit(undefined, undefined, undefined, undefined, {
    before: [visitnote()]
  });

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  console.log(emitResult);

  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      sourceFile.statements.forEach(console.log);
      // Walk the tree to search for classes
      // ts.for(sourceFile, node => {
      //   console.log(
      //     printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)
      //   );
      // });
    }
  }

  // checker.getExportsOfModule();
  console.log(checker);
};
// /** Generate documentation for all classes in a set of .ts files */
// function generateDocumentation(
//   fileNames: string[],
//   options: ts.CompilerOptions
// ): void {
//   // Build a program using the set of root file names in fileNames
//   let program = ts.createProgram(fileNames, options);

//   // Get the checker, we will use it to find more about classes
//   let checker = program.getTypeChecker();

//   let output: DocEntry[] = [];

//   // Visit every sourceFile in the program
//   for (const sourceFile of program.getSourceFiles()) {
//     if (!sourceFile.isDeclarationFile) {
//       // Walk the tree to search for classes
//       ts.forEachChild(sourceFile, visit);
//     }
//   }

//   // print out the doc
//   fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));

//   return;

//   /** visit nodes finding exported classes */
//   function visit(node: ts.Node) {
//     // Only consider exported nodes
//     if (!isNodeExported(node)) {
//       return;
//     }

//     if (ts.isClassDeclaration(node) && node.name) {
//       // This is a top level class, get its symbol
//       let symbol = checker.getSymbolAtLocation(node.name);
//       if (symbol) {
//         output.push(serializeClass(symbol));
//       }
//       // No need to walk any further, class expressions/inner declarations
//       // cannot be exported
//     } else if (ts.isModuleDeclaration(node)) {
//       // This is a namespace, visit its children
//       ts.forEachChild(node, visit);
//     }
//   }

//   /** Serialize a symbol into a json object */
//   function serializeSymbol(symbol: ts.Symbol): DocEntry {
//     return {
//       name: symbol.getName(),
//       documentation: ts.displayPartsToString(
//         symbol.getDocumentationComment(checker)
//       ),
//       type: checker.typeToString(
//         checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
//       )
//     };
//   }

//   /** Serialize a class symbol information */
//   function serializeClass(symbol: ts.Symbol) {
//     let details = serializeSymbol(symbol);

//     // Get the construct signatures
//     let constructorType = checker.getTypeOfSymbolAtLocation(
//       symbol,
//       symbol.valueDeclaration!
//     );
//     details.constructors = constructorType
//       .getConstructSignatures()
//       .map(serializeSignature);
//     return details;
//   }

//   /** Serialize a signature (call or construct) */
//   function serializeSignature(signature: ts.Signature) {
//     return {
//       parameters: signature.parameters.map(serializeSymbol),
//       returnType: checker.typeToString(signature.getReturnType()),
//       documentation: ts.displayPartsToString(
//         signature.getDocumentationComment(checker)
//       )
//     };
//   }

//   /** True if this is visible outside this file, false otherwise */
//   function isNodeExported(node: ts.Node): boolean {
//     return (
//       (ts.getCombinedModifierFlags(node as ts.Declaration) &
//         ts.ModifierFlags.Export) !==
//         0 ||
//       (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
//     );
//   }
// }

// generateDocumentation(process.argv.slice(2), {
//   target: ts.ScriptTarget.ES5,
//   module: ts.ModuleKind.CommonJS
// });
