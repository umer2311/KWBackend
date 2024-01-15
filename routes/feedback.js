const feedback =require("../controllers/feedback")
const express = require("express");
const router = express.Router();
 router.post('/addFeedback', feedback.addFeedback)
module.exports =router;