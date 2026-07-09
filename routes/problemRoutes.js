const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const problemController = require('../controllers/problemController');

// Protect all problem routes
router.use(ensureAuthenticated);

// @route   GET /problems
// @desc    Get all problems
router.get('/', problemController.getProblems);

// @route   GET /problems/add
// @desc    Show add problem form
router.get('/add', problemController.getAddProblem);

// @route   POST /problems
// @desc    Add a problem
router.post('/', problemController.postAddProblem);

// @route   GET /problems/:id
// @desc    Get problem details
router.get('/:id', problemController.getProblem);

// @route   GET /problems/:id/edit
// @desc    Show edit problem form
router.get('/:id/edit', problemController.getEditProblem);

// @route   PUT /problems/:id
// @desc    Update problem
router.put('/:id', problemController.updateProblem);

// @route   DELETE /problems/:id
// @desc    Delete problem
router.delete('/:id', problemController.deleteProblem);

module.exports = router;
