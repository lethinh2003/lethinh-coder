import { combineReducers } from "redux";
import filterValueSourceCodeReducer from "./filterValueSourceCodeReducer";
import getDarkModeReducer from "./getDarkModeReducer";
import getSystemReducer from "./getSystemReducer";
import getUserReducer from "./getUserReducer";
const reducers = combineReducers({
  user: getUserReducer,
  darkMode: getDarkModeReducer,
  system: getSystemReducer,
  filterValueSourceCode: filterValueSourceCodeReducer,
});

export default (state, action) => reducers(state, action);
