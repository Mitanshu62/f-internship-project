const Problem = require('../models/Problem');
const User = require('../models/User');

exports.getLandingPage = (req, res) => {
  res.render('pages/landing', { title: 'CodeTrack - Daily Coding Tracker' });
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    
    // Today's date logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalProblems = await Problem.countDocuments({ userId });
    const easyCount = await Problem.countDocuments({ userId, difficulty: 'Easy' });
    const mediumCount = await Problem.countDocuments({ userId, difficulty: 'Medium' });
    const hardCount = await Problem.countDocuments({ userId, difficulty: 'Hard' });

    const recentProblems = await Problem.find({ userId })
      .sort({ dateSolved: -1 })
      .limit(5);

    // Goal Logic
    const todaySolvedCount = await Problem.countDocuments({
      userId,
      status: 'Solved',
      dateSolved: { $gte: today, $lt: tomorrow }
    });

    const progressPercentage = Math.min(Math.round((todaySolvedCount / user.dailyGoal) * 100), 100);
    const goalCompleted = todaySolvedCount >= user.dailyGoal;

    // Save yesterday's GoalHistory (Lazy Evaluation)
    const GoalHistory = require('../models/GoalHistory');
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];
    
    const existingHistory = await GoalHistory.findOne({ userId, date: dateStr });
    if (!existingHistory) {
      const yesterdaySolved = await Problem.countDocuments({
        userId,
        status: 'Solved',
        dateSolved: { $gte: yesterday, $lt: today }
      });
      
      await GoalHistory.create({
        userId,
        date: dateStr,
        goal: user.dailyGoal,
        solved: yesterdaySolved,
        completed: yesterdaySolved >= user.dailyGoal
      });
      
      if (yesterdaySolved >= user.dailyGoal) {
        user.totalGoalsAchieved += 1;
        await user.save();
      }
    }

    res.render('pages/dashboard', {
      title: 'Dashboard - CodeTrack',
      user,
      totalProblems,
      easyCount,
      mediumCount,
      hardCount,
      recentProblems,
      todayDate: today.toDateString(),
      todaySolvedCount,
      progressPercentage,
      goalCompleted
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    const totalProblems = await Problem.countDocuments({ userId: user._id });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaySolvedCount = await Problem.countDocuments({
      userId: user._id,
      status: 'Solved',
      dateSolved: { $gte: today, $lt: tomorrow }
    });
    
    const progressPercentage = Math.min(Math.round((todaySolvedCount / user.dailyGoal) * 100), 100);

    res.render('pages/profile', {
      title: 'Profile - CodeTrack',
      user,
      totalProblems,
      todaySolvedCount,
      progressPercentage
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading profile');
    res.redirect('/dashboard');
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    const problems = await Problem.find({ userId });
    
    const totalProblems = problems.length;
    let easy = 0, medium = 0, hard = 0;
    let attempted = 0, solvedThisMonth = 0;
    let totalTime = 0;
    
    const platformDist = {};
    const topicDist = {};

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    problems.forEach(p => {
      if (p.difficulty === 'Easy') easy++;
      if (p.difficulty === 'Medium') medium++;
      if (p.difficulty === 'Hard') hard++;
      
      if (p.status === 'Attempted') attempted++;
      
      const d = new Date(p.dateSolved);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        solvedThisMonth++;
      }
      
      totalTime += p.timeTaken || 0;
      
      platformDist[p.platform] = (platformDist[p.platform] || 0) + 1;
      topicDist[p.topic] = (topicDist[p.topic] || 0) + 1;
    });

    const averageTime = totalProblems > 0 ? Math.round(totalTime / totalProblems) : 0;
    
    res.render('pages/statistics', {
      title: 'Statistics - CodeTrack',
      user,
      stats: {
        totalProblems, easy, medium, hard,
        attempted, solvedThisMonth, averageTime,
        platformDist, topicDist
      }
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading statistics');
    res.redirect('/dashboard');
  }
};
