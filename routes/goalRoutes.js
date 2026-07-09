const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const goalController = require('../controllers/goalController');

router.use(ensureAuthenticated);

// @route   GET /goal
// @desc    Show goal settings page
router.get('/', goalController.getGoalSettings);

// @route   POST /goal
// @desc    Update daily goal
router.post('/', goalController.updateGoal);

module.exports = router;
