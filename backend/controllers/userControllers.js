const User=require("../models/userModel");
const asynchandler=require("express-async-handler")
const generateToken=require("../config/generateToken");
const { options } = require("../routes/userRoutes");
const registerUser=asynchandler(async(req,res)=>{

    const {name,email,password,pic}=req.body;
    console.log("REQ BODY", req.body);


    if(!name || !email || !password ){
        res.status(400);
        throw new Error("Fill All The Fields");

    }

    const userExists=await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("USER ALRAEDY EXISTS !!!");
    }

    const user=await User.create({
        name,
        email,
        password,
        pic
    });

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
             pic: user.pic,
           
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400);
        throw new Error("Failed to Create User !!!");
    }

})




const authUser=asynchandler(async(req,res)=>{

        const{email,password}=req.body;
        console.log("Login Input →", email, password);
        const user=await User.findOne({email});

        if(user && (await user.matchPassword(password))){
            res.status(200).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                 pic: user.pic,
                token:generateToken(user._id)
            })
        }
        else{
            res.status(400);
            throw Error("USER NOT FOUND !!!");
        }

})


const allUsers=asynchandler(async(req,res)=>{

        // const keyword=req.query.search;

        // console.log(keyword);


    const keyword=req.query.search?{
        $or:[{name:{$regex:req.query.search,$options:"i"}},{email:{$regex:req.query.search,$options:"i"}}          
        ]
    }:{}

    const users=await User.find(keyword).find({_id:{$ne:req.user._id}});

    res.send(users);


})



module.exports={registerUser,authUser,allUsers};