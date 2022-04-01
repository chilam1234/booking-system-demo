import React from "react";
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { UserProfile } from "@auth0/nextjs-auth0";

type UserProps = {
  user: UserProfile;
  isLoading: boolean;
};
export default function User({ user }: UserProps) {
  const theme = useMantineTheme();
  console.log(theme);

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <UnstyledButton
        sx={{
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
        }}
      >
        <Group>
          <Avatar src={user?.picture} radius="xl" />
          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {user?.name}
            </Text>
            <Text color="dimmed" size="xs">
              {user?.email}
            </Text>
          </Box>
        </Group>
      </UnstyledButton>
    </Box>
  );
}
