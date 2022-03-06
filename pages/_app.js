import "../styles/globals.css";
import "../styles/layout.scss";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app

import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import Sidebar from "../components/homePage/Sidebar";
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <SessionProvider session={session} refetchOnWindowFocus={true}>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <title> LT Blog - Nơi chia sẻ kinh nghiệm, source code giá rẻ - chất lượng - uy tín</title>
          <meta
            name="description"
            content="LT Blog - Nơi chia sẻ kinh nghiệm, source code giá rẻ - chất lượng - uy tín"
          />
          <meta
            name="keywords"
            content="Thinhle, Le Thinh, lethinh2003, huynhobe, blog, laptrinhvien, it, cntt, source code free, source, code, game freefire, code game freefire, vong quay freefire, javascript"
          />
          <meta name="author" content="Thinh Le" />
          <meta
            property="og:title"
            content="LT Blog - Nơi chia sẻ kinh nghiệm, source code giá rẻ - chất lượng - uy tín"
          />
          <meta property="og:description" content="" />
          <meta property="og:type" content="website" />

          <meta property="og:image:width" content="1280" />
          <meta property="og:image:height" content="720" />
        </Head>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
