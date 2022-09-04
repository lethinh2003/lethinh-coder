import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { Provider } from "react-redux";
import { createStore } from "redux";
import { store } from "../redux/reducers/store";
import "../styles/globals.css";
import "../styles/layout.scss";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import ThemeLayout from "../components/ThemeLayout";
import { ToastContainer } from "react-toastify";
import SocketProvider from "../context";
import { QueryClientProvider, QueryClient } from "react-query";
import { usePreserveScroll } from "../utils/usePreserveScroll.ts";

const TopProgressBar = dynamic(
  () => {
    return import("../components/TopProgressBar");
  },
  { ssr: false }
);
const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  usePreserveScroll();
  return (
    <>
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <QueryClientProvider client={queryClient}>
          <Head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="icon" type="image/x-icon" href="https://i.imgur.com/U0BdIic.png" />
            <meta name="author" content="Thinh Le" />
            <meta property="fb:app_id" content={process.env.FACEBOOK_APPID} />

            {/* <title>LT Blog - Le Thinh Blog</title>

          <meta name="description" content="LT Blog - Le Thinh Blog" />
          <meta
            name="keywords"
            content="Thinhle, Le Thinh, lethinh2003, huynhobe, blog, laptrinhvien, it, cntt, source code free, source, code, game freefire, code game freefire, vong quay freefire, javascript"
          />
          <meta property="og:title" content="LT Blog - Le Thinh Blog" />

          <meta property="og:description" content="" />
          <meta property="og:type" content="website" /> */}

            <meta property="og:image:width" content="1280" />
            <meta property="og:image:height" content="720" />
          </Head>
          <Provider store={store}>
            <SocketProvider>
              <ThemeLayout>
                <TopProgressBar />
                <Component {...pageProps} />
                <ToastContainer
                  position="bottom-left"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable
                  pauseOnHover={false}
                />
              </ThemeLayout>
            </SocketProvider>
          </Provider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
