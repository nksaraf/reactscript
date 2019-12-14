import { BundlerProvider } from "Sandpack/bundler";

const App = () => {
  return (
    <ThemeProvider value={theme}>
      <BundlerProvider></BundlerProvider>
    </ThemeProvider>
  );
};
