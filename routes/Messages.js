const express = require("express");

const router = express.Router();


const Controller = require("../controllers/Messages");
const AuthenticateWithToken = require("../Middlewares/AuthWithToken");


router.post("/sendMessage",AuthenticateWithToken,Controller.SendMessage);

router.get("/allMessages/:chatId",AuthenticateWithToken,Controller.GetAllMessages);





module.exports= router