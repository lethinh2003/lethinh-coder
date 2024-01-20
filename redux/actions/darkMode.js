import { GET_DARKMODE, SET_DARKMODE } from "./constants";

export const setDarkMode = (value) => (dispatch) => {
  dispatch({
    type: SET_DARKMODE,
    data: value,
  });
};
export const getDarkMode = () => (dispatch) => {
  dispatch({
    type: GET_DARKMODE,
  });
};
