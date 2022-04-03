import React from "react";
import { Home, Book2, Books, Login, Logout } from "tabler-icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import Link from "next/link";
import { UserProfile } from "@auth0/nextjs-auth0";
import { motion } from "framer-motion";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  href: string;
}

export function NavbarLink({ icon, color, label, href }: MainLinkProps) {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Link href={href}>
          <a className="text-grey-800 hover:text-blue-800">{label}</a>
        </Link>
      </Group>
    </UnstyledButton>
  );
}
const needUser = (isLoading: boolean, user: UserProfile) => !isLoading && user;
const needNonUser = (isLoading: boolean, user: UserProfile) =>
  !isLoading && !user;

const data = [
  {
    icon: <Login size={16} />,
    color: "blue",
    label: "Login",
    href: "/api/auth/login",
    display: needNonUser,
  },
  {
    icon: <Home size={16} />,
    color: "teal",
    label: "Home",
    href: "/",
    display: () => true,
  },
  {
    icon: <Book2 size={16} />,
    color: "violet",
    label: "My Bookings",
    href: "/myBookings",
    display: needUser,
  },
  {
    icon: <Books size={16} />,
    color: "grape",
    label: "New Booking",
    href: "/new",
    display: needUser,
  },
  {
    icon: <Logout size={16} />,
    color: "blue",
    label: "Logout",
    href: "/api/auth/logout",
    display: needUser,
  },
];

export function MainLinks({
  user,
  isLoading,
}: {
  user: UserProfile;
  isLoading: boolean;
}) {
  const links = data
    .filter((link) => link.display(isLoading, user))
    .map((link) => {
      return (
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} key={link.label}>
          <NavbarLink
            icon={link.icon}
            color={link.color}
            label={link.label}
            href={link.href}
            key={link.label}
          />
        </motion.div>
      );
    });
  return <div>{links}</div>;
}
