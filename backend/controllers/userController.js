const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Get public profile of a user (for employers or self)
// @route   GET /api/users/:id
// @access  Private
exports.getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    // Allow access if employer or same user
    const isEmployer = req.user.userType === 'employer';
    const isSelf = req.user.id === id;

    if (!isEmployer && !isSelf) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this profile' });
    }

    const user = await User.findById(id).select('-password').populate('following', 'name companyName');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Follow a company
// @route   POST /api/users/:id/follow
// @access  Private
exports.followCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Only job seekers can follow
    if (req.user.userType !== 'job_seeker') {
      return res.status(403).json({ success: false, message: 'Only job seekers can follow companies' });
    }

    // Check if company exists
    const company = await User.findById(id);
    if (!company || company.userType !== 'employer') {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Check if already following
    const user = await User.findById(req.user.id);
    if (user.following.includes(id)) {
      return res.status(400).json({ success: false, message: 'Already following this company' });
    }

    // Add to following
    user.following.push(id);
    await user.save();

    // Create notification for the company
    await createNotification({
      recipient: id,
      sender: req.user.id,
      type: 'company_followed',
      message: `${user.name} started following your company`,
    });

    res.status(200).json({ success: true, message: 'Company followed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unfollow a company
// @route   POST /api/users/:id/unfollow
// @access  Private
exports.unfollowCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user.id);
    if (!user.following.includes(id)) {
      return res.status(400).json({ success: false, message: 'Not following this company' });
    }

    // Remove from following
    user.following = user.following.filter((companyId) => companyId.toString() !== id);
    await user.save();

    res.status(200).json({ success: true, message: 'Company unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
