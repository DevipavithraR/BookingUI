import { FiCalendar, FiTruck, FiPackage } from "react-icons/fi";
import { DEFAULT_DATE_FORMAT_FULL } from "./constants";
import { getFormattedStringOrDate } from "./time_utils";

export const generateFileNameWithTimeStamp = (fileName) => {
  if (!fileName) {
    return "unknown";
  }
  const currentDate = new Date();
  const formattedDate = getFormattedStringOrDate({
    dateOrStr: currentDate,
    formatString: DEFAULT_DATE_FORMAT_FULL,
  });
  const fileNameWithDate = `${fileName}_${formattedDate}`;
  return fileNameWithDate;
};
