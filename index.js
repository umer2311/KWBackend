const express = require("express");
const app = express();
const mongoose = require("./db/connection");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const userApis = require("./routes/User")
const orderApis = require('./routes/orders')

const  ChatApis = require("./routes/Chat")
const MessageApis = require("./routes/Messages") 
const AdminApis = require("./routes/Admin");


const feedbackApis=require('./routes/feedback');
const AuthenticateWithToken = require("./Middlewares/AuthWithToken");
dotenv.config();

let PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/user", userApis);
app.use('/order',orderApis);

app.use("/chats", AuthenticateWithToken,ChatApis);

app.use("/messages", AuthenticateWithToken,MessageApis);
app.use('/feedback', AuthenticateWithToken,feedbackApis);
app.use("/admin",AdminApis)

const server = app.listen(PORT, "localhost", () => {
  console.log(`Server is up and running at http://localhost:${PORT}`);
});

//Socket.io
const io = require("socket.io")(server, {
  pingTimeout: 3600000,
  cors: {
    origin: "https://boisterous-speculoos-97fa96.netlify.app",
  },
});
let activeUsers = [];
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);
      socket.emit(" the user connected connected");
    } else {
      console.error("Invalid userData or _id missing");
    }
  });

  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("Connected Users: ", activeUsers);
    //emit is used to send the data
    io.emit("get-users", activeUsers);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room " + room);
  });
  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    let newMessage = newMessageReceived.newMessage;

    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessage.sender) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  socket.on("newOffer", (data) => {
    const { params, Wid, chat,user } = data;
    console.log(params, Wid,chat);

    socket.in(Wid).emit("gotNewOffer", { params, chat ,user});
  });

  socket.on("accept-reject", (data) => {
    const { result, Uid } = data;
    socket.in(Uid).emit("offerResult", result);
  });//emitted when a new order is created successfully.
  socket.on('new-order-created',(data) => {
    const {newOrder,Uid} = data;
    console.log(data)
    socket.in(Uid).emit("new-order-result", newOrder);

  });
  socket.on("startJob-accept-reject", (data) => {
    const { order, Uid } = data;
    socket.in(Uid).emit("startjob-request", order);
  });
  socket.on("startjob-response", (data) => {
    const { result, order } = data;
    console.log(data.order.users[1]._id);
    socket.in(data.order.users[1]._id).emit("startjob-result", data);
  });

  // socket.on("finishJob-accept-reject", (data) => {
  //   const { order, Uid } = data;
  //   console.log(data);
  //   socket.in(Uid).emit("finishjob-request", order);
  // });

  // socket.on("finishjob-response", (data) => {
  //   const { result, order } = data;
  //   console.log(data);
  //   socket.in(data.order.users[1]).emit("finishjob-result", data);
  // });
  socket.on("finishJob-accept-reject", (data) => {
    const { order } = data;
    //const id = Uid._id
    console.log(data, "finish job ");
    console.log(data.order.users[0]._id);
    data.order.users[0]._id
      ? socket.in(data.order.users[0]._id).emit("finishjob-request", order)
      : socket.in(data.order.users[0]).emit("finishjob-request", order);
  });
  socket.on("finishjob-response", (data) => {
    const { result, order } = data;
    console.log(data);
    console.log(data.order.users[1], "finish job response");
    data.order.users[1]._id
      ? socket.in(data.order.users[1]._id).emit("finishjob-result", data)
      : socket.in(data.order.users[1]).emit("finishjob-result", data);
  });
  socket.on("cancel-order", (order) => {
    console.log(order);
    socket.in(order.users[0]._id).emit("order-canceled", order);
  });
  // socket.on("cancel-order-user", (order) => {
  //   console.log(order);
  //   socket.in(order.users[1]._id).emit("order-canceled", order);
  // });
  socket.on("cancel-order-user", (order) => {
    console.log(order);
    socket.in(order.users[1]._id).emit("order-canceled", order)
      ? socket.in(order.users[1]._id).emit("order-canceled", order)
      : socket.in(order.users[1]).emit("order-canceled", order);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User remaining   ", activeUsers);
    io.emit("get-users", activeUsers);
  });
});

