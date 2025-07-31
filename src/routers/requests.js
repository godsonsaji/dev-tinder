const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/send-connection", userAuth, async (req, res) => {
  try {
    const user = req.body;
    res.send(`${user.firstName} send a connection request!`);
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

module.exports = requestRouter;
