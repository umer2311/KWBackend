const Order = require("../models/orders");
const User = require("../models/users");
const mongoose = require("mongoose");
// Helper function to format time as "HH:mm"

function formatTime(inputTime) {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  // Validate the time format
  if (!timeRegex.test(inputTime)) {
    throw new Error("Invalid time format. Please use the format HH:mm.");
  }

  // If the time is valid, return it as is or perform additional formatting if needed
  return inputTime;
}

const creatAnOrder = async (req, res) => {
  try {
    const { Title, Status, users, details, date,time, amount, service } = req.body;
    console.log(req.body)
    //const Time = formatTime(time);
    const newOrder = await new Order({
      Title,
      Status,
      users,
      date,
      details,
      amount,
      service,
    });

    await newOrder.save();
    await newOrder.populate({path:"users",select:"_id firstName lastName "})
    console.log(newOrder);
    res.status(201).json({ newOrder: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error is there", error.message)
  }
};

const getAllOrdersOfAUser = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ users: { $in: [id] } }).lean();
    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getOrdersByIdnStatus = async (req, res) => {
  try {
    const users = req.params.users;
    const status = req.params.status;

    const orders = await Order.find({
      users: { $in: users },
      Status: status,
    }).populate("users");

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSchOrdersByIdnStatus = async (req, res) => {
  try {
    const users = req.params.users;
    const status = req.params.status;

    const orders = await Order.find({
      users: { $in: users },
      Status: status,
    }).populate({ path: "users", select: "firstName email" });
    console.log(orders);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCancelledOrder = async (req, res) => {
  try {
    const users = req.params.users;
    const status = req.params.status;
    const orders = await Order.find({
      users: { $in: users },
      Status: status,
    }).populate({
      path: "cancelReason.c_id",
      model: "User",
      select: "firstName email", // Select the fields you want to populate in the response
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActiveOrders = async (req, res) => {
  try {
    const users = req.params.users;
    const status = req.params.status;
    const orders = await Order.find({
      users: { $in: users },
      Status: status,
    }).populate({
      path: "users",
      select: "_id firstName email", // Select the fields you want to populate in the response
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { userId, orderId, cancelReason, Status } = req.body;
    const _id = orderId;
    const updatedOrder = await Order.findByIdAndUpdate(
      _id,
      {
        $set: {
          Status: Status,
          cancelReason: {
            c_id: userId,
            reason: cancelReason,
          },
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({
      message: "Order status and cancel reason updated successfully",
      updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const activateStatus = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log("orderId", req.body);
    const Status = "Active";
    const _id = orderId;
    const updatedOrder = await Order.findByIdAndUpdate(
      _id,
      {
        $set: {
          Status: Status,
        },
      },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changeStatusToPast = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log("orderId", req.body);
    const Status = "Past";
    const _id = orderId;
    const updatedOrder = await Order.findByIdAndUpdate(
      _id,
      {
        $set: {
          Status: Status,
        },
      },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  creatAnOrder,
  getOrdersByIdnStatus,
  changeStatus,
  getSchOrdersByIdnStatus,
  getCancelledOrder,
  getActiveOrders,
  activateStatus,
  changeStatusToPast,
  getAllOrdersOfAUser
};
