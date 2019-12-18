import { BundlerProvider } from "core/useBundler";

const App = () => {
  return (
    <ThemeProvider value={theme}>
      <BundlerProvider></BundlerProvider>
    </ThemeProvider>
  );
};
