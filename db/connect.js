const mongoose = require('mongoose');

const connectDB = async (uri) => {
  await mongoose.connect(uri).then(() => {
    console.log("MongoDB connected successfully");
  }).catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
}

module.exports = connectDB