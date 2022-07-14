import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const convertTime = (timeISOString) => {
  const now = dayjs(new Date());
  let result = dayjs(timeISOString).from(now);

  return result;
};
export default convertTime;
