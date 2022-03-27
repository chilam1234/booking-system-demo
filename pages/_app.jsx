import "../styles/app.css";
import { UserProvider } from "@auth0/nextjs-auth0";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import NextNProgress from "nextjs-progressbar";
import Head from "next/head";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
      }}
    >
      <NotificationsProvider>
        <UserProvider>
          <Layout>
            <Head>
              <title>Booking Demo</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <NextNProgress />
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
