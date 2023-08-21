const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { NotFoundError, BadRequestError } = require("../errors");

// Retrieve All Jobs That Has Created By The User
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ company: { 
    $regex: req.query.company, $options: 'i' 
  }, createdBy:req.user.userId });
  if(!jobs) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Error' });
  }
  res.status(StatusCodes.OK).json({ jobs });
}

// Retrieve Single Job Related to Specific User (Can't get Other User's Jobs)
const getJob = async (req, res, next) => {
  try {
    const { params: { id: jobId }, user: { userId }} = req;
    const job = await Job.findOne({ _id: jobId, createdBy: userId });
    if(!job) {
      const err = new NotFoundError(`No Job with the ID: ${jobId}`);
      return next(err);
    }
    res.status(StatusCodes.OK).json({ job });
  } catch(err) {
    console.error(err);
    return next(err);
  }
}

// User Create Single Job
const createJob = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.userId;
    const job = Job({ ...req.body });
    await job.save();
    res.status(StatusCodes.CREATED).json({ job });
  } catch(err) {
    console.error(`Error creating a new job: ${err}`);
    next(err);
  }
}

// User Update Single Job
const updateJob = async (req, res, next) => {
  try {
    const { body: modifiedJob, params: { id: jobId }, user: { userId } } = req;
    if(modifiedJob.company.length === 0 || modifiedJob.position.length === 0) {
      return next(new BadRequestError('Company and Position are required fields'));
    }
    const updatedJob = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, modifiedJob, { 
      new: true, 
      runValidators: true 
    });
    if(!updatedJob) {
      const err = new NotFoundError(`No Job with the ID: ${jobId}`);
      return next(err);
    }
    res.status(StatusCodes.OK).json({ updatedJob });
  } catch(err) {
    console.error(err);
    next(err);
  }
}

// User Delete One Of His Jobs
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findById(jobId);
  if(!job) {
    const err = new NotFoundError(`No Job with the id: ${jobId}`);
    return next(err);
  }
  await job.deleteOne();
  res.status(StatusCodes.OK).json({ message: `The Job with id: ${jobId} has been deleted successfully` });
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}