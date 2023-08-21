const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    minLength: 3,
    maxLength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 6
  }
});

// Middlewares
UserSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Custon Methods
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, username:this.username }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_LIFETIME }
  );
}

UserSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
}

module.exports = mongoose.model("User", UserSchema)