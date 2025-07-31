const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Cardinals");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 36000000),
      });
      res.send("Login Successful!!");
    } else {
      throw new Error("Invalid Cardinals");
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

module.exports = authRouter;
