import { h } from "preact";
import { listen, dispatch } from "codesandbox-api";
// import classNames from "classnames";

import { RefreshIcon, BackwardIcon, ForwardIcon } from "./icons";
import { ISandpackContext } from "../types";
import { useSandpack } from "../core/SandpackProvider";
import { useEffect, useState } from "preact/hooks";
// import withSandpack from "../../../utils/with-sandpack";
// import { ISandpackContext } from "../../types";
// import cn from "../../../utils/cn";

// interface Props {
//   sandpack: ISandpackContext;
// }

// interface State {
//   browserPath: string;
//   baseUrl: string;
//   lastCommittedUrl: string;
//   backwardNavigationStack: Array<string>;
//   forwardNavigationStack: Array<string>;
// }

export function Navigator() {
  const sandpack = useSandpack();
  const [urlState, setUrlState] = useState({
    browserPath: "/",
    baseUrl: ""
  });

  const [lastCommittedUrl, setLastCommitedUrl] = useState("/");

  const [navigationStack, setNavigationStack] = useState({
    backwardNavigationStack: [],
    forwardNavigationStack: []
  });

  const getBaseUrl = (url: string) => {
    const match = url.match(/(https?:\/\/.*?)\//);

    if (match && match[1]) {
      return match[1];
    } else {
      return url;
    }
  };

  const getUrlState = (url: string) => {
    const baseUrl = getBaseUrl(url);
    const browserPath = url.replace(baseUrl, "") || "/";

    return {
      baseUrl,
      browserPath
    };
  };

  const handleMessage = (message: any) => {
    switch (message.type) {
      case "urlchange": {
        console.log("urlchange");
        setUrlState(getUrlState(message.url));
        setLastCommitedUrl(message.url);
        break;
      }

      default: {
        // nothing
        break;
      }
    }
  };

  useEffect(() => {
    return listen(handleMessage);
  }, []);

  const commitUrl = () => {
    const { baseUrl, browserPath } = urlState;

    if (sandpack.browserFrame) {
      const prevUrl = sandpack.browserFrame.src;
      sandpack.browserFrame.src = baseUrl + browserPath;

      // update lastCommittedUrl url
      setLastCommitedUrl(baseUrl + browserPath);

      // update the navigation stacks
      // when you enter a new URL the forwardNavigationStack is cleared
      if (prevUrl != null) {
        setNavigationStack(({ backwardNavigationStack }) => ({
          backwardNavigationStack: [...backwardNavigationStack, prevUrl],
          forwardNavigationStack: []
        }));
      }
    }
  };

  const onInputChange = e => {
    const browserPath = e.target.value.startsWith("/")
      ? e.target.value
      : `/${e.target.value}`;

    setUrlState(({ baseUrl }) => ({ browserPath, baseUrl }));
  };

  const onKeyDown = e => {
    if (e.keyCode === 13) {
      //  Enter
      e.preventDefault();
      e.stopPropagation();

      commitUrl();
    }
  };

  const onRefresh = () => {
    if (sandpack.browserFrame) {
      sandpack.browserFrame.src = lastCommittedUrl;
    }
  };

  const onBackwardNavigation = () => {
    const { backwardNavigationStack } = navigationStack;

    if (backwardNavigationStack.length > 0) {
      const newCurrUrl =
        backwardNavigationStack[backwardNavigationStack.length - 1];
      if (sandpack.browserFrame) {
        const currUrl = sandpack.browserFrame.src;
        sandpack.browserFrame.src = newCurrUrl;

        const baseUrl = getBaseUrl(newCurrUrl);
        const browserPath = newCurrUrl.replace(baseUrl, "") || "/";

        setLastCommitedUrl(newCurrUrl);
        setUrlState(({ baseUrl }) => ({ browserPath, baseUrl }));
        setNavigationStack(
          ({ backwardNavigationStack, forwardNavigationStack }) => ({
            backwardNavigationStack: prevState.backwardNavigationStack.slice(
              0,
              -1
            ),
            forwardNavigationStack: [
              ...prevState.forwardNavigationStack,
              currUrl
            ]
          })
        );
      }
    }
  };

  const onFowardNavigation = () => {
    const { forwardNavigationStack } = navigationStack;

    if (forwardNavigationStack.length > 0) {
      const newCurrUrl =
        forwardNavigationStack[forwardNavigationStack.length - 1];
      if (sandpack.browserFrame) {
        const currUrl = sandpack.browserFrame.src;
        sandpack.browserFrame.src = newCurrUrl;

        const baseUrl = getBaseUrl(newCurrUrl);
        const browserPath = newCurrUrl.replace(baseUrl, "") || "/";

        setLastCommitedUrl(newCurrUrl);
        setUrlState(({ baseUrl }) => ({ browserPath, baseUrl }));
        setNavigationStack(
          ({ backwardNavigationStack, forwardNavigationStack }) => ({
            backwardNavigationStack: [
              ...prevState.backwardNavigationStack,
              currUrl
            ],
            forwardNavigationStack: prevState.forwardNavigationStack.slice(
              0,
              -1
            )
          })
        );
      }
    }

    return (
      <div
      // className={classNames(className, cn("Navigator", "container"))}
      // {...props}
      >
        <button
          // className={cn("Navigator", "button")}
          onClick={onBackwardNavigation}
        >
          <BackwardIcon />
        </button>
        <button
          // className={cn("Navigator", "button")}
          onClick={onFowardNavigation}
        >
          <ForwardIcon />
        </button>
        <button
          // className={cn("Navigator", "button")}
          onClick={onRefresh}
        >
          <RefreshIcon />
        </button>
        <input
          // className={cn("Navigator", "input")}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          value={urlState.browserPath}
        />
      </div>
    );
  };
}
