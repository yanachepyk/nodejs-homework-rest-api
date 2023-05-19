const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SECRET_KEY } = process.env;

const register = async ({ body }, res, next) => {
  try {
    const { email, password } = body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: "Email in use" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const { email: newEmail, subscription } = await User.create({
      ...body,
      password: hashPassword,
    });

    res.status(201).json({
      user: {
        email: newEmail,
        subscription: subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async ({ body }, res, next) => {
  try {
    const { email, password } = body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Email or password is wrong" });
    }

    const comparedPassword = await bcrypt.compare(password, user.password);

    if (!comparedPassword) {
      res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "12h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(201).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: "" });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
  
        const user = await User.findByIdAndUpdate(userId, req.body, {new: true});
        
        if (!user) {
          res.status(404).json({message: "User not found"});
        }
        
        res.status(200).json({user});
    } catch (error) {
        next(error);
    }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription
};
