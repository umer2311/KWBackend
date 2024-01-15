const express = require("express");

const router = express.Router();


const Controller = require("../controllers/Chat");
const AuthenticateWithToken = require("../Middlewares/AuthWithToken");

router.get("/chat/:userId",Controller.chatWithFriends);

module.exports= router