import readingTime from "reading-time";
const getReadingTime = (content) => {
  const stats = readingTime(content);
  const getMinutes = stats.text.split(" ");

  return getMinutes[0];
};
export default getReadingTime;
