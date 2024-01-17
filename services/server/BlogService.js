import BlogRepository from "../../models/repositories/BlogRepository";

class BlogService {
  static findBlogs = async ({ query = {}, sort = "-createdAt", itemsOfPage = 10, page = 1, select }) => {
    const limitItems = itemsOfPage * 1;
    const pageItem = page * 1;
    const skipItems = (pageItem - 1) * limitItems;
    const data = await BlogRepository.find({
      query,
      limit: limitItems,
      skip: skipItems,
      select,
      sort,
    });
    return { limitItems, pageItem, data };
  };
}
export default BlogService;
