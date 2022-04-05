import React, { useMemo } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import useSWR from "swr";
import Booking from "../components/Booking";
import { WithUser } from "../components/HOC/withUser";
import { LoadingOverlay, Text } from "@mantine/core";
import { motion } from "framer-motion";
import Cube from "../components/Cube";

export default function MyBookings() {
  const { data: bookings } = useSWR("/api/myBookings");
  const BookingWithUser = WithUser(Booking);
  const noBookingsSentence = useMemo(() => {
    return {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: {
          delay: 0.5,
          staggerChildren: 0.08,
        },
      },
    };
  }, []);

  const letterSentence = useMemo(
    () => ({
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
      },
    }),
    []
  );

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={bookings === undefined} />
      <main className="my-12">
        {bookings &&
          bookings.length > 0 &&
          bookings.map((booking) => (
            <BookingWithUser key={booking.id} booking={booking} />
          ))}
        {!bookings ||
          (bookings.length === 0 && (
            <div className="flex flex-col justify-center items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={noBookingsSentence}
                className="text-center"
              >
                {"There is no booking so far..."
                  .split(" ")
                  .map((word, index) => (
                    <>
                      <span
                        key={word + "-" + index}
                        style={{ display: "inline-block", fontSize: 32 }}
                      >
                        {word.split("").map((char, index) => (
                          <motion.span
                            key={char + "-" + index}
                            variants={letterSentence}
                            style={{
                              display: "inline-block",
                            }}
                            whileHover={{
                              scaleY: Math.random() * 3,
                              type: "spring",
                              fontSize: 32,
                            }}
                          >
                            <Text className="text-7xl" size="32px" weight={800}>
                              {char}
                            </Text>
                          </motion.span>
                        ))}
                      </span>
                      <span> </span>
                    </>
                  ))}
              </motion.div>
              <Cube />
            </div>
          ))}
      </main>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
