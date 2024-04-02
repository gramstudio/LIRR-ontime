import type { Train, Row } from "./types";
import { diffInMins, toNyTime, getCurrentTimestamp } from "./timeUtils";

/**
 * Checks if a train is a revenue train.
 * @param train - The train object to check.
 * @returns True if the train is a revenue train, false otherwise.
 */
const isRevenue = (train: Train): boolean => {
  return train.details.stops.length > 0;
};

/**
 * Checks if a train is delayed based on the scheduled and actual times.
 * @param scheduled - The scheduled time in minutes.
 * @param actual - The actual time in minutes.
 * @param condition - The delay condition in minutes.
 * @returns True if the train is delayed, false otherwise.
 */
const isDelayed = (scheduled: number, actual: number, condition: number) => {
  return (diffInMins(scheduled, actual) || 0) >= condition;
};

/**
 * Creates a new row object based on the given row and train.
 * @param row - The original row object.
 * @param train - The train object.
 * @returns The new row object.
 * @throws {Error} If `train_id` is not provided in `row`.
 */
const createRow = (
  row: {
    train_id: string;
    train_num: string;
  } & Partial<Omit<Row, "train_id" | "train_num">>,
  train: Train
): Row => {
  const depart = train.details.stops[0];
  const final = train.details.stops[train.details.stops.length - 1];

  // Log the train if the departure or final station is missing
  (!depart || !final) && console.log(JSON.stringify(train, null, 2));

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
      depart.act_depart_time &&
      isDelayed(depart.sched_time, depart.act_depart_time, 2)
        ? "x"
        : "",
    final_sched: toNyTime(final.sched_time),
    final_time: final.act_time ? toNyTime(final.act_time) : "",
    final_3min_delay:
      final.act_time && isDelayed(final.sched_time, final.act_time, 3)
        ? "x"
        : "",
    ...getCurrentTimestamp(),
  };
};

/**
 * Processes the existing sheet data and returns the updated rows.
 * @param sheetData - The original sheet data.
 * @param lirrData - The LIRR data.
 * @returns The updated rows.
 */
const processSheetData = (sheetData: Row[], lirrData: Train[]): Row[] => {
  return sheetData.reduce((acc, row) => {
    const train = lirrData.find((train) => train.train_id === row.train_id);
    // If the train is found and is a revenue train, create a new row
    if (train && isRevenue(train)) {
      acc.push(createRow(row, train));
      // If the train is not found, push the row as is
    } else if (row.train_id) {
      acc.push(row);
    }
    return acc;
  }, [] as Row[]);
};

/**
 * Processes the new trains and returns the new rows.
 * @param sheetData - The original sheet data.
 * @param lirrData - The LIRR data.
 * @returns The new rows.
 */
const processNewTrains = (sheetData: Row[], lirrData: Train[]): Row[] => {
  const newTrains = lirrData.filter(
    (train) =>
      !sheetData.some((row) => row.train_id === train.train_id) &&
      isRevenue(train)
  );

  return newTrains.map((train) =>
    createRow(
      {
        train_id: train.train_id,
        train_num: train.train_num,
        direction: train.details.direction,
      },
      train
    )
  );
};

/**
 * Prepares the data by processing the sheet data and new trains.
 * @param sheetData - The original sheet data.
 * @param lirrData - The LIRR data.
 * @returns The prepared data.
 */
const prepData = ({
  sheetData,
  lirrData,
}: {
  sheetData: Row[];
  lirrData: Train[];
}): Row[] => {
  const updatedSheet = processSheetData(sheetData, lirrData);
  const newRows = processNewTrains(sheetData, lirrData);

  return [...updatedSheet, ...newRows];
};

export default prepData;
