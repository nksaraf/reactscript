import { h } from "preact";
import { useRef, useEffect, useState } from "preact/hooks";
import ReactTypes from "./@types/react";

export function processSize(size) {
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

// const text = [
//   "/* Game of Life",
//   " * Implemented in TypeScript",
//   " * To learn more about TypeScript, please visit http://www.typescriptlang.org/",
//   " */",
//   "",
//   "module Conway {",
//   "",
//   "	export class Cell {",
//   "		public row: number;",
//   "		public col: number;",
//   "		public live: boolean;",
//   "",
//   "		constructor(row: number, col: number, live: boolean) {",
//   "			this.row = row;",
//   "			this.col = col;",
//   "			this.live = live",
//   "		}",
//   "	}",
//   "",
//   "	export class GameOfLife {",
//   "		private gridSize: number;",
//   "		private canvasSize: number;",
//   "		private lineColor: string;",
//   "		private liveColor: string;",
//   "		private deadColor: string;",
//   "		private initialLifeProbability: number;",
//   "		private animationRate: number;",
//   "		private cellSize: number;",
//   "		private context: CanvasRenderingContext2D;",
//   "		private world;",
//   "",
//   "",
//   "		constructor() {",
//   "			this.gridSize = 50;",
//   "			this.canvasSize = 600;",
//   "			this.lineColor = '#cdcdcd';",
//   "			this.liveColor = '#666';",
//   "			this.deadColor = '#eee';",
//   "			this.initialLifeProbability = 0.5;",
//   "			this.animationRate = 60;",
//   "			this.cellSize = 0;",
//   "			this.world = this.createWorld();",
//   "			this.circleOfLife();",
//   "		}",
//   "",
//   "		public createWorld() {",
//   "			return this.travelWorld( (cell : Cell) =>  {",
//   "				cell.live = Math.random() < this.initialLifeProbability;",
//   "				return cell;",
//   "			});",
//   "		}",
//   "",
//   "		public circleOfLife() : void {",
//   "			this.world = this.travelWorld( (cell: Cell) => {",
//   "				cell = this.world[cell.row][cell.col];",
//   "				this.draw(cell);",
//   "				return this.resolveNextGeneration(cell);",
//   "			});",
//   "			setTimeout( () => {this.circleOfLife()}, this.animationRate);",
//   "		}",
//   "",
//   "		public resolveNextGeneration(cell : Cell) {",
//   "			var count = this.countNeighbors(cell);",
//   "			var newCell = new Cell(cell.row, cell.col, cell.live);",
//   "			if(count < 2 || count > 3) newCell.live = false;",
//   "			else if(count == 3) newCell.live = true;",
//   "			return newCell;",
//   "		}",
//   "",
//   "		public countNeighbors(cell : Cell) {",
//   "			var neighbors = 0;",
//   "			for(var row = -1; row <=1; row++) {",
//   "				for(var col = -1; col <= 1; col++) {",
//   "					if(row == 0 && col == 0) continue;",
//   "					if(this.isAlive(cell.row + row, cell.col + col)) {",
//   "						neighbors++;",
//   "					}",
//   "				}",
//   "			}",
//   "			return neighbors;",
//   "		}",
//   "",
//   "		public isAlive(row : number, col : number) {",
//   "			if(row < 0 || col < 0 || row >= this.gridSize || col >= this.gridSize) return false;",
//   "			return this.world[row][col].live;",
//   "		}",
//   "",
//   "		public travelWorld(callback) {",
//   "			var result = [];",
//   "			for(var row = 0; row < this.gridSize; row++) {",
//   "				var rowData = [];",
//   "				for(var col = 0; col < this.gridSize; col++) {",
//   "					rowData.push(callback(new Cell(row, col, false)));",
//   "				}",
//   "				result.push(rowData);",
//   "			}",
//   "			return result;",
//   "		}",
//   "",
//   "		public draw(cell : Cell) {",
//   "			if(this.context == null) this.context = this.createDrawingContext();",
//   "			if(this.cellSize == 0) this.cellSize = this.canvasSize/this.gridSize;",
//   "",
//   "			this.context.strokeStyle = this.lineColor;",
//   "			this.context.strokeRect(cell.row * this.cellSize, cell.col*this.cellSize, this.cellSize, this.cellSize);",
//   "			this.context.fillStyle = cell.live ? this.liveColor : this.deadColor;",
//   "			this.context.fillRect(cell.row * this.cellSize, cell.col*this.cellSize, this.cellSize, this.cellSize);",
//   "		}",
//   "",
//   "		public createDrawingContext() {",
//   "			var canvas = <HTMLCanvasElement> document.getElementById('conway-canvas');",
//   "			if(canvas == null) {",
//   "					canvas = document.createElement('canvas');",
//   "					canvas.id = 'conway-canvas';",
//   "					canvas.width = this.canvasSize;",
//   "					canvas.height = this.canvasSize;",
//   "					document.body.appendChild(canvas);",
//   "			}",
//   "			return canvas.getContext('2d');",
//   "		}",
//   "	}",
//   "}",
//   "",
//   "var game = new Conway.GameOfLife();"
// ].join("\n");

export function noop() {}

// class MonacoEditor extends React.Component {

//   componentDidMount() {
//     this.initMonaco();
//   }

//   componentDidUpdate(prevProps) {
//     const { value, language, theme, height, options, width } = this.props;

//     const { editor } = this;
//     const model = editor.getModel();

//     if (this.props.value != null && this.props.value !== model.getValue()) {
//       this.__prevent_trigger_change_event = true;
//       this.editor.pushUndoStop();
//       model.pushEditOperations(
//         [],
//         [
//           {
//             range: model.getFullModelRange(),
//             text: value
//           }
//         ]
//       );
//       this.editor.pushUndoStop();
//       this.__prevent_trigger_change_event = false;
//     }
//     if (prevProps.language !== language) {
//       monaco.editor.setModelLanguage(model, language);
//     }
//     if (prevProps.theme !== theme) {
//       monaco.editor.setTheme(theme);
//     }
//     if (editor && (width !== prevProps.width || height !== prevProps.height)) {
//       editor.layout();
//     }
//     if (prevProps.options !== options) {
//       editor.updateOptions(options);
//     }
//   }

//   componentWillUnmount() {
//     this.destroyMonaco();
//   }

//   assignRef = component => {
//     this.containerElement = component;
//   };

//   destroyMonaco() {
//     if (this.editor) {
//       this.editor.dispose();
//       const model = this.editor.getModel();
//       if (model) {
//         model.dispose();
//       }
//     }
//     if (this._subscription) {
//       this._subscription.dispose();
//     }
//   }

//   initMonaco() {
//     const value =
//       this.props.value != null ? this.props.value : this.props.defaultValue;
//     const { language, theme, options, overrideServices } = this.props;
//     if (this.containerElement) {
//       // Before initializing monaco editor
//       Object.assign(options, this.editorWillMount());
//       this.editor = monaco.editor.create(
//         this.containerElement,
//         {
//           value,
//           language,
//           ...options,
//           ...(theme ? { theme } : {})
//         },
//         overrideServices
//       );
//       // After initializing monaco editor
//       this.editorDidMount(this.editor);
//     }
//   }

//   editorWillMount() {
//     const { editorWillMount } = this.props;
//     const options = editorWillMount(monaco);
//     return options || {};
//   }

//   editorDidMount(editor) {
//     this.props.editorDidMount(editor, monaco);

//     this._subscription = editor.onDidChangeModelContent(event => {
//       if (!this.__prevent_trigger_change_event) {
//         this.props.onChange(editor.getValue(), event);
//       }
//     });
//   }

//   render() {
//     const { width, height } = this.props;
//     const fixedWidth = processSize(width);
//     const fixedHeight = processSize(height);
//     const style = {
//       width: fixedWidth,
//       height: fixedHeight
//     };

//     return (
//       <div
//         ref={this.assignRef}
//         style={style}
//         className="react-monaco-editor-container"
//       />
//     );
//   }
// }

const useMonacoEditor = ({ onLoad, language, theme, onMount }) => {
  const ref = useRef(null);

  const handleMount = () => {
    monaco.languages.reactscript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.reactscript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution:
        monaco.languages.reactscript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.reactscript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
      types: ["react"],
      jsx: monaco.languages.reactscript.JsxEmit.Preserve
    });

    monaco.languages.reactscript.typescriptDefaults.addExtraLib(
      ReactTypes,
      "file:///react.d.ts"
    );

    const editor = window.monaco.editor.create(ref.current, {
      model: monaco.editor.createModel(
        "<div>Hello World</div>",
        "reactscript",
        monaco.Uri.file("file:///file.tsx")
      ),
      language: "reactscript",
      lightbulb: { enabled: true },
      theme
    });

    onMount(editor);
    return editor;
  };

  const didLoad = e => {
    var paths = {
      "vs/basic-languages": "../../node_modules/monaco-languages/release/dev",
      "vs/language/typescript": "../../release/dev",
      vs: "../../node_modules/monaco-editor-core/min/vs"
    };
    if (document.location.protocol === "http:") {
      // Add support for running local http server
      console.log(document.location);
      let testIndex = document.location.pathname.indexOf("/dist/");
      if (testIndex !== -1) {
        let prefix = document.location.pathname.substr(0, testIndex);
        paths["vs/language/typescript"] = prefix + "/release/dev";
      }
    }
    window.require.config({
      paths
    });
    window.require(["vs/editor/editor.main"], () => {
      window.require(
        [
          "vs/basic-languages/monaco.contribution",
          "vs/language/typescript/monaco.contribution"
        ],
        () => {
          handleMount();
        }
      );
    });

    onLoad();

    if (e) {
      e.target.removeEventListener("load", didLoad);
    }
  };

  // const loadScript = path => {
  //   const loaderScript = window.document.createElement("script");
  //   loaderScript.type = "text/javascript";
  //   // @note: Due to the way AMD is being used by Monaco, there is currently no graceful way to integrate Monaco into webpack (cf. https://github.com/Microsoft/monaco-editor/issues/18):
  //   loaderScript.src = path;
  //   loaderScript.addEventListener("load", this.didLoad);
  //   window.document.body.appendChild(loaderScript);
  // };

  const handleLoad = () => {
    // @note: safe to not check typeof window since it'll call on componentDidMount lifecycle:
    if (!window.require) {
      const loaderScript = window.document.createElement("script");
      loaderScript.type = "text/javascript";
      // @note: Due to the way AMD is being used by Monaco, there is currently no graceful way to integrate Monaco into webpack (cf. https://github.com/Microsoft/monaco-editor/issues/18):
      loaderScript.src =
        "../../node_modules/monaco-editor-core/min/vs/loader.js";
      loaderScript.addEventListener("load", didLoad);
      window.document.body.appendChild(loaderScript);
    } else {
      didLoad();
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return { ref };
};

export function OtherEditor({
  height = "800px",
  width = "600px",
  className,
  style,
  language = "reactscript",
  theme = "vs-dark",
  didLoad = () => {},
  didMount = () => {}
}) {
  const { ref } = useMonacoEditor({
    language,
    theme,
    onMount: didMount,
    onLoad: didLoad
  });

  const fixedWidth = processSize(width);
  const fixedHeight = processSize(height);
  const other = {
    width: fixedWidth,
    height: fixedHeight
  };

  return (
    <div ref={ref} className={className} style={{ height, width, ...style }} />
  );
}
