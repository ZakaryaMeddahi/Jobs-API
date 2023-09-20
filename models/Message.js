const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide a message']
  },
  sendedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user id']
  },
  roomId: {
    type: mongoose.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Please provide a room id']
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);