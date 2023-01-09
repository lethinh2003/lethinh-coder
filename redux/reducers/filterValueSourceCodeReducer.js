import { SET_FILTER_VALUE_SOURCE_CODE } from "../actions/constants";
const initialState = {
  costs: "costs",
  date: "-createdAt",
};
const filterValueSourceCodeReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case SET_FILTER_VALUE_SOURCE_CODE:
      return {
        ...state,
        costs: payload.data.costs,
        date: payload.data.date,
      };
    default:
      return state;
  }
};
export default filterValueSourceCodeReducer;
