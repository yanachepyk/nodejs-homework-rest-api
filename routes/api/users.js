const express = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const { registerSchema, loginSchema, updateSubscriptionSchema } = require("../../schemas/users");
const { register, login, logout, getCurrentUser, updateSubscription } = require("../../controllers/users");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrentUser);

router.patch("/", authenticate, validateBody(updateSubscriptionSchema), updateSubscription);

module.exports = router;