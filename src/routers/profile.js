const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validate");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile was edited successfully!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;
    const isPasswordValid = await loggedInUser.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = newHashedPassword;
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your password edited successfully!`,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
