const { StatusCodes } = require('http-status-codes');
const Room = require('../models/Room');
const Message = require('../models/Message');

let usersSockets = [];

const getStatus = (req, res) => {
  res.status(StatusCodes.OK).json({ 
    success: true, 
    users: Object.keys(usersSockets) 
  });
}

const authenticate = (socket) => {
  socket.on('authenticate', (userId) => {
    usersSockets[userId] = socket;
    // socket.emit('update status', Object.keys(usersSockets));
  });
}

const openRoom = (socket) => {
  socket.on('open room', async ({ senderId, recipentId }) => {
    const room = await Room.findOne({ 
      $or:[
        { firstUser: senderId, secondUser: recipentId },
        { firstUser: recipentId, secondUser: senderId }
      ]
    });
    if(!room) {
      const newRoom = new Room({
        firstUser: senderId,
        secondUser: recipentId
      });
      await newRoom.save();
    }
  });
}

const sendMessage = (socket) => {
  socket.on('send message', async ({ message, senderId, recipentId }) => {
    const room = await Room.findOne({ 
      $or:[
        { firstUser: senderId, secondUser: recipentId },
        { firstUser: recipentId, secondUser: senderId }
      ]
    });
    const roomId = room._id;
    // const newMessage = new Message({
    //   text: message,
    //   sendedBy: senderId,
    //   roomId: roomId
    // });
    // await newMessage.save();

    socket.join(roomId);
    if(usersSockets[recipentId]) {
      usersSockets[recipentId].join(roomId);
      socket.to(roomId).emit('send message', { message, senderId, recipentId });
    }
  });
}

const disconnect = (socket) => {
  socket.on('disconnect', () => {
    console.log("disconnected");
    for(const userId in usersSockets) {
      if(socket.id === usersSockets[userId].id) {
        delete usersSockets[userId];
        // socket.emit('update status', Object.keys(usersSockets));
        break;
      }
    }
  });
}

module.exports = {
  getStatus,
  authenticate,
  openRoom,
  sendMessage,
  disconnect
}