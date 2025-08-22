const express = require('express');
const router = express.Router();
const User = require('../models/users'); // Make sure the path to your user model is correct
const authenticateToken = require('../middleware/authenticateToken');

// @route   GET /api/users/me
// @desc    Get profile for the currently logged-in user
// @access  Private (Requires a valid token)
router.get('/me', authenticateToken, async (req, res) => {
    try {
        // req.user.userId is added by the authenticateToken middleware
        const user = await User.findById(req.user.userId).select('-password'); // .select('-password') removes the password from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Get User Error:", error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;