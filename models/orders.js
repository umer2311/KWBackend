const { Timestamp } = require("bson");
const { time } = require("console");
const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
    users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    date: {
      type: String,
    },
    time:{
      type:String
    },
    details: {
      type: String,
    },
    service:
    {
      type:String,
    },
    amount:{
      type:Number,
    },
    startTime:{
     type:Date
    },
    finishTime:
    {
      type:Date
    },
    cancelReason: {
      c_id: { type: mongoose.Schema.ObjectId, ref: "User" },
      reason: {
        type: String,
      },
    },
  },
);

module.exports = mongoose.model("Order", ordersSchema);
