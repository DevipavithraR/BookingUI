import { getDateObject } from "./time_utils";

// Backend server URL
export const BACKEND_SERVER_URL = "http://localhost:3000/api";

export const HTTP_METHODS = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
  OPTIONS: "options",
  HEAD: "head",
  CONNECT: "connect",
  TRACE: "trace",
};

export const NETWORK_ERROR = "Network or server error";
export const UNDEFINED = "undefined";
export const CONTENT_TYPE = "Content-Type";
export const BLOB = "blob";
export const API_NOT_FOUND = "Server not support this action";
export const AUTH_REQUIRED_MSG = "Authentication required. Please log in.";
export const INSUFFICIENT_PERM_MSG =
  "Insufficient permissions. cannot perform this action.";
export const UNSUPPORTED_HTTP_METHOD_MSG = "Unsupported http method.";

export const API_RESOURCE_CONSTANTS = {
  AUTH: "auth",
  LOGIN: "login",
  REGISTER: "register",
  USERS: "users",
  LOGOUT: "logout",
  ACTIVE: "active",
  LOGIN_HISTORY: "login_history",
  SAMPLES: "samples",
};
// API URL mappings
export const API_URL_MAP = {
  AUTH: {
    LOGIN: () => `/${API_RESOURCE_CONSTANTS.AUTH}/login`,
    REGISTER: () => `/${API_RESOURCE_CONSTANTS.AUTH}/register`,
  },
  USERS: {
    GET_ALL_LOGIN_HISTORIES: () => `/${API_RESOURCE_CONSTANTS.USERS}/active`,
    GET_USER_LOGIN_HISTORY: (id) =>
      `/${API_RESOURCE_CONSTANTS.USERS}/${id}/login_history`,
    LOGOUT: () => `/${API_RESOURCE_CONSTANTS.USERS}/logout`,
  },
  COMMON: {
    URL: (base) => `/${base}`,
    URL_WITH_DATE: (base, from, to) => {
      let url = `/${base}`;
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      const fullUrl = `${url}?${params.toString()}`;
      return fullUrl;
    },
    URL_WITH_ID: (base, id) => `/${base}/${id}`,
    URL_WITH_ID_ANY: (base, id, item) => `/${base}/${id}/${item}`,
    URL_WITH_ANY: (base, item) => `/${base}/${item}`,
    URL_WITH_ANY_ID: (base, item, id) => `/${base}/${item}/${id}`,
  },
};
export const API_WHITELIST_URLS = [
  API_URL_MAP.COMMON.URL_WITH_ANY(
    API_RESOURCE_CONSTANTS.AUTH,
    API_RESOURCE_CONSTANTS.LOGIN
  ),
  API_URL_MAP.COMMON.URL_WITH_ANY(
    API_RESOURCE_CONSTANTS.AUTH,
    API_RESOURCE_CONSTANTS.REGISTER
  ),
];

// App routes
export const app_routes = {
  wild: "*",
  root: "/",
  unauthorized: "/unauthorized",
  login: API_URL_MAP.COMMON.URL_WITH_ANY(
    API_RESOURCE_CONSTANTS.AUTH,
    API_RESOURCE_CONSTANTS.LOGIN
  ),
  register: API_URL_MAP.COMMON.URL_WITH_ANY(
    API_RESOURCE_CONSTANTS.AUTH,
    API_RESOURCE_CONSTANTS.REGISTER
  ),
  samples: API_URL_MAP.COMMON.URL(API_RESOURCE_CONSTANTS.SAMPLES),

  user_activities: API_URL_MAP.COMMON.URL_WITH_ANY(
    API_RESOURCE_CONSTANTS.USERS,
    API_RESOURCE_CONSTANTS.ACTIVE
  ),
};

// Session keys
export const SESSION_KEYS = {
  USER: () => "usrky_",
  AT: () => "atky_",
  RT: () => "rtky_",
};

