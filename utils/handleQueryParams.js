/**
 * Convert query object to query url string
 *
 * Example:
 * {
 *      sort: "createdAt",
 *      limit: 10
 * }
 * Results: sort=createdAt&limit=10
 * @param {object} query
 * @returns {string} The query string
 */

const handleQueryParams = (query) => {
  if (Object.keys(query).length === 0) {
    return "";
  }
  const queryParamsArray = Object.keys(query).flatMap((key) => {
    if (!query[key]) {
      return [];
    }
    return [`${key}=${query[key]}`];
  });

  const queryParamsString = queryParamsArray.join("&");
  return queryParamsString;
};
export default handleQueryParams;
