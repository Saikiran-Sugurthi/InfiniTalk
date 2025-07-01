
const dotenv=require("dotenv");
dotenv.config();
const express=require("express");
// console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);


const cors = require("cors");

const chats=require("./data/data.js")
const userRoutes=require("./routes/userRoutes.js");
const connectToDB =require("./config/db.js");
const { errorHandler, notFound } = require("./middlewares/errorMiddleWare.js");
const chatRoutes=require("./routes/chatRoutes.js")
const PORT=process.env.PORT || 3000;

connectToDB();
const app=express();

app.use(cors({
    origin:["http://localhost:3000","http://localhost:5173"],
     credentials: true
}));
app.use(express.json());

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);


app.get("/",(req,res)=>{
    res.send("API IS RUNNING")
})
app.get("/api/chat",(req,res)=>{
    res.send(chats)
});

app.get("/api/chat/:id",(req,res)=>{
    
    const singleChat=chats.find((c)=>c._id==req.params.id);

    res.send(singleChat);


})


app.use(notFound);
app.use(errorHandler)

// console.log("PORT from .env:", process.env.PORT);

app.listen(PORT,console.log("SERVER LISTENING ON PORT 3000"));
