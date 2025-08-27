const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  fullname: {
    type: String,
    required: true,
  },
  bio: {
    type:String,
    required:true
  },
  post_url:String,
  caption:String,
  pfp:String
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
