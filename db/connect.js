const mongoose = require('mongoose');

const connectDB = async (uri) => {
  await mongoose.connect(uri).then(() => {
    console.log("MongoDB connected successfully");
  }).catch((err) => {
    console.error("Error when trying to connect to MongoDB", err);
  });
}

module.exports = connectDB