const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  firstUser: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user id']
  },
  secondUser: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user id']
  }
});

module.exports = mongoose.model('Room', roomSchema)