import { kv } from "@vercel/kv";
import { KEY_SYSTEM } from "../../configs/keyRedis";
import defaultSystemData from "../../configs/systemData";
import { GET_SYSTEM_ERROR, GET_SYSTEM_REQUEST, GET_SYSTEM_SUCCESS } from "./constants";

export const getSystem = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SYSTEM_REQUEST });
    // set data if doesn't exist
    await kv.set(KEY_SYSTEM, JSON.stringify(defaultSystemData), {
      nx: true,
    });
    // Get data system
    const responseBody = await kv.get(KEY_SYSTEM);
    dispatch({
      type: GET_SYSTEM_SUCCESS,
      data: responseBody,
    });
  } catch (err) {
    dispatch({
      type: GET_SYSTEM_ERROR,
      message: err.response ? err.response.data.message : err,
    });
  }
};
