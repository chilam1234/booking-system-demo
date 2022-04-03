import NavbarContent from "./Navbar";
import {
  AppShell,
  Navbar,
  Header,
  Burger,
  MediaQuery,
  useMantineTheme,
  Title,
  ActionIcon,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import { ReactNode, useState } from "react";
import { WithUser } from "./HOC/withUser";
import { MainLinks } from "./MainLinks";
import User from "./User";
import { Sun, MoonStars } from "tabler-icons-react";
import { motion } from "framer-motion";

function Layout({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const NavbarWithUser = WithUser(MainLinks);
  const UserProfile = WithUser(User);
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section grow mt="md">
            <NavbarWithUser />
          </Navbar.Section>
          <Navbar.Section>
            <UserProfile />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="md">
          <Group sx={{ height: "100%" }} px={20} position="apart">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <motion.div
              animate={{
                backgroundColor: ["#0af", "#fa0", "#0af"],
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              transition={{ ease: "linear", duration: 8, repeat: Infinity }}
            >
              <Title order={2}>Bookr</Title>
            </motion.div>

            <ActionIcon
              variant="default"
              onClick={() => toggleColorScheme()}
              size={30}
            >
              {colorScheme === "dark" ? (
                <Sun size={16} />
              ) : (
                <MoonStars size={16} />
              )}
            </ActionIcon>
          </Group>
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
