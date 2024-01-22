import axios from "axios";

class BlogService {
  static updateDetailedBlog = async ({ id, title, content, images, desc, status, labels, keywords }) => {
    const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/v1/admin/blogs/${id}`, {
      title,
      content,
      images,
      desc,
      status,
      labels,
      keywords,
    });
    return response;
  };
  static createNewBlog = async ({ title, content, images, desc, status, labels, keywords }) => {
    const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/v1/admin/blogs`, {
      title,
      content,
      images,
      desc,
      status,
      labels,
      keywords,
    });
    return response;
  };
  static deleteBlog = async ({ blogId }) => {
    const response = await axios.delete(`${process.env.NEXTAUTH_URL}/api/v1/admin/blogs/${blogId}`);
    return response;
  };
}
export default BlogService;
