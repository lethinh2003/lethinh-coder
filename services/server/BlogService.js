import BlogRepository from "../../models/repositories/BlogRepository";

class BlogService {
  static findAllBlogs = async ({ query = {}, sort = "-createdAt", select, options }) => {
    const data = await BlogRepository.find({
      query,
      select,
      sort,
      options,
    });
    return data;
  };
  static findBlogs = async ({ query = {}, sort = "-createdAt", itemsOfPage = 10, page = 1, select, options }) => {
    const limitItems = itemsOfPage * 1;
    const pageItem = page * 1;
    const skipItems = (pageItem - 1) * limitItems;
    const data = await BlogRepository.find({
      query,
      limit: limitItems,
      skip: skipItems,
      select,
      sort,
      options,
    });
    return { limitItems, pageItem, data };
  };

  static findDetailedBlog = async ({ query = {}, select, options }) => {
    const data = await BlogRepository.findOne({
      query,
      select,
      options,
    });
    return data;
  };
}
export default BlogService;
