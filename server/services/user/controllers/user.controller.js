import CreateError from "http-errors";
import { signToken } from "../helpers/jwt.helper.js";
import { comparePassword, hashPassword } from "../helpers/password.helper.js";
import UserModel from "../models/UserModel.js";
import { sendQueue } from "../../../shared/messages/rabbitMQ.js";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      throw new CreateError.BadRequest("Username or password is missing");

    const user = await UserModel.findOne({ username });
    if (!user) throw new CreateError.NotFound("User does not exist");

    const isCorrectPassword = await comparePassword(password, user.password);

    if (!isCorrectPassword) throw new CreateError("Password is not correct");

    await signToken({ userId: user._id });

    return res.status(200).json({
      message: "Login successfully",
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createAccount = async (req, res, next) => {
  try {
    const { username, password, fullname, phone, email, balance } = req.body;

    if (!username || !password || !fullname || !phone || !email || !balance) 
      throw CreateError.BadRequest("Some field is missing")

    const existingUser = await UserModel.findOne({username})

    if (existingUser)
      throw CreateError.Conflict("Username is already used")

    const hashedPassword = await hashPassword(password)

    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      fullname,
      phone,
      email,
      balance
    })

    await sendQueue("user_created", JSON.stringify({
      studentId: newUser.username,
      fullname: newUser.fullname,
      email: newUser.email,
      phone: newUser.phone
    }));

    return res.status(201).json({
      message: "Create successfully",
      success: true,
      newUser: {
        ...newUser._doc,
        password: undefined
      },
    })

  } catch (error) {
    next(error);
  }
};

const getUserInfo = async(req ,res, next) => {
  try {
      const {username} = req.params

      if (!username)
        throw CreateError.BadRequest("Username is required")

      const user = await UserModel.findOne({username})

      if (!user)
        throw CreateError.NotFound("User does not exist")

      return res.status(200).json({
        user: {
          ...user._doc,
          password: undefined
        },
        success: true,
      })
  } catch (error) {
    next(error)
  }
}

export { login, createAccount, getUserInfo };
