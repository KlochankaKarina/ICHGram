import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    if (!username || !fullname || !email || !password) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(409)
        .json({
          message: "Пользователь с таким email или username уже существует",
        });
    }

    const user = await User.create({ username, fullname, email, password });
    await Profile.create({
      user: user._id,
    });
    //const token = generateToken(user._id);

    res.status(201).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка регистрации", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparedPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({ user, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка авторизации", error: error.message });
  }
};

// export const searchUsers = async (req, res) => {
//   try {
//     const { query } = req.query;

//     if (!query?.trim) {
//       return res.json([]);
//     }

//     const users = await User.find({
//       username: {
//         $regex: query,
//         $options: "i",
//       },
//     })
//       .select("username fullname")
//       .limit(10);

//     res.json(users);
//   } catch (error) {
//     res.status(500).json({
//       message: "Search error",
//     });
//   }
// };

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query?.trim()) {
      return res.json([]);
    }

    const users = await User.find({
      username: {
        $regex: query.trim(),
        $options: "i",
      },
    })
      .select("username fullname")
      .limit(10)
      .lean();

    const userIds = users.map((user) => user._id);

    const profiles = await Profile.find({
      user: { $in: userIds },
    })
      .select("user avatarUrl")
      .lean();

    const avatarByUserId = new Map(
      profiles.map((profile) => [profile.user.toString(), profile.avatarUrl]),
    );

    const result = users.map((user) => ({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      avatarUrl: avatarByUserId.get(user._id.toString()) || "",
    }));

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Search error",
    });
  }
};
