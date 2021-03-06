import "../styles/globals.css";
import Head from "next/head";
import { Provider } from "../components/Context";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"/>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <title>Leballo</title>
      </Head>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
