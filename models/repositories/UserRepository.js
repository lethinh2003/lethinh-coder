import User from "../User";

class UserRepository {
  static find = async ({ query = {}, limit, skip, select, sort, options }) => {
    const results = await User.find(query, options).skip(skip).limit(limit).sort(sort).select(select).lean();

    return results;
  };

  static findAll = async ({ query = {}, select = "", populate, sort }) => {
    const result = await User.find(query).select(select).populate(populate).sort(sort).lean();
    return result;
  };

  static findOne = async ({ query = {}, select = "" }) => {
    const result = await User.findOne(query).select(select).lean();
    return result;
  };
  static countDocuments = async ({ query = {} }) => {
    const result = await User.countDocuments(query);
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await User.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await User.findOneAndDelete(query, options).select(select);
    return result;
  };

  static createOne = async ({ data = {}, options = {} }) => {
    const { _doc } = await User.create([data], options);
    return _doc;
  };
}

export default UserRepository;
