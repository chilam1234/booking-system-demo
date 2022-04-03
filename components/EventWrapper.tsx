import { Paper, useMantineTheme } from "@mantine/core";
import { DateTime } from "luxon";
import { useMemo } from "react";
import isLaterOrEqualDateTime from "../utils/isLaterDateTime";
import { Transition } from "@mantine/core";
import { motion } from "framer-motion";

type EventWrapperProps = {
  event: {
    resourceId: string;
    start: Date;
    end: Date;
    userId: string;
    title: string;
    room: string;
    remarks: string;
    username: string;
    id: string;
  };
  children: React.ReactNode;
};

export default function EventWrapper({ event, children }: EventWrapperProps) {
  const { title, className, style, ref, onClick, onDoubleClick } =
    children?.props;
  const customClass = `${className}`;

  const theme = useMantineTheme();
  const styleOnColorScheme = useMemo(() => {
    if (theme.colorScheme === "light") {
      return {
        ...style,
        backgroundColor: !isLaterOrEqualDateTime(
          DateTime.now(),
          DateTime.fromJSDate(event.start)
        )
          ? theme.colors.blue[3]
          : theme.colors.gray[5],
      };
    }
    if (theme.colorScheme === "dark") {
      return {
        ...style,
        backgroundColor: !isLaterOrEqualDateTime(
          DateTime.now(),
          DateTime.fromJSDate(event.start)
        )
          ? theme.colors.grape[5]
          : theme.colors.gray[5],
      };
    }
  }, [
    event.start,
    style,
    theme.colorScheme,
    theme.colors.blue,
    theme.colors.grape,
    theme.colors.gray,
  ]);

  return (
    <Paper
      shadow="xs"
      p="md"
      title={title}
      className={customClass}
      style={{
        ...styleOnColorScheme,
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      ref={ref}
    >
      <motion.div animate={{ opacity: 1 }} whileHover={{ scale: 1.1 }}>
        {children.props.children}
      </motion.div>
    </Paper>
  );
}
