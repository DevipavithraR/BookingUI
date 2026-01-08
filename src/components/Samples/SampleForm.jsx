import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import {
  DEFAULT_DATE_FORMAT_JS,
  getSampleFormdata,
} from "../../utils/constants";

const SampleForm = ({ data, onSubmit, onCancel }) => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [formData, setFormData] = useState(getSampleFormdata());

  // Populate form with existing sample data when editing
  useEffect(() => {
    setFormData(getSampleFormdata(data));
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For numeric fields, ensure only numbers are accepted
    if (name === "pur_price" || name === "sale_price" || name === "stock") {
      // Allow empty value or valid numbers (including decimals for prices)
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      // If invalid input, we don't update the state, effectively rejecting the input
      return;
    }
    
    // For non-numeric fields, use the default behavior
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className={`rounded-xl p-6 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {data ? "Edit Sample" : "Add New Sample"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Enter sample name"
              required
            />
          </div>

          <div>
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Purchase Date *
            </label>
            <DatePicker
              selected={formData.pur_date}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, pur_date: date }))
              }
              dateFormat={DEFAULT_DATE_FORMAT_JS}
              placeholderText="Select date"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              showYearDropdown
              dropdownMode="select"
              isClearable={false}
              popperClassName="date-picker-popper"
              popperProps={{ strategy: "fixed" }}
            />
          </div>

          <div>
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Purchase Price *
            </label>
            <input
              type="number"
              name="pur_price"
              value={formData.pur_price}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Enter purchase price"
              required
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Sale Price *
            </label>
            <input
              type="number"
              name="sale_price"
              value={formData.sale_price}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Enter sale price"
              required
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Enter stock quantity"
              required
              min="0"
            />
          </div>

          <div>
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Enter description"
              rows="3"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg font-medium ${
              darkMode
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {data ? "Update Sample" : "Add Sample"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SampleForm;
