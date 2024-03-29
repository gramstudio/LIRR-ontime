export interface Train {
  train_id: string;
  railroad: string;
  run_date: string;
  train_num: string;
  realtime: boolean;
  details: Details;
  consist: Consist;
  location: Location;
  status: Status;
  alerts?: Alert[];
}

interface Alert {
  status: string;
  header: string;
  text: string;
  priority: number;
  start_time: number;
  human_duration: string;
  status_level: number;
  station_alternatives: any[];
  language: string;
}

interface Status {
  otp: number;
  otp_location: string;
  held: boolean;
  canceled: boolean;
}

interface Location {
  longitude: number;
  latitude: number;
  nearby: string;
  speed?: number;
  heading?: number;
  source: string;
  timestamp: number;
  extra_info?: string;
}

interface Consist {
  fleet?: string;
  cars: Car[];
  actual_len?: number;
  sched_len: number;
  occupancy: string;
  occupancy_timestamp?: number;
}

interface Car {
  type: string;
  number: number;
  loading: string;
  passengers: number;
  restroom: boolean;
  revenue: boolean;
  bikes: number;
  locomotive: boolean;
  quiet?: boolean;
}

interface Details {
  headsign: string;
  summary: string;
  peak_code: string;
  branch?: string;
  stops: Stop[];
  events: any[];
  direction: string;
  bike_rule: string;
}

interface Stop {
  code: string;
  sched_time: number;
  act_depart_time?: number;
  act_time?: number;
  sign_track: string;
  avps_track_id: string;
  posted: boolean;
  t2s_track: string;
  stop_status: string;
  stop_type: string;
  local_cancel: boolean;
  bus: boolean;
  occupancy: string;
  track_change?: boolean;
}

export interface Row {
  train_id: string;
  train_num: string;
  direction: string;
  departure_station: string;
  final_station: string;
  departure_sched: string;
  departure_time: string;
  departure_2min_delay: boolean;
  final_sched: string;
  final_time: string;
  final_3min_delay: boolean;
  [key: string]: string | number | boolean;
}
