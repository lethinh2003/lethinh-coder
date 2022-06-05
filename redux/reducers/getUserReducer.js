import { GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_ERROR } from "../actions/constants";

// khởi tạo một init state
const initialState = {
  requesting: false,
  success: false,
  error: false,
  message: null,
  data: null,
};

// bắt từng action type
function getUserReducer(state = initialState, payload) {
  switch (payload.type) {
    case GET_USER_REQUEST:
      return {
        ...state,
        requesting: true,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        error: false,
        data: payload.data.data,
      };
    case GET_USER_ERROR:
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

export default getUserReducer;
