require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Problem = require('./models/Problem');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Find the admin user
    let user = await User.findOne({ email: 'admin@gmail.com' });
    if (!user) {
      console.log('User not found. Creating admin@gmail.com with password 123456...');
      user = await User.create({
        username: 'admin',
        email: 'admin@gmail.com',
        password: '123456'
      });
    }

    const userId = user._id;

    // Dummy problems data between May 15, 2026 and June 1, 2026
    const problems = [
      {
        userId,
        title: 'Two Sum',
        platform: 'LeetCode',
        difficulty: 'Easy',
        topic: 'Array',
        status: 'Solved',
        timeTaken: 15,
        dateSolved: new Date('2026-05-15T10:00:00Z'),
        notes: 'Used a hash map for O(n) time complexity.'
      },
      {
        userId,
        title: 'Reverse Linked List',
        platform: 'LeetCode',
        difficulty: 'Easy',
        topic: 'Linked List',
        status: 'Solved',
        timeTaken: 10,
        dateSolved: new Date('2026-05-17T11:30:00Z'),
        notes: 'Iterative approach is straightforward. Need to remember pointer manipulation.'
      },
      {
        userId,
        title: 'Longest Substring Without Repeating Characters',
        platform: 'LeetCode',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        status: 'Solved',
        timeTaken: 25,
        dateSolved: new Date('2026-05-19T09:15:00Z'),
        notes: 'Classic sliding window. Used a set to keep track of characters.'
      },
      {
        userId,
        title: 'Merge Intervals',
        platform: 'GeeksforGeeks',
        difficulty: 'Medium',
        topic: 'Array',
        status: 'Solved',
        timeTaken: 30,
        dateSolved: new Date('2026-05-20T14:45:00Z'),
        notes: 'Sorted the array first based on start times.'
      },
      {
        userId,
        title: 'Maximum Subarray',
        platform: 'LeetCode',
        difficulty: 'Medium',
        topic: 'DP',
        status: 'Solved',
        timeTaken: 20,
        dateSolved: new Date('2026-05-22T16:20:00Z'),
        notes: 'Kadane\'s algorithm. O(n) time and O(1) space.'
      },
      {
        userId,
        title: 'Trapping Rain Water',
        platform: 'LeetCode',
        difficulty: 'Hard',
        topic: 'Array',
        status: 'Attempted',
        timeTaken: 45,
        dateSolved: new Date('2026-05-25T18:00:00Z'),
        notes: 'Tried the two-pointer approach but missed some edge cases.'
      },
      {
        userId,
        title: 'Watermelon',
        platform: 'Codeforces',
        difficulty: 'Easy',
        topic: 'Math',
        status: 'Solved',
        timeTaken: 5,
        dateSolved: new Date('2026-05-27T08:10:00Z'),
        notes: 'Just need to check if weight is even and greater than 2.'
      },
      {
        userId,
        title: 'Coin Change',
        platform: 'LeetCode',
        difficulty: 'Medium',
        topic: 'DP',
        status: 'Revisit',
        timeTaken: 40,
        dateSolved: new Date('2026-05-29T20:30:00Z'),
        notes: 'Bottom-up DP approach was tricky to figure out initially.'
      },
      {
        userId,
        title: 'Dijkstra Algorithm',
        platform: 'GeeksforGeeks',
        difficulty: 'Hard',
        topic: 'Graph',
        status: 'Solved',
        timeTaken: 60,
        dateSolved: new Date('2026-05-31T21:00:00Z'),
        notes: 'Implemented using a priority queue.'
      },
      {
        userId,
        title: 'Valid Parentheses',
        platform: 'HackerRank',
        difficulty: 'Easy',
        topic: 'Stack',
        status: 'Solved',
        timeTaken: 12,
        dateSolved: new Date('2026-06-01T10:00:00Z'),
        notes: 'Standard stack application. Remember to check if stack is empty at the end.'
      }
    ];

    // Clear existing problems for this user to avoid duplicates if run multiple times
    await Problem.deleteMany({ userId });
    
    // Insert new dummy problems
    await Problem.insertMany(problems);
    console.log('10 dummy problems inserted successfully with updated dates!');

    // Update user streak
    user.currentStreak = 0; // 0 because the latest problem was in June, today is July
    user.longestStreak = 5; 
    await user.save();
    
    console.log('User streak updated!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
