import EmailSubscriber from "../EmailSubscriber";

class EmailSubscriberRepository {
  static find = async ({ query = {}, limit, skip, select, sort }) => {
    const results = await EmailSubscriber.find(query).skip(skip).limit(limit).sort(sort).select(select).lean();

    return results;
  };

  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await EmailSubscriber.find(query).select(select).populate(populate).lean();
    return result;
  };

  static findOne = async ({ query = {}, select = "" }) => {
    const result = await EmailSubscriber.findOne(query).select(select).lean();
    return result;
  };
  static countDocuments = async ({ query = {} }) => {
    const result = await EmailSubscriber.countDocuments(query);
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await EmailSubscriber.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await EmailSubscriber.findOneAndDelete(query, options).select(select);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await EmailSubscriber.create(data);
    return result;
  };
}

export default EmailSubscriberRepository;
