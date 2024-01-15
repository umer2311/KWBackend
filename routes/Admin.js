const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/Admin");
const AuthenticateWithToken = require("../Middlewares/AuthWithToken");

router.get("/services", AdminController.getAllServices);

router.get("/users", AuthenticateWithToken, AdminController.getUsers);
router.get("/workers", AuthenticateWithToken, AdminController.getAllWorkers);
router.get(
  "/orders/:id",
  AuthenticateWithToken,
  AdminController.getAllOrdersOfUser
);
router.put(
  "/users/:id",
  AuthenticateWithToken,
  AdminController.EnableOrDisableUser
);
router.get(
  "/feedbacks/:id",
  AuthenticateWithToken,
  AdminController.getAllFeedbacks
);

router.delete(
  "/services/:id",
  AuthenticateWithToken,
  AdminController.deleteTheService
);
router.post(
  "/newService",
  AuthenticateWithToken,
  AdminController.addNewService
);
module.exports = router;
