import { DateTime } from "luxon";

export default function isLaterOrEqualDateTime(
  date1: DateTime,
  date2: DateTime
): boolean {
  return date1.toMillis() >= date2.toMillis();
}
