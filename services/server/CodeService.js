import CodeRepository from "../../models/repositories/CodeRepository";

class CodeService {
  static findCodes = async ({ query = {}, sort = { createdAt: -1 }, itemsOfPage = 10, page = 1, select, options }) => {
    const limitItems = itemsOfPage * 1;
    const pageItem = page * 1;
    const skipItems = (pageItem - 1) * limitItems;
    const data = await CodeRepository.find({
      query,
      limit: limitItems,
      skip: skipItems,
      select,
      sort,
      options,
    });
    return { limitItems, pageItem, data };
  };
}
export default CodeService;
