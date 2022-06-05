import { GET_DARKMODE } from "../actions/constants";
const initialState = {
  on: false,
};
const getDarkModeReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case GET_DARKMODE:
      return {
        ...state,
        on: payload.data,
      };
    default:
      return state;
  }
};
export default getDarkModeReducer;
