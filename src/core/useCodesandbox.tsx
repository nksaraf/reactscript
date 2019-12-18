import { listen, dispatch, registerFrame, Protocol } from "codesandbox-api";
import { useEffect } from "preact/hooks";
export const useCodesandbox = handleMessage => {
  useEffect(() => {
    const listener = listen(handleMessage);
    return listener;
  });
  return { dispatch, registerFrame, Protocol };
};
