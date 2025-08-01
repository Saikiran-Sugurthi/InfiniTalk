
const dotenv=require("dotenv");
dotenv.config();
const express=require("express");
// // console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);
// const path = require('path');


const cors = require("cors");

const chats=require("./data/data.js")
const userRoutes=require("./routes/userRoutes.js");
const connectToDB =require("./config/db.js");
const { errorHandler, notFound } = require("./middlewares/errorMiddleWare.js");
const chatRoutes=require("./routes/chatRoutes.js")
const PORT=process.env.PORT || 3000;
const messageRoutes=require("./routes/messageRoutes.js");
const { Socket } = require("socket.io");


connectToDB();
const app=express();

app.use(cors({
    origin:["http://localhost:3000","http://localhost:5173"],
     credentials: true
}));
app.use(express.json());

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);


// // -----------------------------------------Deployement

// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === 'production') {
//   // Correct path for Vite's build output
//   app.use(express.static(path.join(__dirname1, '/frontend/dist')));

//   app.get('*', (req, res) =>
//     // Correct path for Vite's index.html
//     res.sendFile(path.resolve(__dirname1, 'frontend', 'dist', 'index.html'))
//   );
// } else {
//   app.get('/', (req, res) => {
//     res.send('API is running...');
//   });
// }




// -----------------------------------------Deployement

// app.get("/",(req,res)=>{
// //     res.send("API IS RUNNING")
// })
// app.get("/api/chat",(req,res)=>{
//     res.send(chats)
// });

// app.get("/api/chat/:id",(req,res)=>{
    
//     const singleChat=chats.find((c)=>c._id==req.params.id);

//     res.send(singleChat);


// })


app.use(notFound);
app.use(errorHandler)

// console.log("PORT from .env:", process.env.PORT);

const server=app.listen(PORT,console.log("SERVER LISTENING ON PORT 3000"));

const io=require("socket.io")(server,{
    pingTimeOut:60000,
    cors:{
        origin:"http://localhost:5173"
    }
})


io.on("connection",(socket)=>{
    console.log("Connected to Socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User Joined Room"+room)
    })

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageRecieved)=>{
        var chat=newMessageRecieved.chat;

        if(!chat.users){
            console.log("chat.users Undefined");
        }

        
            chat.users.forEach((user)=>{
                if(user._id===newMessageRecieved.sender._id) return;

                socket.in(user._id).emit("message recieved",newMessageRecieved);
            })

    })

     socket.on("new group", (newGroupChat) => {
    if (!newGroupChat || !newGroupChat.users) {
      return console.log("Invalid group data received");
    }

    // The user who created the group is the groupAdmin
    const creatorId = newGroupChat.groupAdmin._id;

    newGroupChat.users.forEach((user) => {
      // Don't send the notification back to the creator
      if (user._id === creatorId) return;

      // Emit the event to the other members in their specific rooms
      socket.in(user._id).emit("group received", newGroupChat);
    });
  });
})
