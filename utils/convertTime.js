const convertTime = (timeISOString) => {
  let date = `Gần đây`;
  const getFullDate = new Date(timeISOString);
  const getDay = `${getFullDate.getDate() < 10 ? "0" + getFullDate.getDate() : getFullDate.getDate()}/${
    getFullDate.getMonth() < 9 ? "0" + (getFullDate.getMonth() + 1) : getFullDate.getMonth() + 1
  }/${getFullDate.getFullYear()}`;
  const getTime = `${getFullDate.getHours() < 10 ? "0" + getFullDate.getHours() : getFullDate.getHours()}:${
    getFullDate.getMinutes() < 10 ? "0" + getFullDate.getMinutes() : getFullDate.getMinutes()
  }:${getFullDate.getSeconds() < 10 ? "0" + getFullDate.getSeconds() : getFullDate.getSeconds()}`;
  date = getDay + " " + getTime;
  return date;
};
export default convertTime;
