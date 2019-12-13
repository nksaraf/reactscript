// import defaultParserInterface from '../utils/defaultParserInterface';
// import pkg from 'typescript/package.json';

// import typescript from 'typescript';

// const syntaxKind : any = {};

// for (const name of Object.keys(typescript.SyntaxKind).filter(x => isNaN(parseInt(x)))) {
//   const value = typescript.SyntaxKind[name as any];
//   if (!syntaxKind[value]) {
//       syntaxKind[value] = name;
//   }
// }

// const FILENAME = 'file.tsx';

// if (!global.process) {
//   global.process = {}
// }

// const compilerHost/*: typescript.CompilerHost*/ = {
//   code: '',
//   fileExists: () => true,
//   getCanonicalFileName: (filename: string) => filename,
//   getCurrentDirectory: () => '',
//   getDefaultLibFileName: () => 'lib.d.ts',
//   getNewLine: () => '\n',
//   readFile: () : any => null,
//   useCaseSensitiveFileNames: () => true,
//   getSourceFile: (filename: string) => typescript.createSourceFile(filename, '', typescript.ScriptTarget.Latest, true),
//   writeFile: () : any => null,
// };

// compilerHost.getSourceFile = (filename: string) => {
//   return typescript.createSourceFile(filename, compilerHost.code, typescript.ScriptTarget.Latest, true);
// }

// export const getSourceFile = (code: string) => {
//   const filename = FILENAME;

//   // (compilerHost as any).code = code;

//   // const program = typescript.createProgram([filename], {
//   //   noResolve: true,
//   //   target: typescript.ScriptTarget.Latest,
//   //   // experimentalDecorators: options.experimentalDecorators,
//   //   // experimentalAsyncFunctions: options.experimentalAsyncFunctions,
//   //   jsx: typescript.JsxEmit.Preserve,
//   // }, compilerHost);

//   // const sourceFile = program.getSourceFile(filename);
//   // return sourceFile;

//   const sourceFile = typescript.createSourceFile(
//     filename,
//     code,
//     typescript.ScriptTarget.Latest,
//     /*setParentNodes */ true
//   );

//   return sourceFile
// }

// export const getScope = (sourceFile: typescript.SourceFile) => {
//   const identifiers : string[]= [];
//   function delintNode(node: typescript.Node) {
//     switch (node.kind) {
//       case typescript.SyntaxKind.Identifier: {
//         identifiers.push(node.text);
//       }
//       // case typescript.SyntaxKind.ForInStatement:
//       // case typescript.SyntaxKind.WhileStatement:
//       // case typescript.SyntaxKind.DoStatement:
//       //   if ((node as typescript.IterationStatement).statement.kind !== typescript.SyntaxKind.Block) {
//       //     report(
//       //       node,
//       //       'A looping statement\'s contents should be wrapped in a block body.'
//       //     );
//       //   }
//       //   break;

//       // case typescript.SyntaxKind.IfStatement:
//       //   const ifStatement = node as typescript.IfStatement;
//       //   if (ifStatement.thenStatement.kind !== typescript.SyntaxKind.Block) {
//       //     report(
//       //       ifStatement.thenStatement,
//       //       'An if statement\'s contents should be wrapped in a block body.'
//       //     );
//       //   }
//       //   if (
//       //     ifStatement.elseStatement &&
//       //     ifStatement.elseStatement.kind !== typescript.SyntaxKind.Block &&
//       //     ifStatement.elseStatement.kind !== typescript.SyntaxKind.IfStatement
//       //   ) {
//       //     report(
//       //       ifStatement.elseStatement,
//       //       'An else statement\'s contents should be wrapped in a block body.'
//       //     );
//       //   }
//       //   break;

//       // case typescript.SyntaxKind.BinaryExpression:
//       //   const op = (node as typescript.BinaryExpression).operatorToken.kind;
//       //   if (
//       //     op === typescript.SyntaxKind.EqualsEqualsToken ||
//       //     op === typescript.SyntaxKind.ExclamationEqualsToken
//       //   ) {
//       //     report(node, 'Use \'===\' and \'!==\'.');
//       //   }
//       //   break;
//     }

//     typescript.forEachChild(node, delintNode);
//   }

//   delintNode(sourceFile);
//   return identifiers;
// }

// export { typescript };

// // const getCompilerHost = () => {

// // }

// // const ID = 'typescript';

// // export default {
// //   ...defaultParserInterface,

// //   id: ID,
// //   displayName: ID,
// //   version: pkg.version,
// //   homepage: pkg.homepage,
// //   locationProps: new Set(['pos', 'end']),
// //   typeProps: new Set(['kind']),

// //   parse(ts, code, options) {

// //     // getComments = (node, isTrailing) => {
// //     //   if (node.parent) {
// //     //     const nodePos = isTrailing ? node.end : node.pos;
// //     //     const parentPos = isTrailing ? node.parent.end : node.parent.pos;

// //     //     if (node.parent.kind === typescript.SyntaxKind.SourceFile || nodePos !== parentPos) {
// //     //       let comments = isTrailing ?
// //     //         typescript.getTrailingCommentRanges(sourceFile.text, nodePos) :
// //     //         typescript.getLeadingCommentRanges(sourceFile.text, nodePos);

// //     //       if (Array.isArray(comments)) {
// //     //         commentypescript.forEach((comment) => {
// //     //           comment.type = syntaxKind[comment.kind];
// //     //           comment.text = sourceFile.text.substring(comment.pos, comment.end);
// //     //         });

// //     //         return comments;
// //     //       }
// //     //     }
// //     //   }
// //     // };

// //   },

// //   getNodeName(node) {
// //     if (node.kind) {
// //       return syntaxKind[node.kind];
// //     }
// //   },

// //   _ignoredProperties: new Set([
// //     'file',
// //     'parent',
// //   ]),

// //   *forEachProperty(node) {
// //     if (node && typeof node === 'object') {
// //       for (let prop in node) {
// //         if (this._ignoredProperties.has(prop) || prop.charAt(0) === '_') {
// //           continue;
// //         }
// //         yield {
// //           value: node[prop],
// //           key: prop,
// //         };
// //       }
// //       if (node.parent) {
// //         yield {
// //           value: getComments(node),
// //           key: 'leadingComments',
// //           computed: true,
// //         };
// //         yield {
// //           value: getComments(node, true),
// //           key: 'trailingComments',
// //           computed: true,
// //         };
// //       }
// //     }
// //   },

// //   nodeToRange(node) {
// //     if (typeof node.getStart === 'function' &&
// //         typeof node.getEnd === 'function') {
// //       return [node.getStart(), node.getEnd()];
// //     } else if (typeof node.pos !== 'undefined' &&
// //         typeof node.end !== 'undefined') {
// //       return [node.pos, node.end];
// //     }
// //   },

// //   opensByDefault(node, key) {
// //     return (
// //       key === 'statements' ||
// //       key === 'declarationList' ||
// //       key === 'declarations'
// //     );
// //   },

// //   getDefaultOptions() {
// //     return {
// //       experimentalDecorators: true,
// //       experimentalAsyncFunctions: true,
// //       jsx: true,
// //     };
// //   },

// // };
