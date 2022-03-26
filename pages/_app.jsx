import NavbarContent from "../components/Navbar";
import "../styles/app.css";
import { UserProvider } from "@auth0/nextjs-auth0";
import {
  AppShell,
  Navbar,
  Header,
  Burger,
  MantineProvider,
  useMantineTheme,
  MediaQuery,
  Title,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useState } from "react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
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
          <AppShell
            navbarOffsetBreakpoint="sm"
            fixed
            padding="sm"
            navbar={
              <Navbar
                p="md"
                hiddenBreakpoint="sm"
                hidden={!opened}
                width={{ sm: 300, lg: 400 }}
              >
                <NavbarContent />
              </Navbar>
            }
            header={
              <Header height={60} p="md">
                <div className="flex items-center h-full">
                  <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                    <Burger
                      opened={opened}
                      onClick={() => setOpened((o) => !o)}
                      size="sm"
                      color={theme.colors.gray[6]}
                      mr="xl"
                    />
                  </MediaQuery>
                  <Title order={3}>One Day Room Booking System</Title>
                </div>
              </Header>
            }
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
          >
            <Head>
              <title>Booking Demo</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
          </AppShell>
        </UserProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
