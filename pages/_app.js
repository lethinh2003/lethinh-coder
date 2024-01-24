import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import App from "next/app";
import "nprogress/nprogress.css";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeLayout from "../components/ThemeLayout";
import NextSeoConfig from "../configs/next-seo.config";
import { store } from "../redux/reducers/store";
import "../styles/globals.css";
import "../styles/layout.scss";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps }, example }) {
  return (
    <>
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />

          <Provider store={store}>
            <ThemeLayout>
              <DefaultSeo {...NextSeoConfig} />
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
          </Provider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;

MyApp.getInitialProps = async (context) => {
  const ctx = await App.getInitialProps(context);
  return { ...ctx, example: "data" };
};
