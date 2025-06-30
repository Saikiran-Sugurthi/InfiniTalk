const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();

const connectToDB=async()=>{


try{
    const conn=await mongoose.connect(process.env.MONGO_URI);
    console.log(` Successfully Connected to DB : ${conn.connection.host}`);
}
catch(err){
    console.log(`ERROR : ${err.message}`);
    process.exit();
}
}

module.exports=connectToDB;