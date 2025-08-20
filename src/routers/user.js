const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const user = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age gender profileImage";

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: "Data Fetched Successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accept-match" },
        { toUserId: loggedInUser._id, status: "accept-match" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsers = new Set();
    connectionRequests.forEach((req) => {
      hideUsers.add(req.fromUserId.toString());
      hideUsers.add(req.toUserId.toString());
    });

    const users = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUsers) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    console.log(hideUsers);
    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
