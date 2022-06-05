import { GET_SYSTEM_REQUEST, GET_SYSTEM_SUCCESS, GET_SYSTEM_ERROR } from "./constants";
import axios from "axios";
import { signOut } from "next-auth/react";
// import { toast } from "react-toastify";

export const getSystem = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SYSTEM_REQUEST });

    const url = `${process.env.ENDPOINT_SERVER}/api/v1/systems`;
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
    if (err.response) {
      //   if (err.response.data.message.name === "TokenExpiredError") {
      //     // toast.error("Tài khoản hết hạn! Vui lòng đăng nhập lại!");
      //     signOut();
      //   }
    }
  }
};
