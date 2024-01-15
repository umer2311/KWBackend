const mongoose = require("mongoose");

require("dotenv").config();

const url = process.env.DATABASE;

mongoose.connect(url, {}).then(() => {
  console.log("db is connected");
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection failed"));

module.exports = mongoose;
