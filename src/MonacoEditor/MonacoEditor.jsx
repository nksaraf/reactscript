import { h } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";
import { useMonacoLoader } from "./useMonacoLoader";

export function processSize(size) {
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

function noop() {}

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
  const monaco = useMonacoLoader();
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

      const editor = monaco.editor.create(
        ref.current,
        {
          model: monaco.editor.createModel(
            value,
            language,
            monaco.Uri.file("file.tsx")
          ),
          language,
          ...options,
          ...(theme ? { theme } : {})
        },
        overrideServices
      );
      // After initializing monaco editor
      editorDidMount(editor, monaco);

      subscription = editor.onDidChangeModelContent(event => {
        onChange(editor.getValue(), editor, event);
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
