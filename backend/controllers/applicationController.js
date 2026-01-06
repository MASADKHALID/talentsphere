const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Submit job application
// @route   POST /api/applications
// @access  Private
exports.submitApplication = async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Please provide job ID' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already applied
    let application = await Application.findOne({ jobId, userId: req.user.id });
    if (application) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Create application
    application = await Application.create({
      jobId,
      userId: req.user.id,
      coverLetter,
      resume,
    });

    // Update application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    // Notify employer
    const user = await User.findById(req.user.id);
    await createNotification({
      recipient: job.company,
      sender: req.user.id,
      type: 'job_applied',
      job: jobId,
      application: application._id,
      message: `${user.name} applied for ${job.title}`,
    });

    res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications
// @access  Private
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('jobId')
      .populate('userId', 'name email phone resume')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applications for a job (employer only)
// @route   GET /api/applications/job/:jobId
// @access  Private
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check authorization
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email phone location resume profilePhoto linkedinUrl portfolioUrl userType')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (employer only)
// @route   PUT /api/applications/:id
// @access  Private
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    let application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check authorization
    if (application.jobId.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });

    // Notify applicant
    await createNotification({
      recipient: application.userId,
      sender: req.user.id,
      type: 'application_update',
      application: application._id,
      job: application.jobId,
      message: `Your application status updated to ${status}`,
    });

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check authorization
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to withdraw this application' });
    }

    await Application.findByIdAndDelete(req.params.id);

    // Update application count
    await Job.findByIdAndUpdate(application.jobId, { $inc: { applicationCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rate applicant (employer only)
// @route   PUT /api/applications/:id/rate
// @access  Private
exports.rateApplicant = async (req, res) => {
  try {
    const { rating, ratingComment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    let application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check authorization
    if (application.jobId.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to rate this applicant' });
    }

    application = await Application.findByIdAndUpdate(
      req.params.id,
      { rating, ratingComment },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
