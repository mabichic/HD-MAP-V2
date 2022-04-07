import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import { RecoilRoot } from "recoil";
const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <RecoilRoot>
      <CssBaseline />
      <Component {...pageProps} />
    </RecoilRoot>
  );
};

export default App; 