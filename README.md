

````markdown
# 💬 InfiniTalk - Real-Time Chat Application

**InfiniTalk** is a full-stack, real-time chat application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and **Socket.IO**.  
It provides a seamless and interactive chatting experience, supporting both one-on-one and group conversations — with features like user authentication, real-time messaging, typing indicators, and a theme switcher.

---

## 🚀 Live Demo: [https://infini-talk.vercel.app](https://infini-talk.vercel.app)  

---

## ✨ Features

- 🔐 **User Authentication:** Secure registration and login using JWT.  
- 💬 **Real-time Messaging:** Instant one-on-one and group chats powered by Socket.IO.  
- 👥 **Group Chat Management:**  
  - Create and rename groups.  
  - Add or remove members (admin only).  
- 🔎 **User Search:** Easily find and start conversations with registered users.  
- 🔔 **Notifications:** Real-time alerts for new messages.  
- ⌨️ **Typing Indicators:** See when others are typing in a chat.  
- 📱 **Responsive UI:** Clean and modern design optimized for all devices.  
- 🌗 **Light & Dark Mode:** Switch themes for a better user experience.

---

## 🧠 Tech Stack

### Frontend
- ⚛️ React.js (with Vite)
- 🎨 Tailwind CSS
- 🧩 Context API (state management)
- 🧱 Material UI
- 🌐 Axios (API requests)

### Backend
- 🟢 Node.js
- 🚏 Express.js
- 🍃 MongoDB + Mongoose
- 🔌 Socket.IO (real-time communication)
- 🔑 JSON Web Token (JWT)

---

## ⚙️ Getting Started

Follow these instructions to set up the project locally.

### ✅ Prerequisites
- Node.js (v18 or later)  
- npm  
- MongoDB Atlas account **or** local MongoDB instance  

---

## 🧩 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Saikiran-Sugurthi/InfiniTalk.git
cd InfiniTalk
````

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the **backend** directory and add:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the backend server:

```bash
npm start
```

➡️ Backend runs on [http://localhost:3000](http://localhost:3000)

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

➡️ Frontend runs on [http://localhost:5173](http://localhost:5173)

---

## 🌍 Environment Variables

| Variable     | Description                       |
| ------------ | --------------------------------- |
| `PORT`       | Backend server port               |
| `MONGO_URI`  | MongoDB connection string         |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `NODE_ENV`   | `development` or `production`     |

---

## 📁 Project Structure

```
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
```

---

## 📬 Contact

**👨‍💻 Sai Kiran Sugurthi**

* 🔗 **GitHub:** [https://github.com/Saikiran-Sugurthi](https://github.com/Saikiran-Sugurthi)
* 💼 **LinkedIn:** [https://www.linkedin.com/in/saikiran-sugurthi](https://www.linkedin.com/in/saikiran-sugurthi)

---

⭐ If you like this project, don’t forget to **star** the repo!

```

