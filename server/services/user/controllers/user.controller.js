import CreateError from "http-errors";
import { signToken } from "../helpers/jwt.helper.js";
import UserModel from "../models/UserModel.js"
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      throw CreateError.BadRequest("Username or password is missing");

    const user = await UserModel.findUserByUsername(username);
    if (!user) throw CreateError.NotFound("User does not exist");

    const isCorrectPassword = password === user.password

    if (!isCorrectPassword) throw CreateError("Password is not correct");

    await signToken({ userId: user._id });

    return res.status(200).json({
      message: "Login successfully",
      success: true,
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { login };
