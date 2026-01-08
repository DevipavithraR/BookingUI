import {
  DEFAULT_DATE_FORMAT_FULL_12,
  DEFAULT_DATE_FORMAT_REQUEST,
  DEFAULT_TIMEZONE,
} from "./constants";
import { getFormattedStringOrDate } from "./time_utils";

export const transformSampleApiData = (apiData) => {
  return apiData.map((item, index) => {
    const formattedDetails = {
      ...item,
      pur_date: getFormattedStringOrDate({ dateOrStr: item.pur_date }),
    };
    return formattedDetails;
  });
};
export const transformSampleForAPI = (data) => {
  data.pur_date = getFormattedStringOrDate({
    dateOrStr: data.pur_date,
    timeZone: DEFAULT_TIMEZONE,
    formatString: DEFAULT_DATE_FORMAT_REQUEST,
  });
  return data;
};
export const transformLHApiData = (apiData) => {
  return apiData.map((item, index) => {
    const formattedDetails = {
      ...item,
      login_time: getFormattedStringOrDate({
        dateOrStr: item.login_time,
        formatString: DEFAULT_DATE_FORMAT_FULL_12,
      }),
      logout_time: getFormattedStringOrDate({
        dateOrStr: item.logout_time,
        formatString: DEFAULT_DATE_FORMAT_FULL_12,
      }),
    };
    return formattedDetails;
  });
};
