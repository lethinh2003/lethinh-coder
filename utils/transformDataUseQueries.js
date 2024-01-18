const transfromData = (data) => {
  const results = data?.pages?.flatMap((item) => item.data) || [];
  return results;
};
export const transfromDataRelationalContent = (data, fromId) => {
  const results = data?.pages?.flatMap((item) => item.data) || [];
  const removeFromId = results.filter((item) => item._id.toString() !== fromId.toString());
  return removeFromId;
};
export default transfromData;
