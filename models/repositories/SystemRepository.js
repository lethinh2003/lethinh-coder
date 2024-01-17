import System from "../System";

class SystemRepository {
  static find = async ({ query = {}, limit, skip, select, sort }) => {
    const results = await System.find(query).skip(skip).limit(limit).sort(sort).select(select).lean();

    return results;
  };

  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await System.find(query).select(select).populate(populate).lean();
    return result;
  };

  static findOne = async ({ query = {}, select = "" }) => {
    const result = await System.findOne(query).select(select).lean();
    return result;
  };
  static countDocuments = async ({ query = {} }) => {
    const result = await System.countDocuments(query);
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await System.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await System.findOneAndDelete(query, options).select(select);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await System.create(data);
    return result;
  };
}

export default SystemRepository;
