const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://godsonsaji077:godson123@cluster0.qlolexf.mongodb.net/devTinder"
  );
};

module.exports = {
  connectDB,
};
