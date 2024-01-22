import axios from "axios";

class CodeService {
  static updateDetailedCode = async ({ id, link, costs, title, content, images, desc, status, labels, keywords }) => {
    const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/v1/admin/codes/${id}`, {
      title,
      link,
      costs,
      content,
      images,
      desc,
      status,
      labels,
      keywords,
    });
    return response;
  };
  static createNewCode = async ({ link, costs, title, content, images, desc, status, labels, keywords }) => {
    const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/v1/admin/codes`, {
      title,
      link,
      costs,
      content,
      images,
      desc,
      status,
      labels,
      keywords,
    });
    return response;
  };
  static deleteCode = async ({ codeId }) => {
    const response = await axios.delete(`${process.env.NEXTAUTH_URL}/api/v1/admin/codes/${codeId}`);
    return response;
  };
}
export default CodeService;
