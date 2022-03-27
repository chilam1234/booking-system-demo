import NavbarContent from "../components/Navbar";
import {
  AppShell,
  Navbar,
  Header,
  Burger,
  MediaQuery,
  useMantineTheme,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { withUser } from "../components/HOC/withUser";

function Layout({ children }) {
  const [opened, setOpened] = useState(false);
  const NavbarWithUser = withUser(NavbarContent);
  const theme = useMantineTheme();
  return (
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
          <NavbarWithUser />
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
      {children}
    </AppShell>
  );
}
export default Layout;
