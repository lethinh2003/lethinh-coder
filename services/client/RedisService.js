import { kv } from "@vercel/kv";
import { KEY_SYSTEM } from "../../configs/keyRedis";
import defaultSystemData from "../../configs/systemData";

class RedisService {
  static getDataSystem = async () => {
    // set data if doesn't exist
    await kv.set(KEY_SYSTEM, JSON.stringify(defaultSystemData), {
      nx: true,
    });
    // Get data system
    const data = await kv.get(KEY_SYSTEM);
    return data;
  };
}
export default RedisService;
