const express = require("express");
const router = express.Router();
const AuthenticateWithToken = require("../Middlewares/AuthWithToken");
const OrdersController = require("../controllers/orders");

router.post(
  "/postanOrder",
  AuthenticateWithToken,
  OrdersController.creatAnOrder
);
router.get(
  "/getOrderbyIdnStatus/:users/:status",
  AuthenticateWithToken,
  OrdersController.getOrdersByIdnStatus
);
router.put(
  "/updateStatus",
  AuthenticateWithToken,
  OrdersController.changeStatus
);
router.get(
  "/getScheduledOrders/:users/:status",
  AuthenticateWithToken,
  OrdersController.getSchOrdersByIdnStatus
);
router.get(
  "/getCancelledOrder/:users/:status",
  AuthenticateWithToken,
  OrdersController.getCancelledOrder
);
router.get(
  "/getActiveOrder/:users/:status",
  AuthenticateWithToken,
  OrdersController.getActiveOrders
);
router.put("/activateStatus", OrdersController.activateStatus);
router.put("/changeToPast", OrdersController.changeStatusToPast);
router.get("/getAllOrderbyId/:id", OrdersController.getAllOrdersOfAUser);
module.exports = router;
