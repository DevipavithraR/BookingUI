import { parseISO, format, isValid } from "date-fns";
import dayjs from "./dayjsConfig";
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_FORMAT_DB,
  DEFAULT_TIMEZONE,
  TODAY,
  ZERO_TIME,
  date_formats,
} from "./constants";
export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const getJSDateFromDDMMMYYYY = (dateStr) => {
  // const dateStr = "13-Nov-2025";
  const [day, mon, year] = dateStr.split("-");
  const monthIndex = monthNames.indexOf(mon);
  const date = new Date(year, monthIndex, day);
  return date;
};
export const getDateObject = (dateStr = null) => {
  let dt = new Date();
  if (!dateStr || dateStr.trim().toLowerCase() === TODAY) {
    return dt;
  }
  return new Date(dateStr);
};
export const getNowStr = () => {
  return getFormattedStringOrDate({ dateOrStr: new Date() });
};
/**
 * Checks if a given date string or JS Date is today in the given timezone.
 * Returns true if the date matches today's date in that timezone.
 */
export const isToday = (dateOrStr, tz = DEFAULT_TIMEZONE) => {
  if (!dateOrStr) return false;

  let date;

  if (dateOrStr instanceof Date) {
    date = dayjs(dateOrStr);
  } else if (typeof dateOrStr === "string") {
    date = dayjs(dateOrStr, DEFAULT_DATE_FORMAT, true);
  } else {
    return false;
  }

  if (!date.isValid()) return false;

  // Get today's date in the given timezone
  const today = dayjs().tz(tz).startOf("day");

  // Compare only the date part
  return date.tz(tz).isSame(today, "day");
};
/**
 * Convert any date string to given timezone and format it.
 * Handles null, empty, invalid dates, and UTC/local detection.
 */
export const getFormattedStringOrDate = ({
  dateOrStr = null,
  timeZone = DEFAULT_TIMEZONE,
  formatString = DEFAULT_DATE_FORMAT,
}) => {
  if (!dateOrStr) return "";

  let date;

  if (dateOrStr instanceof Date) {
    // Directly wrap JS Date
    // Convert JS Date to UTC first, then apply given timezone
    date = dayjs(dateOrStr).utc().tz(timeZone);
  } else if (typeof dateOrStr === "string" && dateOrStr.endsWith("Z")) {
    // If string ends with Z → treat as UTC
    date = dayjs.utc(dateOrStr).tz(timeZone);
  } else if (typeof dateOrStr === "string") {
    // Try parsing with common formats in strict mode
    date = dayjs(
      dateOrStr,
      [
        date_formats.DDMMMYYYY,
        date_formats.YYYYMMDD,
        date_formats.YYYYMMDDHHmmss,
        date_formats.YYYYMMDDhhmmssa,
        date_formats.YYYYMMDDTHHmmssZ,
      ],
      true
    ).tz(timeZone);
  } else {
    return "";
  }

  if (!date.isValid()) {
    console.log("day.js: invalid date", dateOrStr);
    return "";
  }
  const rtnStr = date.format(formatString);
  return rtnStr;
};
// Convert given timezone date string back to Date object for react-datepicker
export const stringToJSDate = (dateStr) => {
  if (!dateStr) return null;
  const date = dayjs(dateStr, DEFAULT_DATE_FORMAT);
  return date.isValid() ? date.toDate() : null; //as JS Date object not Day.js object
};
// formatDate: eg. Aug 23, 2025
export const formatDate = (
  dateStr,
  frmtStr = DEFAULT_DATE_FORMAT,
  defaultRtn = "-"
) => {
  if (!dateStr) return defaultRtn;

  try {
    let date;
    if (dateStr instanceof Date) {
      date = dateStr;
    } else if (typeof dateStr === "string") {
      // Try native parse first
      date = new Date(dateStr);
      // if (!isValid(date)) {
      //   // fallback: try date-fns parse
      //   date = parse(
      //     dateStr,
      //     "EEE MMM dd yyyy HH:mm:ss 'GMT'xxx (zzzz)",
      //     new Date()
      //   );
      // }
    }

    if (!isValid(date)) return defaultRtn;
    return format(date, frmtStr);
  } catch (error) {
    console.error("Error parsing date:", error);
    return defaultRtn;
  }
};
// Merge date + time first, then convert to UTC
const mergeDateTimeToUTC = (dateStr, timeStr) => {
  if (!dateStr) return null;

  let hours = 0,
    minutes = 0,
    seconds = 0;

  if (timeStr) {
    // timeStr can be '1899-12-30 02:05:28' or '02:05:28'
    const t = timeStr.includes(" ") ? timeStr.split(" ")[1] : timeStr;
    const [h, m, s] = t.split(":").map((n) => parseInt(n, 10));
    hours = h || 0;
    minutes = m || 0;
    seconds = s || 0;
  }

  // Merge date + time in given timezone
  const dt = dayjs(`${dateStr} ${ZERO_TIME}`, date_formats.DDMMMYYYYHHmmss)
    .tz(DEFAULT_TIMEZONE)
    .hour(hours)
    .minute(minutes)
    .second(seconds)
    .utc()
    .format(DEFAULT_DATE_FORMAT_DB);

  return dt;
};
// Converts a UTC date string to local display (like IST)
export const utcToLocal = (utcString, options = {}) => {
  if (!utcString) return "";
  return new Date(utcString).toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    ...options,
  });
};
export const localToUTC = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 19).replace("T", " ");
};
export const dateToFormattedString = (date, formatStr) => {
  //date is the Date object not string..
  const pad = (n) => String(n).padStart(2, "0");

  const map = {
    yyyy: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  return formatStr.replace(/yyyy|MM|dd|HH|mm|ss/g, (m) => map[m]);
};

// formatFull: Aug 23, 2025 at 9:20 PM
export const formatFull = (dateStr) => {
  const date = new Date(dateStr);
  const datePart = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart} at ${timePart}`;
};

// Helper function to convert "HH:MM:SS" to decimal hours
export const convertTimeToHours = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours + minutes / 60 + seconds / 3600;
};
