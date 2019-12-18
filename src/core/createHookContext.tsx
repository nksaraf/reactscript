import { useContext } from "preact/hooks";
import { h, createContext } from "preact";
export const createHookContext = useHook => {
  const HookContext = createContext({});
  const HookProvider = ({ children, ...options }) => {
    const value = useHook(options);
    return (
      <HookContext.Provider value={value}>{children}</HookContext.Provider>
    );
  };
  const useHookContext = () => {
    return useContext(HookContext);
  };
  return [HookProvider, useHookContext];
};
