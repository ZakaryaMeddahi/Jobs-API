const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company:{
    type: String,
    required : [true, 'Please provide a company name'],
    maxlength: 50
  },
  position:{
    type:String,
    required: [true,'Please enter the Position title'],
    maxlength: 100
  },
  status:{
    type: String,
    enum: ['Pending', 'Interviewing','Offered','Rejected'],
    default: 'Pending',
  },
  createdBy:{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please Provide a user id']
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema)