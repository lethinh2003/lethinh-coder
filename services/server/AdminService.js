import BlogRepository from "../../models/repositories/BlogRepository";
import CodeRepository from "../../models/repositories/CodeRepository";
import HistoryCodeRepository from "../../models/repositories/HistoryCodeRepository";
import UserRepository from "../../models/repositories/UserRepository";

class AdminService {
  static getOverview = async () => {
    const getOrders = HistoryCodeRepository.countDocuments({
      query: {},
    });
    const getOrdersSuccess = HistoryCodeRepository.countDocuments({ query: { status: "success" } });
    const getSourcesCode = CodeRepository.countDocuments({ query: {} });
    const getBlogs = BlogRepository.countDocuments({ query: {} });
    const getUsers = UserRepository.countDocuments({ query: {} });

    const results = await Promise.all([getOrders, getOrdersSuccess, getSourcesCode, getUsers, getBlogs]).then(
      (data) => {
        return [
          { key: "orders", title: "Đơn Hàng", value: data[0] },
          { key: "ordersSuccess", title: "Thành Công", value: data[1] },
          { key: "sourcesCode", title: "Source Code", value: data[2] },
          { key: "users", title: "Người Dùng", value: data[3] },
          { key: "blogs", title: "Blog", value: data[4] },
        ];
      }
    );
    return results;
  };
  static getHistoryDownloadCode = async () => {
    const results = await HistoryCodeRepository.findAll({
      query: {},
      select: "-__v",
      sort: "-_id",
    });

    return results;
  };
  static getUsers = async () => {
    const results = await UserRepository.findAll({
      query: {},
      select: "-__v -password",
      sort: "-_id",
    });

    return results;
  };
  static getBlogs = async () => {
    const results = await BlogRepository.findAll({
      query: {},
      select: "-__v",
      sort: "-_id",
    });

    return results;
  };
  static getCodes = async () => {
    const results = await CodeRepository.findAll({
      query: {},
      select: "-__v",
      sort: "-_id",
    });

    return results;
  };
  static getDetailedBlog = async ({ blogId }) => {
    const result = await BlogRepository.findOne({
      query: {
        _id: blogId,
      },
      select: "-__v",
    });

    return result;
  };
  static getDetailedCode = async ({ codeId }) => {
    const result = await CodeRepository.findOne({
      query: {
        _id: codeId,
      },
      select: "-__v",
    });

    return result;
  };
  static updateDetailedBlog = async ({ blogId, title, content, images, status, desc, labels, keywords }) => {
    const result = await BlogRepository.findOneAndUpdate({
      query: {
        _id: blogId,
      },
      update: {
        title: title,
        content: content,
        images: images,
        status: status,
        desc: desc,
        labels: labels,
        keywords: keywords,
      },
    });

    return result;
  };
  static updateDetailedCode = async ({
    codeId,
    title,
    link,
    costs,
    content,
    images,
    status,
    desc,
    labels,
    keywords,
  }) => {
    const result = await CodeRepository.findOneAndUpdate({
      query: {
        _id: codeId,
      },
      update: {
        title: title,
        link,
        costs,
        content: content,
        images: images,
        status: status,
        desc: desc,
        labels: labels,
        keywords: keywords,
      },
    });

    return result;
  };
  static createNewBlog = async ({ title, content, images, status, desc, labels, keywords }) => {
    const result = await CodeRepository.createOne({
      data: {
        link: link,
        costs,
        title: title,
        content: content,
        images: images,
        status: status,
        desc: desc,
        labels: labels,
        keywords: keywords,
      },
    });

    return result;
  };
  static createNewCode = async ({ title, link, costs, content, images, status, desc, labels, keywords }) => {
    const result = await BlogRepository.createOne({
      data: {
        title: title,
        content: content,
        images: images,
        status: status,
        desc: desc,
        labels: labels,
        keywords: keywords,
      },
    });

    return result;
  };
  static deleteBlog = async ({ blogId }) => {
    const result = await BlogRepository.findOneAndDelete({
      query: {
        _id: blogId,
      },
    });

    return result;
  };
  static deleteCode = async ({ codeId }) => {
    const result = await CodeRepository.findOneAndDelete({
      query: {
        _id: codeId,
      },
    });

    return result;
  };
}
export default AdminService;
