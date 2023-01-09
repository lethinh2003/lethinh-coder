import { SET_FILTER_VALUE_SOURCE_CODE } from "./constants";
export const setFilterValueSourceCode = (value) => (dispatch) => {
  dispatch({
    type: SET_FILTER_VALUE_SOURCE_CODE,
    data: value,
  });
};
