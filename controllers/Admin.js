require("dotenv").config();

const Feedback = require("../models/feedback");
const User = require("../models/users");
const Order = require("../models/orders");
const Service = require("../models/Services");

// Get all users with role 'user'
const getUsers = async (req, res) => {
  try {
    // Use lean() to improve performance
    const users = await User.find({ role: "user" })
      .select("_id firstName lastName role access rating")
      .lean();
    res.status(200).json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const getAllWorkers = async (req, res) => {
  try {
    // Use lean() to improve performance
    console.log(" ran ")
    const users = await User.find({ role: "worker" })
      .select("_id firstName lastName role access rating services")
      .lean();
      console.log(users)
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrdersOfUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const { id } = req.params;
    // Use lean() to improve performance
    const orders = await Order.find({ users: { $in: [id] } }).lean();
    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const EnableOrDisableUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { access } = req.body;
    // Use findByIdAndUpdate instead of findAndUpdate
    const UpdatedAccess = await User.findByIdAndUpdate(
      id,
      {
        access: access,
      },
      {
        new: true,
      }
    ).lean();
    res.status(200).json(UpdatedAccess);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllFeedbacks = async (req, res) => {
  try {
    const { id } = req.params;
    // Use lean() to improve performance
    const feedbacks = await Feedback.find({ feedbackReceiver: id })
      .populate({
        path: "feedbackGiver",
        select: "firstName lastName rating access",
      })
      .select("text rating")
      .lean();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllServices = async (req, res) => {
  console.log("this is services")
  try {
   
    const services = await Service.find().lean();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("this is services error" ,error.message)
  }
};


const deleteTheService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addNewService = async (req, res) => {
  try {
    const { name,id } = req.body;
    const service = await Service.create({ name, created_by: id });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getAllWorkers,
  getAllOrdersOfUser,
  EnableOrDisableUser,
  getAllFeedbacks,
  getAllServices,
  deleteTheService,
  addNewService,
};
