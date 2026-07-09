const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a problem title'],
    trim: true,
    maxlength: 100
  },
  platform: {
    type: String,
    required: [true, 'Please select a platform'],
    enum: ['LeetCode', 'GeeksforGeeks', 'Codeforces', 'CodeChef', 'HackerRank', 'AtCoder', 'Other']
  },
  difficulty: {
    type: String,
    required: [true, 'Please select difficulty'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  topic: {
    type: String,
    required: [true, 'Please select a topic'],
    enum: [
      'Array', 'String', 'Linked List', 'Stack', 'Queue', 'Tree', 'Graph', 
      'Heap', 'Trie', 'DP', 'Greedy', 'Binary Search', 'Math', 
      'Bit Manipulation', 'Sliding Window', 'Backtracking', 'Recursion', 'Other'
    ]
  },
  status: {
    type: String,
    required: [true, 'Please select status'],
    enum: ['Solved', 'Attempted', 'Revisit'],
    default: 'Solved'
  },
  timeTaken: {
    type: Number, // in minutes
    min: 0,
    default: 0
  },
  dateSolved: {
    type: Date,
    default: Date.now,
    required: true
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
