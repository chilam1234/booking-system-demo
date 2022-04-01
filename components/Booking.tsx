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
  useMantineTheme,
} from "@mantine/core";

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
  );
  return (
    <div className="bg-gray-100 p-4 rounded-md my-2 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h2 className="text-xl text-gray-800 font-bold">
            Room - {booking.data.room}
          </h2>
          {timePassed && (
            <Badge
              className="ml-2"
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
            >
              Expired Booking
            </Badge>
          )}
        </div>

        <TimeRangeInput
          value={[new Date(booking?.data?.start), new Date(booking?.data?.end)]}
          readOnly
        />
      </div>
      <h3 className="text-md text-gray-800 font-bold mb-2">Remarks</h3>
      <p className="text-gray-900 mb-4">{booking.data.remarks}</p>
      {user?.sub === booking.data.userId && !timePassed && (
        <Link href={`/edit/${booking.id}`}>
          <a className="text-gray-800 mr-2">Edit</a>
        </Link>
      )}
    </div>
  );
}
