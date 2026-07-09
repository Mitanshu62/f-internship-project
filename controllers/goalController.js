const User = require('../models/User');

exports.getGoalSettings = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.render('pages/goal', { 
      title: 'Daily Goal - CodeTrack', 
      user 
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading goal settings');
    res.redirect('/dashboard');
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { dailyGoal } = req.body;
    
    // Validate goal
    const goalValue = parseInt(dailyGoal, 10);
    if (isNaN(goalValue) || goalValue < 1 || goalValue > 50) {
      req.flash('error', 'Goal must be between 1 and 50');
      return res.redirect('/goal');
    }

    const user = await User.findById(req.session.user.id);
    user.dailyGoal = goalValue;
    await user.save();

    req.flash('success', 'Daily goal updated successfully!');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error updating daily goal');
    res.redirect('/goal');
  }
};
