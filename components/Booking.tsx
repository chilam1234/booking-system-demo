import React, { useMemo } from "react";

import Link from "next/link";

import { TimeRangeInput } from "@mantine/dates";
import { UserProfile } from "@auth0/nextjs-auth0";
import { IBooking } from "../types";
import isLaterOrEqualDateTime from "../utils/isLaterDateTime";
import { DateTime } from "luxon";
import {
  Badge,
  Button,
  Card,
  Group,
  Text,
  Title,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { motion } from "framer-motion";

type BookingProps = {
  user?: UserProfile;
  booking: IBooking;
};
export default function Booking({ booking, user }: BookingProps) {
  const timePassed = useMemo(
    () =>
      isLaterOrEqualDateTime(
        DateTime.now().toUTC(),
        DateTime.fromISO(booking?.data?.start)
      ),
    []
  );
  const theme = useMantineTheme();

  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];
  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.8 }}>
      <Card shadow="sm" p="lg" mb="md">
        <Group
          position="apart"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
        >
          <Title order={4}> Room - {booking.data.room}</Title>
          {timePassed && (
            <Badge
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
            >
              Expired Booking
            </Badge>
          )}
        </Group>
        <TimeRangeInput
          mt={"sm"}
          value={[new Date(booking?.data?.start), new Date(booking?.data?.end)]}
          // @ts-ignore
          readOnly
          style={{ maxWidth: "150px" }}
        />

        {booking.data.remarks && (
          <Text mt={"sm"} weight={500}>
            Remarks
          </Text>
        )}
        <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
          {booking.data.remarks}
        </Text>

        {user?.sub === booking.data.userId && !timePassed && (
          <Link href={`/edit/${booking.id}`}>
            <Button variant="light" color="blue" style={{ marginTop: 14 }}>
              Edit
            </Button>
          </Link>
        )}
      </Card>
    </motion.div>
  );
}
