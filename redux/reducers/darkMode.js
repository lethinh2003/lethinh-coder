import { GET_DARKMODE, SET_DARKMODE } from "../actions/constants";

const initialState = {
  on: false,
};
const darkMode = (state = initialState, payload) => {
  switch (payload.type) {
    case GET_DARKMODE:
      return state;
    case SET_DARKMODE:
      localStorage.setItem("darkMode", payload.data);
      return {
        ...state,
        on: payload.data,
      };
    default:
      return state;
  }
};
export default darkMode;
