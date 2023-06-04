const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { registerSchema, loginSchema, updateSubscriptionSchema, resendVerificationEmailSchema } = require("../../schemas/users");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
} = require("../../controllers/users");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrentUser);

router.patch("/", authenticate, validateBody(updateSubscriptionSchema), updateSubscription);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", validateBody(resendVerificationEmailSchema), resendVerificationEmail);

module.exports = router;
