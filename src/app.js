const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3001;
require("./config/database");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/requests");
app.use(authRouter);
app.use(profileRouter);
app.use(requestRouter);

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
