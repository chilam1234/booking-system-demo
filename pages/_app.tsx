import "../styles/app.css";
import "../styles/cube.css";
import { UserProvider } from "@auth0/nextjs-auth0";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import NextNProgress from "nextjs-progressbar";
import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import notifyMe from "../utils/notification";

function MyApp({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  useEffect(() => {
    notifyMe();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
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
    </ColorSchemeProvider>
  );
}

export default MyApp;
