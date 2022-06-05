import axios from "./axios";
import { toast } from "react-toastify";
export default function request(method, uri, body, headers) {
  let config = {
    method: method.toLowerCase(),
    url: uri,
    baseURL: `${process.env.ENDPOINT_SERVER}/api/v1`,
    validateStatus: function (status) {
      return status >= 200 && status < 400;
    },
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response.data) {
        toast.error(error.response.data.message);
      }

      return Promise.reject(error);
    });
}
