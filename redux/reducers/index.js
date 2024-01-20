import { combineReducers } from "redux";
import darkMode from "./darkMode";
import getSystemReducer from "./getSystemReducer";
const reducers = combineReducers({
  darkMode,
  system: getSystemReducer,
});

export default (state, action) => reducers(state, action);
