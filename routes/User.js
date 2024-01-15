const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const workerController = require("../controllers/worker")
const AuthenticateWithToken = require("../Middlewares/AuthWithToken");
router.post("/signUp", UserController.signUpUser);
router.post("/loginUser", UserController.LoginUser);
router.post("/forgot-password", UserController.forgotPassword);
router.put("/reset-password/:otp", UserController.resetPassword);
router.put("/newPassword", UserController.newPassword);



router.get("/allWorkers/:userId/:type?",AuthenticateWithToken,workerController.getAllWorkers);
router.put("/updateOnlineStatus/:id",AuthenticateWithToken,workerController.toggleOnlineStatus);
module.exports = router;
