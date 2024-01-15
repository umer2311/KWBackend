const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
    required: true,
  },
  feedbackGiver: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  feedbackReceiver: {
    type: mongoose.Schema.ObjectId,
    ref: "User", 
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
},
{ timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
