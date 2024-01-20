import axios from "axios";
import { GET_SYSTEM_ERROR, GET_SYSTEM_REQUEST, GET_SYSTEM_SUCCESS } from "./constants";
// import { toast } from "react-toastify";

export const getSystem = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SYSTEM_REQUEST });

    const url = `${process.env.NEXTAUTH_URL}/api/v1/systems`;
    const response = await axios.get(url);
    const responseBody = response.data.data;
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
