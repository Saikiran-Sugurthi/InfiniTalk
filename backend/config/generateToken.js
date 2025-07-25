const jwt=require("jsonwebtoken");

const generateToken=(id)=>{
    // console.log("JWT_SECRET:", process.env.JWT_SECRET); //  Just for testing

    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"30d"
    });
};

module.exports=generateToken;