const User=require("../models/userModel");
const asynchandler=require("express-async-handler")
const generateToken=require("../config/generateToken")
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
            password:user.password,
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
               
                token:generateToken(user._id)
            })
        }
        else{
            res.status(400);
            throw Error("USER NOT FOUND !!!");
        }

})

module.exports={registerUser,authUser};