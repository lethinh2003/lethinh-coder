import SystemRepository from "../../models/repositories/SystemRepository";
import { BadRequestError } from "../../utils/appError";

class SystemService {
  static findDetailedSystem = async ({ query, select, options }) => {
    const getSystem = await SystemRepository.findOne({
      query,
      select,
    });
    if (!getSystem) {
      throw new BadRequestError("Cấu hình hệ thống không tồn tại");
    }
    return getSystem;
  };
}
export default SystemService;
