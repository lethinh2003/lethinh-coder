import { combineReducers } from "redux";
import getUserReducer from "./getUserReducer";
import getDarkModeReducer from "./getDarkModeReducer";
import getSystemReducer from "./getSystemReducer";

const reducers = combineReducers({
  user: getUserReducer,
  darkMode: getDarkModeReducer,
  system: getSystemReducer,
});

export default (state, action) => reducers(state, action);
