import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import dynamic from "next/dynamic";
import Head from "next/head";
import "nprogress/nprogress.css";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeLayout from "../components/ThemeLayout";
import SocketProvider from "../context";
import { store } from "../redux/reducers/store";
import "../styles/globals.css";
import "../styles/layout.scss";

const TopProgressBar = dynamic(
  () => {
    return import("../components/TopProgressBar");
  },
  { ssr: false }
);
const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <link rel="icon" type="image/x-icon" href="https://i.imgur.com/U0BdIic.png" />
          </Head>
          <Provider store={store}>
            <SocketProvider>
              <ThemeLayout>
                <TopProgressBar />
                <DefaultSeo
                  title="LT Blog - Le Thinh Blog"
                  description="Le Thinh Blog - Blog for dev"
                  additionalMetaTags={[
                    {
                      property: "keywords",
                      content:
                        "Thinhle, Le Thinh Blog, lethinh blog, lethinh coder, Le Thinh, lethinh2003, huynhobe, blog, laptrinhvien, it, cntt, source code free, source, code, game freefire, code game freefire, vong quay freefire, javascript",
                    },
                    {
                      property: "author",
                      content: "Thinh Le",
                    },
                  ]}
                  openGraph={{
                    type: "website",
                    locale: "vi_VN",
                    url: process.env.NEXTAUTH_URL,
                    siteName: "LT Blog - Le Thinh Blog",
                    images: [
                      {
                        url: "https://i.imgur.com/ipoUilM.png",
                        width: 700,
                        height: 700,
                        alt: "LT Blog - Le Thinh Blog",
                      },
                    ],
                  }}
                  facebook={{
                    appId: process.env.FACEBOOK_APPID,
                  }}
                  twitter={{
                    handle: "Thinh Le",
                    site: process.env.NEXTAUTH_URL,
                    cardType: "summary_large_image",
                  }}
                />
                <Component {...pageProps} />
                <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable
                  pauseOnHover={false}
                />
                <Analytics />
              </ThemeLayout>
            </SocketProvider>
          </Provider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
