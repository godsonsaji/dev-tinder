const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/user/:userId/:status", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;
    const loggedInUser = req.user;

    const allowedStatus = ["like", "dislike"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send(`Invalid status type: ${status}`);
    }

    const ConnectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).send("Connection Request Exists");
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      res.status(400).json({ message: "User Not Found!" });
    }

    const data = await ConnectionRequest.save();

    res.json({
      message: `${loggedInUser.firstName} ${status}'s ${toUser.firstName}`,
      data,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

requestRouter.post(
  "/user/match/:userId/:status",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, userId } = req.params;

      const allowedStatus = ["accept-match", "reject-match"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status Not Allowed!" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: userId,
        toUserId: loggedInUser._id,
        status: "like",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Not Found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: `${loggedInUser.firstName} ${status}`,
        data,
      });
    } catch (error) {
      res.status(400).send(`Error: ${error}`);
    }
  }
);

module.exports = requestRouter;
