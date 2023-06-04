const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const User = require("../models/user");
const { nanoid } = require("nanoid");
const { sendVerificationEmail } = require("../utils");
const { SECRET_KEY } = process.env;

const register = async ({ body }, res, next) => {
  try {
    const { email, password } = body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: "Email in use" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(email, { s: "250" });
    const { email: newEmail, subscription } = await User.create({
      ...body,
      avatarURL,
      verificationToken,
      password: hashPassword,
    });

    await sendVerificationEmail({ email, verificationToken });

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

    if (!user.verify) {
      res.status(401).json({ message: "Email is not verified" });
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

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempUpload, originalname } = req.file;
    const avatarsDir = path.join(__dirname, "..", "public", "avatars");
    const avatarName = `${req.user._id}_${originalname}`;
    const destinationUpload = path.join(avatarsDir, avatarName);

    Jimp.read(tempUpload, (err, image) => {
      if (err) {
        next(err);
        return;
      }
      image.resize(250, 250).quality(100).write(destinationUpload);
    });

    fs.unlink(tempUpload);

    const avatarURL = "avatars/" + avatarName;

    await User.findByIdAndUpdate(req.user._id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
  
    if (!user) {
      res.status(404).json({message: "User not found"});
    }

    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true
    });

    res.status(200).json({message: "Verification successful"});
  } catch (error) {
    next(error);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const {email} = req.body;
    const {verify, verificationToken} = await User.findOne({email});

    if (verify) {
      res.status(400).json({ message: "Verification has already been passed" });
    }

    await sendVerificationEmail({ email, verificationToken });

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail
};