export const COMPANY_NAME = "Arffy";
// Error messages
export const LOGIN_FAILED_MSG = "Login failed";
export const INVALID_LOGIN_MSG = "Login failed: missing user/token";
export const DATA_SAVE_SUCCESS_MSG = (item) => `${item}  created successfully`;
export const DATA_SAVE_ERROR_MSG = (item) => `${item}  save failed`;
export const DATA_DELETE_SUCCESS_MSG = (item) => `${item} deleted successfully`;
export const DATA_DELETE_ERROR_MSG = (item) => `${item}  delete failed`;
export const DELETE_CONFIRM_MSG =
  "Are you sure you want to delete this sample?";

// date and time related starts
export const time_formats = {
  time24Full: "HH:mm:ss",
  time12Full: "hh:mm:ss",
  time24: "HH:mm",
  time12: "hh:mm",
  time12M: "hh:mm A",
  time12FullWithAMPM: "hh:mm:ss A",
};

// for date-fns's format fucntion  - format strings.. starts
// export const date_formats = {
//   YYYYMMDD: "YYYY-MM-DD",
//   YYYYMMDDHHmmss: "YYYY-MM-DD HH:mm:ss",
//   YYYYMMDDhhmmssA: "YYYY-MM-DD hh:mm:ss A",
//   YYYYMMDDTHHmmssZ: "YYYY-MM-DDTHH:mm:ssZ",
//   yyyyMMdd: "yyyy-MM-dd",
//   MMddMMyyyy: "MM-dd-yyyy",
//   MMMd: "MMM d",
//   MMMdyyyy: "MMM d, yyyy",
//   ddMMMyyyy: "dd-MMM-yyyy",
//   ddMMMyyyyHHMMSSAMPM: "dd-MMM-yyyy hh:mm:ss A",
//   YYYYMMDDHHmmss: "YYYY-MM-DD HH:mm:ss",
// };
// for date-fns's format fucntion  - format strings.. ends
// for dayjs - format strings.. starts
// for dayjs - format strings.. starts
export const date_formats = {
  // for using in dayjs formats...
  DDMMYYYYHHmmss: "DD-MM-YYYY HH:mm:ss",
  DDMMMYYYY: "DD-MMM-YYYY",
  DDMMMYYYYHHmmss: "DD-MMM-YYYY HH:mm:ss",
  DDMMMYYYYYhhmmssa: "DD-MMM-YYYY hh:mm:ss A",

  YYYYMMDD: "YYYY-MM-DD",
  YYYYMMDDhhmmssa: "YYYY-MM-DD hh:mm:ss A",
  YYYYMMDDTHHmmssZ: "YYYY-MM-DDTHH:mm:ssZ",

  YYYYMMDDHHmmss: "YYYY-MM-DD HH:mm:ss", // for DB

  // for native JS formatting if needed starts eg. react-datepicker's dateFormat's value is this , not the above dayjs format
  ddMMMyyyy: "dd-MMM-yyyy", //
  ddMMMyyyyHHmmss: "dd-MMM-yyyy HH:mm:ss",
  ddMMMyyyyhhmmssa: "dd-MMM-yyyy hh:mm:ss A",

  yyyyMMdd: "yyyy-MM-dd", //
  yyyyMMddhhmmssa: "yyyy-MM-dd hh:mm:ss A",
  yyyyMMddTHHmmssZ: "yyyy-MM-ddTHH:mm:ssZ",

  MMddMMyyyy: "MM-dd-yyyy",
  MMMd: "MMM D",
  MMMdyyyy: "MMM D, YYYY",
  // for native JS formatting if needed ends
};
export const RiyadhTZ = "Asia/Riyadh";
export const IndiaTZ = "Asia/Kolkata";
export const DEFAULT_TIMEZONE = IndiaTZ;
export const DEFAULT_DATE_FORMAT_JS = date_formats.ddMMMyyyy; //for native JS formatting like in datepicker
export const DEFAULT_DATE_FORMAT = date_formats.DDMMMYYYY; // dayjs formatting... for display
export const DEFAULT_DATE_FORMAT_FULL_12 = date_formats.DDMMMYYYYYhhmmssa; // dayjs formatting... for display
export const DEFAULT_DATE_FORMAT_FULL = date_formats.DDMMMYYYYHHmmss; // dayjs formatting... for display
export const DEFAULT_DATE_FORMAT_REQUEST = date_formats.DDMMMYYYYHHmmss; // sent in request....
export const DEFAULT_DATE_FORMAT_DB = date_formats.YYYYMMDDHHmmss; // DB formatting... UTC full
export const DAY = "day";
export const TODAY = "today";
export const YESTERDAY = "yesterday";
export const ZERO_TIME = "00:00:00";
// for dayjs - format strings.. ends

