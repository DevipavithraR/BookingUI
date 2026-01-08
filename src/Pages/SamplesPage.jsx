import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectDarkMode } from "../store/slicers/themeSlice";
import { service } from "../services/samplesService";
import DateRangeFilter from "../components/common/DateRangeFilter";
import SampleForm from "../components/Samples/SampleForm";
import { useMediaQuery } from "react-responsive";
import useDateRangeData from "../CustomHooks/useDateRangeData";
import NeonLoader from "../sub-components/loaders/LoadingUI";
import { useToast } from "../components/Notifications/ToastDemo";
import {
  ACTIONS,
  ADD_NEW,
  DATA_DELETE_ERROR_MSG,
  DATA_DELETE_SUCCESS_MSG,
  DATA_SAVE_ERROR_MSG,
  DATA_SAVE_SUCCESS_MSG,
  DELETE,
  DELETE_CONFIRM_MSG,
  EDIT,
  LOADING_MSG,
  NEXT,
  NO_RECORD_MSG,
  PAGE,
  PREVIOUS,
  SAMPLE_TABLE_FIELDS,
} from "../utils/constants";
import { Dialog, DialogContent } from "@mui/material";

const Page = () => {
  const { id, sd, ed, grade, status } = useParams(); //here id is any parent's id like truck, client, plant etc.,
  const singularName = "Sample";
  const darkMode = useSelector(selectDarkMode);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const toast = useToast(darkMode);
  const [data, setData] = useState([]);

  // Grade and Status filter states
  const [gradeFilter, setGradeFilter] = useState(grade?.toLowerCase());
  const [statusFilter, setStatusFilter] = useState(status?.toLowerCase());

  // Sample states
  const [showSampleForm, setShowSampleForm] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // for loading data with daterange filter starts
  const fetcherFn = useCallback(
    (from, to) => {
      // This function will only recreate when `id` changes
      return service.getAll(from, to);
    },
    [] // dependency array ensures memoization
  );

  const {
    handleChange,
    handleSearchClick,
    handleClearClick,
    isLoading,
    lastResponse,
    refetch,
  } = useDateRangeData({
    fetcherFn, // your callback
    setDataFn: setData, // external setter
  });

  // DONT change the following 1 and 2 sequence... It MUST be in this order 1 -> 2 -> 3 only
  // 1) Declare initialFetchDone BEFORE any effect
  const initialFetchDone = useRef(false);
  // 2)
  useEffect(() => {
    if (!lastResponse) return;
    if (!lastResponse.success) {
      toast.error(lastResponse.message);
    }
    //  else {
    //   toast.success("Success");
    // }
  }, [lastResponse]);
  // 3) RESET EFFECT – handles sidebar navigation to /Orders
  useEffect(() => {
    if (!sd && !ed && !id) {
      //fires only for /orders
      console.log(
        "Resetting Orders on sidebar navigation",
        sd,
        ed,
        gradeFilter,
        statusFilter
      );
      // Reset table
      // handleClearClick();
      // Reset initial fetch flag
      initialFetchDone.current = false;
    }
  }, [sd, ed, id]);
  // 4) INITIAL PARAM-BASED FETCH – only when sd & ed exist
  useEffect(() => {
    if (sd && ed && !initialFetchDone.current) {
      console.log("Orders Initial auto search ", sd, ed, grade, status);

      handleChange(sd, ed); // run server fetch using URL params

      initialFetchDone.current = true;
    }
  }, [sd, ed, handleChange, handleSearchClick]);
  // if (isLoading || !data) {
  //   return <NeonLoader text="Loading..." />;
  // }
  // Handle create/update sample
  const handleSave = async (data) => {
    try {
      let response;
      if (!data.id) {
        response = await service.create(data);
      } else {
        response = await service.update(data.id, data);
      }
      if (response.success) {
        toast.success(response.message); //show server message if you want
        // toast.success(DATA_SAVE_SUCCESS_MSG(singularName));
        setShowSampleForm(false);
        refetch();
      } else {
        toast.error(response.message); //show server message if you want
        // toast.error(DATA_SAVE_ERROR_MSG(singularName));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle delete sample
  const handleDelete = async (id) => {
    if (!window.confirm(DELETE_CONFIRM_MSG)) {
      return;
    }
    try {
      const response = await service.delete(id);
      if (response.success) {
        toast.success(response.message); //show server message if you want
        // toast.success(DATA_DELETE_SUCCESS_MSG(singularName));
        setShowSampleForm(false);
        refetch();
      } else {
        toast.error(response.message); //show server message if you want
        // toast.error(DATA_DELETE_ERROR_MSG(singularName));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Sorting function
  const sortedSamples = [...data].sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date comparison
      if (sortConfig.key === "pur_date" || sortConfig.key === "created_at") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  // Filtering function - filter by search term (date filtering is done on backend now)
  const filteredSamples = sortedSamples.filter((sample) => {
    // Search term filtering
    return (
      sample.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sample.id &&
        sample.id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Pagination
  const totalItems = filteredSamples.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const paginatedSamples = filteredSamples.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle sort request
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div
      className={`rounded-xl p-2 sm:p-4 lg:p-6 w-full transition-all duration-200 ${
        darkMode
          ? "bg-gray-800/90 border border-gray-700"
          : "bg-white/90 border border-gray-200"
      } shadow-sm backdrop-blur-md`}
    >
      <header className="mb-6 sm:mb-8 relative">
        <h1
          className={`text-2xl sm:text-3xl font-bold mb-2 relative ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Samples
        </h1>
      </header>

      <DateRangeFilter
        onChange={handleChange}
        autoRefetch={false}
        onApply={handleSearchClick}
        applyLabel="Search"
        darkMode={darkMode}
        showOrderFilters={false}
      />

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 mt-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search samples..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`px-4 py-2 rounded-lg border w-full sm:w-64 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingData(null);
              setShowSampleForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {ADD_NEW}
          </button>
        </div>
      </div>

      {/* Modal Popup for Sample Form using MUI Dialog */}
      <Dialog
        open={showSampleForm}
        onClose={() => {
          setShowSampleForm(false);
          setEditingData(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <SampleForm
            data={editingData}
            onSubmit={handleSave}
            onCancel={() => {
              setShowSampleForm(false);
              setEditingData(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <div
        className={`relative rounded-xl overflow-hidden min-h-[400px] shadow-lg border ${
          darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {totalItems === 0 ? (
          <div className="flex items-center justify-center h-[400px]">
            <p
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {NO_RECORD_MSG}
            </p>
          </div>
        ) : (
          // Desktop Table View Only
          <div className="overflow-x-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr>
                  {SAMPLE_TABLE_FIELDS.map((header) => (
                    <th
                      key={header.key}
                      className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer transition-colors min-w-[100px] ${
                        darkMode
                          ? "bg-[#343e4e] text-[#F0F9FF] hover:bg-[#4d67bf]"
                          : "bg-[#343e4e] text-white hover:bg-[#4d67bf]"
                      }`}
                      onClick={() => requestSort(header.key)}
                    >
                      <div className="flex items-center justify-start">
                        {header.label}
                        {sortConfig.key === header.key && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                      darkMode
                        ? "bg-[#343e4e] text-[#F0F9FF]"
                        : "bg-[#343e4e] text-white"
                    }`}
                  >
                    {ACTIONS}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSamples.map((sample) => (
                  <tr
                    key={sample.id}
                    className={`border-t ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-800"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {sample.id}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {sample.name}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {sample.description}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {sample.pur_price}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {sample.sale_price}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {sample.pur_date}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {sample.stock}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingData(sample);
                            setShowSampleForm(true);
                          }}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                        >
                          {EDIT}
                        </button>
                        <button
                          onClick={() => handleDelete(sample.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          {DELETE}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div
          className={`flex flex-col sm:flex-row justify-between items-center mt-6 p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div
            className={`mb-4 sm:mb-0 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, totalItems)}{" "}
            to {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems}{" "}
            entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              } ${
                darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {PREVIOUS}
            </button>
            <span
              className={`px-3 py-1 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {PAGE} {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              } ${
                darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {NEXT}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
