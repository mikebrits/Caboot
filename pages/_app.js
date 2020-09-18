import React from "react";
import { Grommet } from "grommet";
import Head from "next/head";

import "../styles/globals.css";

const theme = {
  global: {
    font: {
      family: "Roboto",
      size: "14px",
      height: "20px",
    },
  },
};

export default function App({ Component, pageProps }) {
  return (
      <Grommet theme={theme}>
        <Head>
          <link
              href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
              rel="stylesheet"
          />
        </Head>
        <Component {...pageProps} />
      </Grommet>
  );
}
