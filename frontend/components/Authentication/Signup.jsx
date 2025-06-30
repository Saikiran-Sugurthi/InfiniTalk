import { useState } from "react";
import AppName from "../AppName";
import { useToast } from "../ToastContext"
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";



export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
   const { showToast } = useToast();
   const [loading,setLoading]=useState(false)

   const navigate = useNavigate();

useEffect(() => {
  if (pic) {
    console.log("Cloudinary Image URL:", pic);
  }
}, [pic]);

  const submitHandler=async()=>{
    setLoading(true);
    if(!name || !email || !password ){
      showToast("Please Fill All The Details !!!","warning");
      setLoading(false);
      return;
    }

    if(password!=confirmpassword){
      showToast("Passowrds Doesnot Match !!!","warning");
      setLoading(false);
      return;
    }

    try{
      const config={
        headers:{
          "Content-type":"application/json"
        },
      }
      console.log("Submitting:", { name, email, password, pic });
      const {data}=  await axios.post("http://localhost:3000/api/user",{name,email,password,pic},config);
      showToast("Registration Successfull","success");

      localStorage.setItem("userInfo",JSON.stringify(data));
      navigate("/chats");
    }
    catch(err){
       console.log("ERROR RESPONSE", err.response?.data);
  showToast(err.response?.data?.message || "Error Occured !!!", "error");
  setLoading(false);
    }
     finally {
    setLoading(false);
  }





  }

  const postDetails=(pics)=>{
    setLoading(true);
    if(pics==undefined){
      showToast("Please Select an Image","warning");
       setLoading(false); 
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "InfiniTalk");
    data.append("cloud_name", "dlm4qnn7s"); 

    fetch("https://api.cloudinary.com/v1_1/dlm4qnn7s/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        
       console.log("Full Cloudinary Response:", data);
  setPic(data.url.toString());
  showToast("Image uploaded successfully", "success");
  setLoading(false); 
      })
      .catch((err) => {
        console.error(err);
        showToast("Upload failed", "error");
        setLoading(false); 
      });
  } else {
    showToast("Please Select a JPEG or PNG image", "warning");
    setLoading(false);
    return;
  }

  }

  return (
   <div className="min-h-screen flex flex-col items-center justify-center ">
   <AppName/>
    
      <form className="p-6 rounded w-full max-w-md space-y-4 mt-4 shadow-md  text-black" style={{ backgroundColor: "#e6ecff" }}>
        <div className="flex flex-col">
          <label htmlFor="signupName" className="text-black font-medium mb-2">Name</label>
          <input
            id="signupName"
            type="text"
            placeholder="Enter your name"
            className="p-2 rounded text-black border border-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="signupEmail" className="text-black font-medium mb-2">Email</label>
          <input
            id="signupEmail"
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded text-black border border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="signupPassword" className="text-black font-medium mb-2">Password</label>
          <input
            id="signupPassword"
            type="password"
            placeholder="Create a password"
            className="p-2 rounded text-black border border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="signupConfirmPassword" className="text-black font-medium mb-2">Confirm Password</label>
          <input
            id="signupConfirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="p-2 rounded text-black border border-black"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="signupPic" className="text-black font-medium mb-2  ">Profile Picture</label>
          <input
            id="signupPic"
            type="file"
           p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
          />
        </div>

           <LoadingButton
           loading={loading}
           onClick={submitHandler}
          type="submit" style={{backgroundColor:"#ff5930",color:"#fff"}}
          className="w-full mt-4  hover:bg-blue-600 p-2 rounded text-white font-semibold "
        >
          Sign Up
      </LoadingButton>
      </form>
    </div>
    
  );
}
