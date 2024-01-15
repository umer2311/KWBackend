// Import the Chat model
const Chat = require("../models/Chat");

// Function to handle chat with friends
const chatWithFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch chats for the user with populated latestMessage
    // Use lean() for performance improvement as it returns plain javascript objects, not Mongoose documents.
    let chats = await Chat.find({
      users: { $in: [userId] },
    })
      .populate({
        path: "latestMessage",
        model: "MessageSchema",
      })
      .populate({path:"users",select:"_id firstName lastName services"})
      .lean();
    // Send the chats as a response
    res.status(200).json(chats);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
};

// Export the function
module.exports = { chatWithFriends };