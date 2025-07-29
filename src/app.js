const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const app = express();
const PORT = 3001;
require("./config/database");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

app.post("/send-connection", userAuth, async (req, res) => {
  try {
    const user = req.body;
    res.send(`${user.firstName} send a connection request!`);
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to DB successfully!");
    app.listen(PORT, () => {
      console.log(`Server started running successfully on PORT:${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB");
  });

console.log("Hello");
console.log("Hello World");
