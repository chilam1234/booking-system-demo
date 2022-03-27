import { Calendar, luxonLocalizer, Views } from "react-big-calendar";
import { DateTime } from "luxon";
import { useMemo, useRef, useEffect, useCallback } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/router";

export default function MyCalendar({ bookings, user }) {
  const router = useRouter();
  const events = useMemo(
    () =>
      bookings?.map((booking) => ({
        ...booking.data,
        resourceId: booking.data.room,
        start: new Date(booking.data.start),
        end: new Date(booking.data.end),
      })),
    [bookings]
  );
  console.log(events);
  const resources = [
    new Array(10).fill(0).map((_, i) => ({ id: `c${i}`, title: `Room c${i}` })),
    new Array(10).fill(0).map((_, i) => ({ id: `p${i}`, title: `Room p${i}` })),
  ].flat();
  console.log(resources);
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

  return (
    <div className="myCustomHeight">
      <Calendar
        defaultDate={defaultDate}
        localizer={localizer}
        events={events ?? []}
        defaultView={Views.DAY}
        views={["day"]}
        step={30}
        resources={resources}
        resourcesIdAccessor="id"
        toolbar={false}
        timeslots={2}
        titleAccessor="remarks"
        onSelectSlot={onSelectSlot}
        selectable={user ? "ignoreEvents" : false}
      />
    </div>
  );
}
