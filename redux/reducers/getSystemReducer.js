import { GET_SYSTEM_REQUEST, GET_SYSTEM_SUCCESS, GET_SYSTEM_ERROR } from "../actions/constants";

// khởi tạo một init state
const initialState = {
  requesting: false,
  success: false,
  error: false,
  message: null,
  data: null,
};

// bắt từng action type
function getSystemReducer(state = initialState, payload) {
  switch (payload.type) {
    case GET_SYSTEM_REQUEST:
      return {
        ...state,
        requesting: true,
      };
    case GET_SYSTEM_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        error: false,
        data: payload.data,
      };
    case GET_SYSTEM_ERROR:
      return {
        ...state,
        requesting: false,
        success: false,

        error: true,
        message: payload.message,
      };

    default:
      return state;
  }
}

export default getSystemReducer;
