import createAj from "../config/arcjet.config.js";
import { isSpoofedBot } from "@arcjet/inspect";

const otpLimiter = async (req, res, next) => {
  try {
    const aj = createAj(3, 60);
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return res.status(429).json({
          message: "Gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
        });
      else if (decision.reason.isBot())
        return res.status(403).json({
          message: "Bot access denied",
        });
      else
        return res.status(403).json({
          message: "Từ chối truy cập vì lí do bảo mật.",
        });
    }

    if (decision.results.some(isSpoofedBot))
      return res.status(403).json({
        message: "Spoofed bot detected",
      });

    next();
  } catch (error) {
    console.error("Arcjet middleware err:", error);
    next();
  }
};


export {otpLimiter}