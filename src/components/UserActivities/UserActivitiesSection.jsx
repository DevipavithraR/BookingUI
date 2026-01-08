import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../../store/slicers/themeSlice";
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { getFormattedStringOrDate } from "../../utils/time_utils";
import {
  ACTIVE,
  BACK,
  date_formats,
  DEFAULT_DATE_FORMAT_FULL,
  LOGIN_HISTORY,
  LOGIN_TIME,
  LOGOUT_TIME,
  NO_LOGIN_HISTORY,
  NODATA,
  USER_ACTIVITIES,
} from "../../utils/constants";

const UserActivitiesSection = ({
  darkMode,
  data,
  selectedLoginRecord,
  userLoginHistory,
  onRecordSelect,
  onBackClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  console.log("activities: data: ", data);
  // Filter data based on search term
  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      (item.username && item.username.toLowerCase().includes(searchLower))
    );
  });
  console.log("Filter data: ", filteredData);
  // Format date for display (using the same format as Orders page)

  // Login record  component for the main table view
  const LoginRecordRow = ({ lr, index }) => (
    <div
      className={`grid grid-cols-12 gap-4 px-4 py-3 items-center transition-all duration-200 cursor-pointer ${
        darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
      } ${
        index % 2 === 0
          ? darkMode
            ? "bg-gray-800/30"
            : "bg-gray-50"
          : darkMode
          ? "bg-gray-800/50"
          : "bg-white"
      }`}
      onClick={() => onRecordSelect(lr)}
    >
      <div className="col-span-6">
        <span
          className={`truncate font-medium ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {lr.user.username}
        </span>
      </div>
      <div className="col-span-6">
        <span
          className={`truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          {lr.login_time}
        </span>
      </div>
    </div>
  );

  // History row component for user detail table view
  const HistoryRow = ({ history, index }) => (
    <div
      className={`grid grid-cols-12 gap-4 px-4 py-3 items-center transition-all duration-200 ${
        index % 2 === 0
          ? darkMode
            ? "bg-gray-800/30"
            : "bg-gray-50"
          : darkMode
          ? "bg-gray-800/50"
          : "bg-white"
      }`}
    >
      <div className="col-span-6">
        <span
          className={`truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          {history.login_time}
        </span>
      </div>
      <div className="col-span-6">
        <span
          className={`truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          {history.logout_time ? history.logout_time : ACTIVE}
        </span>
      </div>
    </div>
  );

  return (
    <div
      className={`rounded-xl p-4 lg:p-6 w-full ${
        darkMode
          ? "bg-[#1c2737] border border-gray-700"
          : "bg-white/90 border border-gray-200"
      } shadow-sm backdrop-blur-sm transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {USER_ACTIVITIES}
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {selectedLoginRecord
              ? `Login history for ${selectedLoginRecord.username}`
              : "View user login activities"}
          </p>
        </div>

        {selectedLoginRecord && (
          <button
            onClick={onBackClick}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            <ArrowBackIcon className="w-4 h-4 mr-2" />
            {BACK}
          </button>
        )}
      </div>

      {/* Search Bar */}
      {!selectedLoginRecord && (
        <div className="mb-6">
          <div
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <SearchIcon
              className={`w-5 h-5 mr-3 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search users..."
              className={`w-full bg-transparent outline-none text-sm ${
                darkMode
                  ? "text-white placeholder-gray-400"
                  : "text-gray-900 placeholder-gray-500"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Content */}
      {selectedLoginRecord ? (
        // User detail view with login history table
        <div className="space-y-6">
          <div className="mb-4">
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              User:{" "}
              <span
                className={`font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {selectedLoginRecord.user.username}
              </span>
            </p>
          </div>

          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {LOGIN_HISTORY}
          </h3>

          <div
            className={`rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className="
          grid grid-cols-12 gap-4 
          px-4 py-3 
          text-xs font-semibold uppercase tracking-wider 
          sticky top-0 z-10
        bg-[#343e4e] dark:bg-[#343e4e] text-white dark:text-indigo-50
        "
            >
              <div className="col-span-6">{LOGIN_TIME}</div>
              <div className="col-span-6">{LOGOUT_TIME}</div>
            </div>

            <div
              className={`divide-y ${
                darkMode ? "divide-gray-700" : "divide-gray-200"
              } min-h-[300px]`}
            >
              {userLoginHistory.length > 0 ? (
                userLoginHistory.map((history, index) => (
                  <HistoryRow key={index} history={history} index={index} />
                ))
              ) : (
                <div className="grid grid-cols-1 min-h-[250px] py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p
                      className={`text-lg ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {NO_LOGIN_HISTORY}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // All users view as table
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px] transition-all duration-300">
              {/* Table Header */}
              <div
                className="
          grid grid-cols-12 gap-4 
          px-4 py-3 
          text-xs font-semibold uppercase tracking-wider 
          sticky top-0 z-10
        bg-[#343e4e] dark:bg-[#343e4e] text-white dark:text-indigo-50
        "
              >
                <div className="col-span-6">User Name</div>
                <div className="col-span-6">Login Time</div>
              </div>

              {/* Table Body */}
              <div
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                } min-h-[400px]`}
              >
                {filteredData.length > 0 ? (
                  filteredData.map((lr, index) => (
                    <LoginRecordRow key={lr.id} lr={lr} index={index} />
                  ))
                ) : (
                  <div className="grid grid-cols-1 min-h-[350px] py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p
                        className={`text-lg ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {NODATA}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivitiesSection;
