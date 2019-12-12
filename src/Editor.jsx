import { h } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";
import { useMonacoEditorLoader } from "./useMonacoEditor";

export function processSize(size) {
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

function noop() {}

// width: "600px",
// height: "800px",
// value: "<div>",
// defaultValue: "<div>",
// language: "reactscript",
// theme: "vs-dark",
// options: {},
// overrideServices: {},
// editorDidMount: noop,
// editorWillMount: noop,
// onChange: noop

export const MonacoEditor = ({
  editorWillMount = noop,
  editorDidMount = noop,
  value,
  language = "javascript",
  theme = "vs-dark",
  width = 600,
  defaultValue = "",
  className,
  style,
  overrideServices = {},
  onChange = noop,
  height = 800,
  options = {}
}) => {
  const monaco = useMonacoEditorLoader();
  const ref = useRef();
  const [editor, setEditor] = useState();

  useEffect(() => {
    if (!monaco) {
      return;
    }
    const value = value != null ? value : defaultValue;
    let subscription;
    if (ref) {
      // Before initializing monaco editor
      Object.assign(options, editorWillMount(monaco) || {});

      // console.log(
      //   monaco.editor.createModel(
      //     "<div>Hello World</div>",
      //     "reactscript",
      //     monaco.Uri.file("file:///file.tsx")
      //   )
      // );
      const editor = monaco.editor.create(
        ref.current,
        // {
        //   value,
        //   language,
        //   ...options,
        //   ...(theme ? { theme } : {})
        // },
        {
          model: monaco.editor.createModel(
            value,
            language,
            monaco.Uri.file("file:///file.tsx")
          ),
          language,
          ...options,
          theme
        },
        overrideServices
      );
      // After initializing monaco editor
      editorDidMount(editor, monaco);

      subscription = editor.onDidChangeModelContent(event => {
        onChange(editor.getValue(), event);
      });
      setEditor(editor);
    }

    return () => {
      if (editor) {
        editor.dispose();
        const model = editor.getModel();
        if (model) {
          model.dispose();
        }
      }
      if (subscription) {
        subscription.dispose();
      }
    };
  }, [monaco]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const model = editor.getModel();
    if (value !== model.getValue()) {
      editor.pushUndoStop();
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value
          }
        ]
      );
      editor.pushUndoStop();
    }
  }, [editor, value]);

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(theme);
    }
  }, [monaco, theme]);

  useEffect(() => {
    if (editor) {
      editor.layout();
    }
  }, [editor, width, height]);

  // useEffect(() => {
  //   if (monaco) {
  //     monaco.editor.setModelLanguage(language);
  //   }
  // }, [monaco, language]);

  useEffect(() => {
    if (editor) {
      editor.updateOptions(options);
    }
  }, [editor, options]);

  const fixedWidth = processSize(width);
  const fixedHeight = processSize(height);
  const dimensions = {
    width: fixedWidth,
    height: fixedHeight
  };

  return (
    <div ref={ref} className={className} style={{ ...dimensions, ...style }} />
  );
};

// class _MonacoEditor extends React.Component {
//   componentDidMount() {
//     this.initMonaco();
//   }

//   componentWillUnmount() {
//     this.destroyMonaco();
//   }

//   assignRef = component => {
//     this.containerElement = component;
//   };

//   destroyMonaco() {}

//   initMonaco() {}

//   editorWillMount() {
//     const { editorWillMount } = this.props;
//     const options = editorWillMount(monaco);
//     return options || {};
//   }

//   editorDidMount(editor) {}

//   // render() {
//   //   const { width, height } = this.props;
//   //   const fixedWidth = processSize(width);
//   //   const fixedHeight = processSize(height);
//   //   const style = {
//   //     width: fixedWidth,
//   //     height: fixedHeight
//   //   };

//   //   return (
//   //     <div
//   //       ref={this.assignRef}
//   //       style={style}
//   //       className="react-monaco-editor-container"
//   //     />
//   //   );
//   // }
// }

// MonacoEditor.propTypes = {
//   width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   value: PropTypes.string,
//   defaultValue: PropTypes.string,
//   language: PropTypes.string,
//   theme: PropTypes.string,
//   options: PropTypes.object,
//   overrideServices: PropTypes.object,
//   editorDidMount: PropTypes.func,
//   editorWillMount: PropTypes.func,
//   onChange: PropTypes.func
// };

MonacoEditor.defaultProps = {
  width: "600px",
  height: "800px",
  value: "<div>",
  defaultValue: "<div>",
  language: "reactscript",
  theme: "vs-dark",
  options: {},
  overrideServices: {},
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop
};
//
// export de//fault MonacoEditor;

// export function OtherEditor({
//   height = "800px",
//   width = "600px",
//   className,
//   style,
//   language = "reactscript",
//   theme = "vs-dark",
//   didLoad = () => {},
//   didMount = () => {}
// }) {
//   const { ref } = useMonacoEditor({
//     language,
//     theme,
//     onMount: didMount
//   });
// }
