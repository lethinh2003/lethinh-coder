import HistoryCode from "../HistoryCode";

class HistoryCodeRepository {
  static find = async ({ query = {}, limit, skip, select, sort, options }) => {
    const results = await HistoryCode.find(query, options).skip(skip).limit(limit).sort(sort).select(select).lean();

    return results;
  };

  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await HistoryCode.find(query).select(select).populate(populate).lean();
    return result;
  };

  static findOne = async ({ query = {}, select = "" }) => {
    const result = await HistoryCode.findOne(query).select(select).lean();
    return result;
  };
  static countDocuments = async ({ query = {} }) => {
    const result = await HistoryCode.countDocuments(query);
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await HistoryCode.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await HistoryCode.findOneAndDelete(query, options).select(select);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await HistoryCode.create(data);
    return result;
  };
}

export default HistoryCodeRepository;
