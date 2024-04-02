import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Creates a new Day.js object with the default timezone set to "America/New_York".
 * @param timestamp - The UNIX timestamp to convert (optional).
 * @returns A new Day.js object.
 */
const d = (timestamp?: number) => {
  return timestamp
    ? dayjs.unix(timestamp).tz("America/New_York")
    : dayjs().tz("America/New_York");
};

/**
 * Calculates the difference in minutes between two timestamps.
 * @param t1 - The first timestamp in seconds.
 * @param t2 - The second timestamp in seconds (optional).
 * @returns The difference in minutes between the two timestamps.
 */
export const diffInMins = (t1: number, t2?: number) => {
  if (!t2) return;
  const t2Date = d(t2);
  const t1Date = d(t1);

  // Calculate the difference in minutes
  return t2Date.diff(t1Date, "minute");
};

/**
 * Converts a UNIX timestamp to New York time.
 * @param timestamp - The UNIX timestamp to convert.
 * @returns The New York time in the format "HH:mm" (24-hour format).
 */
export const toNyTime = (timestamp: number) => {
  return d(timestamp).tz("America/New_York").format("hh:mm a");
};

/**
 * Gets the current timestamp in NY time ddd, MM/DD/YY, hh:mm:ss a, and UNIX formats
 * @returns An object containing the current day, date, time, and timestamp in New York time.
 */
export const getCurrentTimestamp = () => {
  const now = d();

  return {
    update_day: now.format("ddd"),
    update_date: now.format("MM/DD/YY"),
    update_time: now.format("hh:mm:ss a"),
    update_timestamp: now.unix(),
  };
};
