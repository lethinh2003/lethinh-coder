import axios from "axios";
export default axios.create({
  baseURL: `${process.env.ENDPOINT_SERVER}/api/v1`,
});
