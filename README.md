[InfiniTalk - Real-Time Chat Application
InfiniTalk is a full-stack, real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO. It provides a seamless and interactive chatting experience, supporting both one-on-one and group conversations with features like user authentication, real-time messaging, typing indicators, and a theme switcher.

Live Demo : https://infini-talk.vercel.app/

Features
User Authentication: Secure user registration and login using JSON Web Tokens (JWT).

Real-time Messaging: Instant one-on-one and group messaging powered by Socket.IO.

Group Chat Management:

Create new group chats.

Rename groups.

Add and remove members from groups (admin only).

User Search: Find and start conversations with registered users.

Notifications: Real-time notifications for new messages.

Typing Indicators: See when another user is typing in a chat.

Responsive UI: A clean and modern user interface that works on all screen sizes.

Light & Dark Mode: A theme switcher for a comfortable viewing experience.

Tech Stack
Frontend
React.js (with Vite): A fast and modern JavaScript library for building user interfaces.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

Context API: For state management across the application.

Material UI: For pre-built components like modals and tooltips.

Axios: For making API requests to the backend.

Backend
Node.js: A JavaScript runtime for the server.

Express.js: A web application framework for Node.js.

MongoDB: A NoSQL database for storing user and chat data.

Mongoose: An ODM library for MongoDB and Node.js.

Socket.IO: For enabling real-time, bidirectional communication.

JSON Web Token (JWT): For secure user authentication.

Getting Started
Follow these instructions to get a local copy of the project up and running.

Prerequisites
Node.js (v18 or later)

npm

MongoDB Atlas account or a local MongoDB instance

Installation & Setup
Clone the repository:

git clone [https://github.com/Saikiran-Sugurthi/InfiniTalk](https://github.com/Saikiran-Sugurthi/InfiniTalk.git)
cd InfiniTalk

Backend Setup:

Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file in the backend directory and add the following environment variables:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

Start the backend server:

npm start

The server will be running on http://localhost:3000.

Frontend Setup:

Open a new terminal and navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

The frontend will automatically connect to the backend running on localhost:3000.

Start the frontend development server:

npm run dev

The application will be accessible at http://localhost:5173.

Environment Variables
PORT: The port on which the backend server will run.

MONGO_URI: Your connection string for MongoDB.

JWT_SECRET: A secret key for signing JSON Web Tokens.

NODE_ENV: Set to production during deployment and development for local setup.

Project Structure
InfiniTalk/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── App.jsx
└── README.md

](https://infini-talk.vercel.app/)
