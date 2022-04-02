import {
  Calendar as BigCalendar,
  luxonLocalizer,
  Views,
} from "react-big-calendar";
import { DateTime } from "luxon";
import { useMemo, useRef, useEffect, useCallback } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/router";
import { IBooking } from "../types";
import { UserProfile } from "@auth0/nextjs-auth0";
import isLaterOrEqualDateTime from "../utils/isLaterDateTime";
import { useMantineTheme, Text, Box } from "@mantine/core";

type CalendarProps = {
  bookings: IBooking[];
  user?: UserProfile;
};

export default function Calendar({ bookings, user }: CalendarProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const events = useMemo(
    () =>
      bookings?.map((booking) => ({
        id: booking.id,
        ...booking.data,
        resourceId: booking.data.room,
        start: new Date(booking.data.start),
        end: new Date(booking.data.end),
        userId: booking.data.userId,
        title: booking.data.username,
      })),
    [bookings]
  );
  const resources = useMemo(
    () =>
      new Array(10)
        .fill(0)
        .map((_, i) => [
          { id: `c${i + 1}`, title: `Room c${i + 1}` },
          { id: `p${i + 1}`, title: `Room p${i + 1}` },
        ])
        .flat(),
    []
  );
  const defaultDate = useMemo(() => new Date(), []);
  const localizer = useMemo(() => luxonLocalizer(DateTime), []);

  const clickRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(clickRef?.current);
    };
  }, []);

  const onSelectSlot = useCallback(
    (slotInfo) => {
      if (slotInfo.start < DateTime.now()) {
        return;
      }
      /**
       * prevent double click on same slot
       */
      clearTimeout(clickRef?.current);
      clickRef.current = setTimeout(() => {
        router.push({
          pathname: "/new",
          query: {
            start: slotInfo.start.toISOString(),
            end: slotInfo.end.toISOString(),
            room: slotInfo.resourceId,
          },
        });
      }, 250);
    },
    [router]
  );

  const onSelectEvent = useCallback(
    (event) => {
      if (
        isLaterOrEqualDateTime(
          DateTime.now(),
          DateTime.fromISO(event.start.toISOString())
        )
      ) {
        return;
      }
      if (event.userId === user?.sub) {
        router.push(`/edit/${event.id}`);
      }
    },
    [user, router]
  );

  const getStylePropsOnColorScheme = useCallback(() => {
    if (theme.colorScheme === "dark") {
      return {
        style: {
          backgroundColor: theme.colors.dark[4],
          color: "white",
        },
      };
    }
    return {
      style: {
        backgroundColor: theme.colors.cyan[0],
        borderColor: theme.colors.gray[4],
        color: "black",
      },
    };
  }, []);

  return (
    <BigCalendar
      components={{
        timeGutterHeader: () => (
          <Box
            sx={() => ({
              width: "100%",
              height: "100%",
              ...getStylePropsOnColorScheme().style,
            })}
          >
            <Text weight={700}> Time </Text>
          </Box>
        ),
      }}
      defaultDate={defaultDate}
      localizer={localizer}
      events={events ?? []}
      defaultView={Views.DAY}
      views={["day"]}
      step={30}
      resources={resources}
      resourceIdAccessor="id"
      toolbar={false}
      timeslots={2}
      titleAccessor="username"
      onSelectSlot={onSelectSlot}
      selectable={user ? "ignoreEvents" : false}
      onSelectEvent={onSelectEvent}
      slotPropGetter={(date: Date) => getStylePropsOnColorScheme()}
      dayPropGetter={(date: Date) => getStylePropsOnColorScheme()}
    />
  );
}
