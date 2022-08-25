export default function useUtils() {
  /**
   *
   * @param {string} str - the string to be converted to camelCase
   * @param {number} at - the index of the first character to be converted to camelCase (default: 0)
   * @returns
   */
  const upperCharAt = (str, at = 0) => {
    return str.charAt(at).toUpperCase();
  };

  return { upperCharAt };
}