// Sort directions
export const ASC = "asc";
export const DESC = "DESC";

// Button style constants - centralized to eliminate duplication
export const BUTTON_STYLES = {
  PRIMARY_GRADIENT:
    "px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 hover:opacity-90 active:scale-95 bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-600 dark:to-blue-600 shadow-lg shadow-green-500/20 dark:shadow-green-600/20",
  PRIMARY_GRADIENT_FULL:
    "bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-600 dark:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50",
};

// Roles
export const ROLES = {
  ADMIN: "Admin",
  CLIENT: "Client",
};

// Sidebar menu configuration (shared between Sidebar and MobileSidebar)
export const menu_titles = {
  Main: "Main",
  Dashboard: "Dashboard",
  // Samples: "Samples",
  // User_Activities: "User Activities",
};
export const getMenuGroups = (icons) => [
  {
    title: menu_titles.Main,
    items: [
      {
        title: menu_titles.Dashboard,
        path: app_routes.root,
        icon: icons.Dashboard,
      },
      {
        title: menu_titles.Samples,
        path: app_routes.samples,
        icon: icons.Inventory2,
      },
      {
        title: menu_titles.User_Activities,
        path: app_routes.user_activities,
        icon: icons.People,
      },
    ],
  },
];

// Samples page constants - starts
export const SAMPLE_TABLE_FIELDS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "pur_price", label: "Purchase Price" },
  { key: "sale_price", label: "Sale Price" },
  { key: "pur_date", label: "Purchase Date" },
  { key: "stock", label: "Stock" },
];
export const NO_RECORD_MSG = 'No data found. Click "Add New" to create one.';
export const ADD_NEW = "Add New";
export const LOADING_MSG = "LOADING DATA";
export const ACTIONS = "Actions";
export const EDIT = "Edit";
export const DELETE = "Delete";
export const PREVIOUS = "Previous";
export const PAGE = "Page";
export const NEXT = "Next";
export const getSampleFormdata = (data = null) => {
  if (!data) {
    return {
      id: null,
      name: "",
      description: "",
      pur_price: "",
      sale_price: "",
      pur_date: getDateObject(), // << default today
      stock: "",
    };
  }

  return {
    id: data.id,
    name: data.name || "",
    description: data.description || "",
    pur_price: data.pur_price || "",
    sale_price: data.sale_price || "",
    pur_date: data.pur_date ? new Date(data.pur_date) : getDateObject(), // << edit mode
    stock: data.stock || "",
  };
};
// Samples page constants - ends
// Grade constants for orders filtering
export const GRADE_FILTERS = {
  ALL: "All",
  GREEN: "Green",
  STANDARD: "Standard",
};

// Status constants for orders filtering
export const APPROVAL_STATUSES = {
  ALL: "All",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};
export const USER_ACTIVITIES = "User Activities";
export const LOGIN_HISTORY = "Login History–";
export const LOGIN_TIME = "Login Time";
export const LOGOUT_TIME = "Logout Time";
export const NO_LOGIN_HISTORY = "No login history found for this user";
export const BACK = "Back";
export const NODATA = " No data found.";
export const ACTIVE = "Active";
