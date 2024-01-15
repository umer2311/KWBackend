const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
   trim:true
  },
  lastName: {
    type: String,
    required: true,
    trim:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim:true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim:true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  address: {
    type: String,
  },
  // rating:{

  //   type:Number
  // },
  otpVerified: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetExpiry: {
    type: Date,
    default: null,
  },
  resetOtp: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "worker"],
    default: "user",
  },
  services: [
    {
      name: {
        type: String,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
    },
  ],
  status:{
   type:String,
   enum:["online","offline","busy"],
   default:"online"
  },
  rating:{
    type:Number,
    default:0
  },
  access:{
    type:String,
    enum:["accepted","denied"],
    default:"accepted"
  }
});
//userSchema.index({location:"2dsphere"})
module.exports = mongoose.model("User", userSchema);
//model
