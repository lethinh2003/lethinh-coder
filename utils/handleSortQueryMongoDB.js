export const handleSortQueryMongoDB = (sortString = "") => {
  const sortQuery = {};
  sortString.split(" ").forEach((sortFiled) => {
    const sortValue = sortFiled.startsWith("-") ? -1 : 1;
    const fieldName = sortFiled.replace(/^-/, "");
    sortQuery[fieldName] = sortValue;
  });
  return sortQuery;
};
