const express = require('express');
const {
  submitApplication,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  rateApplicant,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('job_seeker'), submitApplication);
router.get('/', protect, authorize('job_seeker'), getUserApplications);
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id', protect, authorize('employer'), updateApplicationStatus);
router.put('/:id/rate', protect, authorize('employer'), rateApplicant);
router.delete('/:id', protect, withdrawApplication);

module.exports = router;
