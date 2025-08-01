import { useState, useEffect } from "react";
import AppName from "../AppName";
import { useToast } from "../ToastContext";
import LoadingButton from '@mui/lab/LoadingButton';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (pic) {
      console.log("Cloudinary Image URL:", pic);
    }
  }, [pic]);

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password) {
      showToast("Please fill all the details!", "warning");
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      showToast("Passwords do not match!", "warning");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      const { data } = await axios.post(
         `${import.meta.env.VITE_API_URL}/api/user`,
        { name, email, password, pic },
        config
      );
      showToast("Registration Successful", "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (!pics) {
      showToast("Please select an image", "warning");
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
          setPic(data.url.toString());
          showToast("Image uploaded successfully", "success");
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          showToast("Image upload failed", "error");
          setLoading(false);
        });
    } else {
      showToast("Only JPEG or PNG allowed", "warning");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2b2d31] px-4">
      <AppName />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-[#23272a] text-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-5 mt-6"
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="p-2 bg-[#2c2f33] border border-[#4f545c] rounded focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 bg-[#2c2f33] border border-[#4f545c] rounded focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className="p-2 bg-[#2c2f33] border border-[#4f545c] rounded focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="p-2 bg-[#2c2f33] border border-[#4f545c] rounded focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
            className="text-sm text-gray-300 file:bg-[#5865f2] file:text-white file:rounded file:px-4 file:py-1 file:cursor-pointer"
          />
        </div>

        <LoadingButton
          loading={loading}
          onClick={submitHandler}
                      style={{
              backgroundColor: "#5865F2",
                          color: "#fff",}}

          className="w-full  text-white py-2 rounded mt-2 font-semibold"
        >
          Sign Up
        </LoadingButton>
      </form>
    </div>
  );
}
