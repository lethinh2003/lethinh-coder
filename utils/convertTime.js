import dayjs from "dayjs";

import ReactTimeago from "react-timeago";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import vnStrings from "react-timeago/lib/language-strings/vi";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const convertTime = (timeISOString) => {
  const now = dayjs(new Date());
  let result = dayjs(timeISOString).from(now);

  return result;
};

export const convertTimeAgo = (date) => {
  return <ReactTimeago date={date} formatter={buildFormatter(vnStrings)} />;
};
export default convertTime;
