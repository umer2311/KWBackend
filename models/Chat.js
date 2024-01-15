const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    chatName: {
      type: String,
      default: "Private Chat",
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"MessageSchema",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatSchema", chatSchema);