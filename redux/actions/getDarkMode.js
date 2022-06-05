import { GET_DARKMODE } from "./constants";
export const getDarkMode = (value) => (dispatch) => {
  dispatch({
    type: GET_DARKMODE,
    data: value,
  });
};
