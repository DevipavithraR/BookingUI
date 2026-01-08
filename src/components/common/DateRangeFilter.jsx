import { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import {
  getFormattedStringOrDate,
  isToday,
  getDateObject,
} from "../../utils/time_utils";
import {
  DEFAULT_DATE_FORMAT_JS,
  BUTTON_STYLES,
  GRADE_FILTERS,
  APPROVAL_STATUSES,
} from "../../utils/constants";
import PropTypes from "prop-types";

/**
 * Reusable Date Range Filter Component
 * Props:
 * - onChange(from, to): called whenever dates change
 * - onClear(): optional, called when cleared
 * - onApply(): optional, called on apply
 * - autoRefetch: boolean (default false)
 * - darkMode: boolean
 * - showOrderFilters: boolean (default false) - whether to show Grade and Status filters
 * - gradeFilter: string (Grade filter value, required if showOrderFilters is true)
 * - setGradeFilter: function (Grade filter setter, required if showOrderFilters is true)
 * - statusFilter: string (Status filter value, required if showOrderFilters is true)
 * - setStatusFilter: function (Status filter setter, required if showOrderFilters is true)
 */
const DateRangeFilter = ({
  onChange,
  onClear,
  onApply,
  applyLabel = "Search",
  autoRefetch = false,
  darkMode = false,
  sd,
  ed,
  // Order filter props (optional)
  showOrderFilters = false,
  gradeFilter,
  setGradeFilter,
  statusFilter,
  setStatusFilter,
}) => {
  const [fromDate, setFromDate] = useState(getDateObject(sd));
  const [toDate, setToDate] = useState(getDateObject(ed));
  const isDefaultRange =
    isToday(getFormattedStringOrDate({ dateOrStr: fromDate })) &&
    isToday(getFormattedStringOrDate({ dateOrStr: toDate }));

  // Callbacks
  const handleApplyFilter = useCallback(() => {
    const fromStr = getFormattedStringOrDate({ dateOrStr: fromDate });
    const toStr = getFormattedStringOrDate({ dateOrStr: toDate });

    if (onApply) onApply(fromStr, toStr);
    if (onChange && autoRefetch) onChange(fromStr, toStr);
  }, [fromDate, toDate, onApply, onChange, autoRefetch]);

  const handleClearFilters = useCallback(() => {
    const today = getDateObject();
    setFromDate(today);
    setToDate(today);

    const todayStr = getFormattedStringOrDate({ dateOrStr: today });

    // Reset grade and status filters to "All" if they exist
    if (setGradeFilter) setGradeFilter(GRADE_FILTERS.ALL);
    if (setStatusFilter) setStatusFilter(APPROVAL_STATUSES.ALL);

    if (onClear) onClear();
    if (onChange && autoRefetch) onChange(todayStr, todayStr);
  }, [onClear, onChange, autoRefetch, setGradeFilter, setStatusFilter]);

  useEffect(() => {
    // Convert sd and ed to date objects
    const newFrom = getDateObject(sd);
    const newTo = getDateObject(ed);

    setFromDate(newFrom);
    setToDate(newTo);
    if (!sd || !ed) {
      // if its /orders
      if (setGradeFilter) setGradeFilter(GRADE_FILTERS.ALL);
      if (setStatusFilter) setStatusFilter(APPROVAL_STATUSES.ALL);
    }
  }, [sd, ed]);
  // Auto trigger onChange whenever date range changes
  useEffect(() => {
    if (onChange && autoRefetch && !isDefaultRange) {
      const fromStr = getFormattedStringOrDate({ dateOrStr: fromDate });
      const toStr = getFormattedStringOrDate({ dateOrStr: toDate });
      onChange(fromStr, toStr);
    }
  }, [fromDate, toDate, onChange, autoRefetch, isDefaultRange]);

  return (
    <div className="flex flex-wrap items-end gap-4 mt-4 md:mt-0">
      <div className="flex flex-col -mr-2">
        <label className={darkMode ? "labelClassDark" : "labelClassLight"}>
          From Date
        </label>
        <DatePicker
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
          dateFormat={DEFAULT_DATE_FORMAT_JS}
          placeholderText="Select start date"
          className={darkMode ? "inputClassDark" : "inputClassLight"}
          showYearDropdown
          dropdownMode="select"
          isClearable={false}
          popperClassName="date-picker-popper"
          popperProps={{ strategy: "fixed" }}
        />
      </div>

      <div className="flex flex-col">
        <label className={darkMode ? "labelClassDark" : "labelClassLight"}>
          To Date
        </label>
        <DatePicker
          selected={toDate}
          onChange={(date) => setToDate(date)}
          dateFormat={DEFAULT_DATE_FORMAT_JS}
          placeholderText="Select end date"
          className={darkMode ? "inputClassDark" : "inputClassLight"}
          showYearDropdown
          dropdownMode="select"
          isClearable={false}
          popperClassName="date-picker-popper"
          popperProps={{ strategy: "fixed" }}
        />
      </div>

      {/* Grade and Status filters - only shown when showOrderFilters is true */}
      {showOrderFilters && (
        <>
          {/* Grade Filter */}
          <div className="flex flex-col">
            <label className={darkMode ? "labelClassDark" : "labelClassLight"}>
              Type
            </label>
            <select
              value={gradeFilter?.toLowerCase()}
              onChange={(e) => setGradeFilter(e.target.value)}
              className={darkMode ? "inputClassDark" : "inputClassLight"}
            >
              <option value={GRADE_FILTERS.ALL.toLowerCase()}>
                {GRADE_FILTERS.ALL}
              </option>
              <option value={GRADE_FILTERS.GREEN.toLowerCase()}>
                {GRADE_FILTERS.GREEN}
              </option>
              <option value={GRADE_FILTERS.STANDARD.toLowerCase()}>
                {GRADE_FILTERS.STANDARD}
              </option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className={darkMode ? "labelClassDark" : "labelClassLight"}>
              Status
            </label>
            <select
              value={statusFilter?.toLowerCase()}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={darkMode ? "inputClassDark" : "inputClassLight"}
            >
              <option value={APPROVAL_STATUSES.ALL.toLowerCase()}>
                {APPROVAL_STATUSES.ALL}
              </option>
              <option value={APPROVAL_STATUSES.ACCEPTED.toLowerCase()}>
                {APPROVAL_STATUSES.ACCEPTED}
              </option>
              <option value={APPROVAL_STATUSES.REJECTED.toLowerCase()}>
                {APPROVAL_STATUSES.REJECTED}
              </option>
            </select>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        <div className="mb-2 h-6"></div>
        <div className="flex gap-2">
          {/* Optional Apply button */}
          {onApply && (
            <button
              onClick={handleApplyFilter}
              className={BUTTON_STYLES.PRIMARY_GRADIENT}
            >
              {applyLabel}
            </button>
          )}
          {/* Optional Clear button */}
          {onClear && (
            <button
              onClick={handleClearFilters}
              className={
                darkMode ? "clearButtonClassDark" : "clearButtonClassLight"
              }
              disabled={isDefaultRange}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

DateRangeFilter.propTypes = {
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onApply: PropTypes.func,
  applyLabel: PropTypes.string,
  autoRefetch: PropTypes.bool,
  darkMode: PropTypes.bool,
  sd: PropTypes.string,
  ed: PropTypes.string,
  showOrderFilters: PropTypes.bool,
  gradeFilter: PropTypes.string,
  setGradeFilter: PropTypes.func,
  statusFilter: PropTypes.string,
  setStatusFilter: PropTypes.func,
};

export default DateRangeFilter;
