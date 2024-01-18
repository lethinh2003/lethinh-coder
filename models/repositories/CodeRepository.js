import Code from "../Code";

class CodeRepository {
  static find = async ({ query = {}, limit, skip, select, sort, options }) => {
    const results = await Code.find(query, options).skip(skip).limit(limit).sort(sort).select(select).lean();

    return results;
  };

  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await Code.find(query).select(select).populate(populate).lean();
    return result;
  };

  static findOne = async ({ query = {}, select = "" }) => {
    const result = await Code.findOne(query).select(select).lean();
    return result;
  };
  static countDocuments = async ({ query = {} }) => {
    const result = await Code.countDocuments(query);
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await Code.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await Code.findOneAndDelete(query, options).select(select);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await Code.create(data);
    return result;
  };
}

export default CodeRepository;
