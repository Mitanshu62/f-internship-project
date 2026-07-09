const Problem = require('../models/Problem');
const User = require('../models/User');

const updateStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    const problems = await Problem.find({ userId }).sort({ dateSolved: -1 });

    if (problems.length === 0) return;

    let currentStreak = 0;
    let longestStreak = user.longestStreak || 0;
    
    // Create a set of unique dates (YYYY-MM-DD)
    const solvedDates = new Set();
    problems.forEach(p => {
      const d = new Date(p.dateSolved);
      const dateString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      solvedDates.add(dateString);
    });

    const datesArray = Array.from(solvedDates).sort((a, b) => new Date(b) - new Date(a));
    
    if (datesArray.length > 0) {
      currentStreak = 1;
      let checkDate = new Date(datesArray[0]);
      
      for (let i = 1; i < datesArray.length; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const expectedDateString = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
        if (datesArray[i] === expectedDateString) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    
    // Check if the latest solved date is today or yesterday, otherwise current streak is 0
    if (datesArray.length > 0) {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
      
      if (datesArray[0] !== todayStr && datesArray[0] !== yesterdayStr) {
        currentStreak = 0;
      }
    }

    user.currentStreak = currentStreak;
    user.longestStreak = longestStreak;
    await user.save();
  } catch (err) {
    console.error('Error updating streak:', err);
  }
};

exports.getProblems = async (req, res) => {
  try {
    const { platform, difficulty, status, search, topic, sort } = req.query;
    let query = { userId: req.session.user.id };

    if (platform) query.platform = platform;
    if (difficulty) query.difficulty = difficulty;
    if (status) query.status = status;
    if (topic) query.topic = topic;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    let sortOption = { dateSolved: -1 };
    if (sort === 'oldest') sortOption = { dateSolved: 1 };
    if (sort === 'easy_first') sortOption = { difficulty: 1 };
    if (sort === 'hard_first') sortOption = { difficulty: -1 };
    if (sort === 'time_taken') sortOption = { timeTaken: -1 };

    const problems = await Problem.find(query).sort(sortOption);
    
    res.render('pages/problems/index', { 
      title: 'My Problems - CodeTrack',
      problems,
      query: req.query
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error fetching problems');
    res.redirect('/dashboard');
  }
};

exports.getAddProblem = (req, res) => {
  res.render('pages/problems/add', { title: 'Add Problem - CodeTrack', problem: null });
};

exports.postAddProblem = async (req, res) => {
  try {
    req.body.userId = req.session.user.id;
    if (!req.body.dateSolved) req.body.dateSolved = Date.now();
    await Problem.create(req.body);
    await updateStreak(req.session.user.id);
    req.flash('success', 'Problem added successfully');
    res.redirect('/problems');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error adding problem');
    res.redirect('/problems/add');
  }
};

exports.getProblem = async (req, res) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.id, userId: req.session.user.id });
    if (!problem) {
      req.flash('error', 'Problem not found');
      return res.redirect('/problems');
    }
    res.render('pages/problems/show', { title: problem.title + ' - CodeTrack', problem });
  } catch (error) {
    console.error(error);
    res.redirect('/problems');
  }
};

exports.getEditProblem = async (req, res) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.id, userId: req.session.user.id });
    if (!problem) {
      req.flash('error', 'Problem not found');
      return res.redirect('/problems');
    }
    res.render('pages/problems/edit', { title: 'Edit Problem - CodeTrack', problem });
  } catch (error) {
    console.error(error);
    res.redirect('/problems');
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!problem) {
      req.flash('error', 'Problem not found');
      return res.redirect('/problems');
    }
    await updateStreak(req.session.user.id);
    req.flash('success', 'Problem updated successfully');
    res.redirect(`/problems/${problem._id}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error updating problem');
    res.redirect(`/problems/${req.params.id}/edit`);
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({ _id: req.params.id, userId: req.session.user.id });
    if (!problem) {
      req.flash('error', 'Problem not found');
      return res.redirect('/problems');
    }
    await updateStreak(req.session.user.id);
    req.flash('success', 'Problem deleted successfully');
    res.redirect('/problems');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error deleting problem');
    res.redirect('/problems');
  }
};
