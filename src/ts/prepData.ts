import type { Train, Row } from "./types";

/**
 * Calculates the difference in minutes between two timestamps.
 * @param t1 - The first timestamp in seconds.
 * @param t2 - The second timestamp in seconds (optional).
 * @returns The difference in minutes between the two timestamps.
 */
const diffInMins = (t1: number, t2?: number) => {
  if (!t2) return;
  const t2Date = new Date(t2 * 1000);
  const t1Date = new Date(t1 * 1000);

  // Calculate the difference in minutes
  let diff = (t2Date.getTime() - t1Date.getTime()) / 1000;
  diff /= 60;
  return Math.abs(diff);
};

/**
 * Converts a UNIX timestamp to New York time.
 * @param timestamp - The UNIX timestamp to convert.
 * @returns The New York time in the format "HH:mm" (24-hour format).
 */
const toNyTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * Creates a new row object based on the provided row and train data.
 * @param row - The original row object.
 * @param train - The train object.
 * @returns The new row object with additional properties.
 */
const createRow = (
  row: Row | { train_id: string; train_num: string },
  train: Train
) => {
  const depart = train.details.stops[0];
  const final = train.details.stops[train.details.stops.length - 1];

  if (!depart || !final) {
    console.log({ train });
    return row as Row;
  }
  return {
    ...row,
    direction: train.details.direction,
    departure_station: depart.code,
    final_station: final.code,
    departure_sched: toNyTime(depart.sched_time),
    departure_time: depart.act_depart_time
      ? toNyTime(depart.act_depart_time)
      : "",
    departure_2min_delay:
      (diffInMins(depart.sched_time, depart.act_depart_time) || 0) >= 2,
    final_sched: toNyTime(final.sched_time),
    final_time: final.act_time ? toNyTime(final.act_time) : "",
    final_3min_delay: (diffInMins(final.sched_time, final.act_time) || 0) >= 3,
  };
};

/**
 * Prepares the data by combining the sheet data and LIRR data.
 * @param sheetData - The sheet data array.
 * @param lirrData - The LIRR data array.
 * @returns The prepared data array.
 */
const prepData = ({
  sheetData,
  lirrData,
}: {
  sheetData: Row[];
  lirrData: Train[];
}) => {
  const updatedSheet = sheetData.reduce((acc, row) => {
    const train = lirrData.find((train) => train.train_id === row.train_id);
    if (train && train.details.stops.length > 0) {
      acc.push(createRow(row, train));
    } else if (row.train_id) {
      acc.push(row);
    }
    return acc;
  }, [] as Row[]);

  const newTrains = lirrData.filter(
    (train) => !sheetData.some((row) => row.train_id === train.train_id)
  );
  const newRows = newTrains.map((train) =>
    createRow(
      {
        train_id: train.train_id,
        train_num: train.train_num,
        direction: train.details.direction,
      },
      train
    )
  );
  return [...updatedSheet, ...newRows];
};

export default prepData;
