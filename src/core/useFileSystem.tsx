import { useState, useEffect, useReducer } from "preact/hooks";
import ky from "ky";

function downloadMiddleware(dispatch) {
  return ({ type, data }) => {
    switch (type) {
      case types.DOWNLOAD_FILE:
        (async () => {
          const content = await ky(data.url).text();
          console.log(data);
          dispatch({
            type: types.WRITE_FILE,
            data: { path: data.path, text: content }
          });
        })();
        break;
      default:
        return dispatch({ type, data });
    }
  };
}

export const types = {
  WRITE_FILE: "WRITE_FILE",
  WRITE_FILES: "WRITE_FILES",
  READ_FILE: "READ_FILE",
  READ_FILES: "READ_FILES",
  DOWNLOAD_FILE: "DOWNLOAD_FILE",
  DELETE_FILE: "DELETE_FILE",
  RESET: "RESET"
};

const reducer = (state, { type, data }) => {
  switch (type) {
    case types.WRITE_FILE:
      return { ...state, [data.path]: { text: data.text } };
    case types.WRITE_FILES:
      return { ...state, ...data.files };
    case types.RESET:
      return {};
    default:
      throw new Error("Unexpected action");
  }
};

export const useFileSystem = (
  rootDir,
  initialFiles,
  middleware = dispatch => dispatch
) => {
  const [files, dispatch] = useReducer(reducer, initialFiles);
  const modDispatch = downloadMiddleware(middleware(dispatch));

  const downloadFile = (url, path) =>
    modDispatch({
      type: types.DOWNLOAD_FILE,
      data: {
        url,
        path
      }
    });

  const writeFile = (path, text) =>
    modDispatch({
      type: types.WRITE_FILE,
      data: {
        path,
        text
      }
    });

  const writeFiles = files =>
    modDispatch({
      type: types.WRITE_FILES,
      data: {
        files
      }
    });

  return { files, dispatch: modDispatch, writeFile, writeFiles, downloadFile };
};

// function App() {
//   const { files, dispatch } = useFileSystem({
//     "/xyz": "abc"
//   });

// export const useFileSystem = (rootDir, initialFiles, onFileChange) => {
//   // const [files, setFiles] = useState(initialFiles);
//   // const fs = useBrowserFS();

//   // const readFiles = () => {
//   //   const files = {};
//   //   if (fs && fs.existsSync(rootDir)) {
//   //     const fileNames = fs.readdirSync(rootDir);
//   //     fileNames.forEach(file => {
//   //       files["/" + file] = {
//   //         text: fs.readFileSync(rootDir + "/" + file, "utf-8")
//   //       };
//   //     });
//   //   }
//   //   // console.log(files);
//   //   return files;
//   // };

//   // const writeFile = (path, text) => {
//   //   if (fs) {
//   //     fs.writeFileSync(rootDir + path, text, "utf-8");
//   //     if (onFileChange) {
//   //       onFileChange(readFiles());
//   //     }
//   //   }
//   // };

//   // const writeFiles = updates => {
//   //   updates.forEach(([path, text]) => writeFile(path, text));
//   //   onFileChange(readFiles());
//   // };

//   // // const updateFiles = (files: any) => {
//   // //   (async files => {
//   // //     let updatedFiles = files;
//   // //     if (onFileChange) {
//   // //       updatedFiles = await onFileChange(files);
//   // //     }
//   // //     console.log(updatedFiles);
//   // //     setFiles(updatedFiles);
//   // //   })(files);
//   // // };

//   // const downloadFile = async (url, file) => {
//   //   const content = await ky(url).text();
//   //   writeFile(file, content);
//   // };

//   // // const addFile = (path, text) => {
//   // //   setFiles(files => ({ ...files, [path]: { code: text } }));
//   // // };

//   // // console.log(files);
//   // useEffect(() => {
//   //   if (fs) {
//   //     // if (fs.existsSync(rootDir)) {
//   //     //   fs.rmdirSync(rootDir);
//   //     // }

//   //     if (!fs.existsSync(rootDir)) {
//   //       fs.mkdirSync(rootDir);
//   //     }
//   //     writeFiles(
//   //       Object.entries(initialFiles).map(([path, { text }]) => [path, text])
//   //     );

//   //     // console.log(readFiles());
//   //   }
//   // }, [fs]);
//   // useEffect(() => {
//   //   if (fs) {
//   //     Object.keys(files).forEach(file => {
//   //       writeFile(file, files[file].code);
//   //     });
//   //   }
//   // }, [fs, files]);

//   return { readFiles, writeFile, writeFiles, downloadFile };
// };

const useBrowserFS = () => {
  const [fs, setFs] = useState(null);
  // console.log(fs);
  useEffect(() => {
    if (!window.fs) {
      BrowserFS.install(window);
      BrowserFS.configure(
        {
          fs: "LocalStorage"
        },
        function(e) {
          if (e) {
            // An error occurred.
            throw e;
          }
          var fs = window.require("fs");
          window.fs = fs;
          BrowserFS;
          setFs(fs);
          //     // console.log(content);
          //     // updateFiles(files => ({
          //     //   ...files,
          //     //   "/lib.js": { code: content }
          //     // }));
          //   });
          // Otherwise, BrowserFS is ready to use!
        }
      );
    } else {
      setFs(window.fs);
    }
  }, []);
  return fs;
};
