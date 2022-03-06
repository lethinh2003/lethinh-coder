import Cors from "cors";
import initMiddleware from "../../lib/init-middleware";
import rateLimit from "../../lib/rate-limit";
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 20, // Max 20 users per second
});

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    origin: "https://www.lethinh-coder.site",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export default async function handler(req, res) {
  // Run cors
  try {
    await cors(req, res);
    // Rest of the API logic
    await limiter.check(res, 20, "CACHE_TOKEN"); // 20 requests per minute

    return res.status(200).json({ message: "Hello Everyone!" });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Something went error",
    });
  }
}
