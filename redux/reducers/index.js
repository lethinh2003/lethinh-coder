import { combineReducers } from "redux";
import getDarkmode from "./getDarkmode";
import getAvatar from "./getAvatar";

export default combineReducers({
  getDarkmode,
  getAvatar,
});
