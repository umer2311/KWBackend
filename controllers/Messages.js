const Message = require("../models/Messages");
const Chat = require("../models/Chat");

// Function to send a message
const SendMessage = async (req, res) => {
  try {
    // Destructure receiverId, text, and initiatorId from request body
    const { receiverId, text, initiatorId } = req.body;

    // Find a chat that includes both the receiver and the initiator
    let chat = await Chat.findOne({
      users: {
        $all: [receiverId, initiatorId],
      },
    }).populate({
      path: 'users',
      select: 'firstName lastName _id', 
    })

    // If no chat exists, create a new one
    if (!chat) {
      const newChat = new Chat({
        users: [receiverId, initiatorId],
      });
      chat = await newChat.save();
    }

    // Populate the 'users' field in the chat document
    await chat.populate({
      path: 'users',
      select: 'firstName lastName _id', 
    });

    // Create a new message
    const newMessage = await Message({
      sender: initiatorId,
      content: text,
      chatId: chat._id,
    });

    // Save the new message
    const savedMessage = await newMessage.save();

    // Populate the 'sender' field in the message document
   await savedMessage.populate({
      path: 'sender',
      select: 'firstName lastName _id', 
    });

    // If the message was saved, update the 'latestMessage' field in the chat document
    if (savedMessage) {
      await Chat.findByIdAndUpdate(
        chat._id,
        { $set: { latestMessage: savedMessage._id } },
        { new: true }
      );
    }

    // Return the chat and the message
    return res.status(201).json({chat:chat,message:savedMessage});
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error });
    console.log(error);
  }
};

// Function to get all messages in a chat
const GetAllMessages = async (req, res) => {
  try {
    // Destructure chatId from request parameters
    const { chatId } = req.params;

    // Find all messages in the chat
    const messages = await Message.find({ chatId: chatId }).populate({
      path: 'sender',
      select: 'firstName lastName _id', 
    }).lean();

    // Return the messages
    res.status(200).json(messages);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message:"error is in message controller" });
  }
};

module.exports = { SendMessage, GetAllMessages };