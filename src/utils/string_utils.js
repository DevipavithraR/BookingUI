/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - The input string
 * @returns {string} - The string with capitalized words
 */
export const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};