import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { getDateObject, getNowStr } from "../utils/time_utils";

/**
 * Reusable hook for list pages with date range filter
 *
 * @param {Function} fetcherFn - function(from, to) that returns Promise of data
 * @param {Function} setDataFn - optional setter for external data state
 * @param {Function} reduxAction - action to dispatch with fetched data
 * @param {boolean} initialToday - fetch today's data on mount
 */
const useDateRangeData = ({
  fetcherFn,
  setDataFn = null,
  reduxAction = null,
  initialToday = true,
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  const fetchData = useCallback(
    async (from, to) => {
      if (!from || !to) return [];
      setIsLoading(true);
      try {
        setFromDate(from);
        setToDate(to);
        const result = await fetcherFn(from, to);
        setLastResponse(result);

        if (!result.success) {
          setData([]);
          if (setDataFn) setDataFn([]);
          return [];
        }
        const data = result.data;
        setData(data);
        if (setDataFn) setDataFn(data);
        if (reduxAction) dispatch(reduxAction(data));
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    [fetcherFn, reduxAction, dispatch, setDataFn]
  );
  const clearData = () => {
    if (setDataFn) setDataFn([]);
    if (!initialToday) return;
    const today = getNowStr();
    fetchData(today, today);
  };
  // Fetch today's data on mount
  useEffect(() => {
    clearData();
  }, [fetchData, initialToday]);

  const handleSearchClick = (from, to) => {
    fetchData(from, to);
  };
  const handleClearClick = () => {
    clearData();
  };
  const handleChange = (from, to) => {
    if ((!from || !to) && !initialToday) return;
    if (!from || !to) {
      const today = getNowStr();
      fetchData(today, today);
    } else {
      fetchData(from, to);
    }
  };
  // Expose fetchData as refetch
  const refetch = useCallback(() => {
    console.log("refetch before");
    if (!fromDate || !toDate) return;
    console.log("refetch after");
    return fetchData(fromDate, toDate);
  }, [fetchData, fromDate, toDate]);
  return {
    data,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    handleSearchClick,
    handleChange,
    handleClearClick,
    isLoading,
    lastResponse,
    refetch,
  };
};

export default useDateRangeData;
