import { useState } from "react";
import AppName from "../AppName";
import LoadingButton from '@mui/lab/LoadingButton';
import { useToast } from "../ToastContext"
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Login() {

  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const { showToast } = useToast();

  const submitHandler=async()=>{
    setLoading(true);
    if(!email || !password){
        showToast("Fill All The Details !!!","error");
        setLoading(false);
        return;
    }

    try{
      const config={
        headers:{
          "content-type":"application/json"
        },
      }

      const {data}=await axios.post("http://localhost:3000/api/user/login",{email,password},config);

      setLoading(false)
      showToast("Login Successfull !!!","success");
      
      localStorage.setItem("userInfo",JSON.stringify(data));

      navigate("/chats");


    }
    catch(err){
       console.log("ERROR RESPONSE", err.response?.data);
      showToast(err.response?.data?.message || "ERROR !!!","error");
      setLoading(false);


    }finally{
      setLoading(false)
    }







  }

  const guestHandler=async()=>{
    setLoading(true);
    const guestemail="guest@gmail.com"
    const guestpassword="guest@123"

    try{
      const config={
        headers:{
          "content-type":"application/json"
        },

      }

      const {data}=await axios.post("http://localhost:3000/api/user/login",{email:guestemail,password:guestpassword},config);
      setLoading(false);
      showToast("GUEST LOGIN SUCCESSFULL !!!","success");

      localStorage.setItem("userInfo",JSON.stringify(data));
      navigate("/chats")

     

    }
    catch(err){
      console.log("ERROR RESPONSE", err.response?.data);
      showToast(err.response?.data?.message || "ERROR !!!","error");
      setLoading(false);
    }
    finally{
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center " style={{ backgroundImage: "url('/grid.png')" }}>
      <AppName />

      <form className="rounded p-6 w-full max-w-md space-y-4 mt-4 shadow-md" style={{ backgroundColor: "#e6ecff" }}>
        <div className="flex flex-col">
          <label htmlFor="loginEmail" className="text-black font-medium mb-1">Email:</label>
          <input
            id="loginEmail"
            type="email"
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
            placeholder="Enter your email"
            className="p-2 rounded text-black border border-black"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="loginPasswd" className="text-black font-medium mb-1">Password:</label>
          <input
            id="loginPasswd"
            type="password"
            onChange={(e)=>{
              setPassword(e.target.value)
            }}
            placeholder="Enter your password"
            className="p-2 rounded text-black border border-black"
          />
        </div>
      <div className="space-y-4">
        <LoadingButton
          type="submit"
          loading={loading}
          onClick={submitHandler}
          className="w-full mt-4 mb-4 rounded p-2 text-white font-semibold hover:bg-orange-600"
          style={{ backgroundColor: "#ff5930",color:"#fff" }}
        >
          Log In
        </LoadingButton>
        </div>
        <div>

        
         <LoadingButton
          type="submit"
           loading={loading}
          onClick={guestHandler}
           
          className="w-full  rounded p-2 text-white font-semibold hover:bg-orange-600"
          style={{ backgroundColor: "#673AB7 ",color:"#fff" }}
        >
          Log In As Guest User
        </LoadingButton>
        </div>
      </form>
    </div>
  );
}
