const asyncHandler=require("express-async-handler");
const User=require("../models/userModel");
const Chat=require("../models/chatModel")

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});


const fetchChats=asyncHandler(async(req,res)=>{
    
    try{
        Chat.find({users:{$elemMatch : {$eq:req.user._id}}})
        .populate("users","-password")
        .populate("latestMessage")
        .populate("groupAdmin","-password")
        .sort({updatedAt:-1})
        .then(async (results)=>{
            results= await User.populate(results,{
                path:"latestMessage.sender",
                select:"name email pic"
            });

            res.status(200).send(results)

        })
    }
    catch(err){

    }

});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill All The Fields" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    // FIX: Change status code to 400 for a validation error
    return res.status(400).send({ message: "More than 2 users are required to form a group chat" });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const renameGroup=asyncHandler(async(req,res)=>{

    const {chatId,chatName}=req.body;

    const updatedChat=await Chat.findByIdAndUpdate(
      chatId,{
        chatName,
      },{
        new:true,
      }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")


    if(!updatedChat){
      res.status(404);
      throw new Error("Can Find the Group");
    }else{
      res.json(updatedChat);
    }

});

const addToGroup=asyncHandler(async(req,res)=>{

  const {chatId,userId}=req.body;

  const updatedGroup=await Chat.findByIdAndUpdate(
    chatId,{
      $push:{users:userId}
    },{
      new:true
    }
  )

  if(!updatedGroup){
    res.status(404);
    throw new Error("Chat Not Found !!!")
  }else{
    res.json(updatedGroup);
  }

});


const removeFromGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;

    const removedGroup=await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull:{users:userId}
      },
      {
        new:true
      }
    )


    if(!removedGroup){
      res.status(404);
      throw new Error("Chat Not Found!!!");
    }
    else{
      res.json(removedGroup)
    }
})


module.exports={accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup}