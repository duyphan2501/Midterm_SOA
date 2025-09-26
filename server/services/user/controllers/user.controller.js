import CreateError from "http-errors";
import { signToken } from "../helpers/jwt.helper.js";
import UserModel from "../models/UserModel.js";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      throw CreateError.BadRequest("Tài khoản hoặc mật khẩu trống");

    const user = await UserModel.findUserByUsername(username);
    if (!user) throw CreateError.NotFound("Tài khoản không tồn tại");

    const isCorrectPassword = password === user.password;

    if (!isCorrectPassword) throw CreateError.Forbidden("Mât khẩu không đúng");
 
    const accessToken = await signToken({ userId: user.user_id });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      success: true,
      user: {
        ...user,
        password: undefined,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const decreaseBalance = async (req, res, next) => {
  try {
    const { userId, decreaseAmount } = req.body;
    if (!userId || !decreaseAmount)
      throw CreateError.BadRequest("UserId or decreaseAmount is missing");
    
    const affectedRows = await UserModel.decreaseBalance(
      decreaseAmount,
      userId
    );
    if (affectedRows === 0)
      throw CreateError.Conflict("Số dư không đủ để thanh toán");

    const user = await UserModel.findUserById(userId)

    return res.status(200).json({
      message: "Trừ số dư thành công",
      user,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const refreshUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (!userId) throw CreateError.Unauthorized();
    const user = await UserModel.findUserById(userId);
    console.log(user);
    if (!user) throw CreateError.NotFound("Người dùng không tồn tại");
    return res.status(200).json({
      message: "Lấy thông tin user thành công",
      success: true,
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
}

export { login, decreaseBalance, refreshUser };
