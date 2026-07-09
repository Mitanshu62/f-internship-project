# CodeTrack - Daily Coding Tracker

CodeTrack is a full-stack web application designed to help developers track their daily coding problems, set goals, monitor their streaks, and maintain consistency in their learning journey.

## Features
- **User Authentication**: Secure signup and login functionality using bcrypt and express-session.
- **Problem Tracking**: Add, edit, and delete coding problems you've solved or attempted.
- **Daily Goals**: Set a personal daily goal for solved problems and track your progress automatically.
- **Dashboard & Statistics**: View your current/longest streaks, problem difficulties, platforms, and topics.
- **Search & Filters**: Easily find past problems by title, platform, difficulty, or status.
- **Production Ready**: Configured with Helmet, Compression, and secure cookies for safe deployment.

## Tech Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript, EJS Template Engine
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Express Session, connect-mongo, bcrypt
- **Security & Performance**: Helmet, Compression, Morgan

## Folder Structure
```text
├── config/           # Database configuration
├── controllers/      # Route controllers (Auth, Problem, Goal, Page)
├── middlewares/      # Custom middlewares (Auth protection, Error handling)
├── models/           # Mongoose schemas (User, Problem, GoalHistory)
├── public/           # Static assets (CSS, JS, Images)
├── routes/           # Express routes
├── views/            # EJS templates (Pages and Partials)
├── .env.example      # Environment variable template
├── app.js            # Main application entry point
├── render.yaml       # Infrastructure-as-code for Render deployment
└── package.json      # Dependencies and scripts
```

## Environment Variables
To run this project, you will need to add the following environment variables to your `.env` file. You can use `.env.example` as a template.

`PORT` - The port your server runs on (e.g., 3000)
`MONGODB_URI` - Your MongoDB connection string
`SESSION_SECRET` - A strong random string for encrypting session cookies
`NODE_ENV` - Set to `development` locally and `production` on deployment

## MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new Cluster.
3. Under **Database Access**, create a user with a secure password.
4. Under **Network Access**, add `0.0.0.0/0` to allow access from anywhere (required for Render deployment).
5. Click **Connect**, choose **Connect your application**, and copy the connection string.
6. Replace `<password>` with your database user's password and paste it into `MONGODB_URI` in your `.env` file.

## How to Run Locally
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your `MONGODB_URI` and `SESSION_SECRET`.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

## How to Deploy on Render
CodeTrack is pre-configured for automated deployment on Render using the included `render.yaml` file.

1. Push your CodeTrack project to a GitHub repository.
2. Sign up / Log in to [Render](https://render.com).
3. Go to the **Dashboard** and click **New** > **Blueprint**.
4. Connect your GitHub account and select your CodeTrack repository.
5. Render will automatically detect the `render.yaml` file and prompt you to configure the environment variables:
   - Provide your **MongoDB Atlas connection string** for `MONGODB_URI`.
   - Render will automatically generate a secure `SESSION_SECRET` and set `NODE_ENV=production`.
6. Click **Apply**.
7. Render will build and deploy your application automatically. Once complete, your live URL will be provided in the Render dashboard!
