import { useState } from "react";
import AppName from "../AppName";
import LoadingButton from "@mui/lab/LoadingButton";
import { useToast } from "../ToastContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      showToast("Fill All The Details !!!", "error");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:3000/api/user/login",
        { email, password },
        config
      );

      showToast("Login Successful !!!", "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (err) {
      console.log("ERROR RESPONSE", err.response?.data);
      showToast(err.response?.data?.message || "ERROR !!!", "error");
    } finally {
      setLoading(false);
    }
  };

  const guestHandler = async () => {
    setLoading(true);
    const guestemail = "guest@gmail.com";
    const guestpassword = "guest@123";

    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:3000/api/user/login",
        { email: guestemail, password: guestpassword },
        config
      );

      showToast("Guest Login Successful !!!", "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (err) {
      console.log("ERROR RESPONSE", err.response?.data);
      showToast(err.response?.data?.message || "ERROR !!!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#2b2d31" }}
    >
      <AppName />

      <form
        className="w-full max-w-md mt-6 p-6 rounded-xl shadow-lg space-y-6"
        style={{ backgroundColor: "#313338" }}
      >
        {/* Email Input */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="loginEmail"
            className="text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="loginEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="p-2 rounded-md bg-[#1e1f22] text-gray-200 placeholder-gray-500 border border-[#4e5058] focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="loginPasswd"
            className="text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            id="loginPasswd"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="p-2 rounded-md bg-[#1e1f22] text-gray-200 placeholder-gray-500 border border-[#4e5058] focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
          />
        </div>

        {/* Buttons */}
        <div className="space-y-3  pt-2">
          <LoadingButton
            type="button"
            loading={loading}
            onClick={submitHandler}
            className="w-full rounded-md p-2 font-semibold transition duration-150"
            style={{
              backgroundColor: "#5865F2",
              color: "#fff",
              marginBottom:"6px"
            }}
          >
            Log In
          </LoadingButton>

          <LoadingButton
            type="button"
            loading={loading}
            onClick={guestHandler}
            className="w-full rounded-md p-2 font-semibold transition duration-150"
            style={{
              backgroundColor: "#4E5D94",
              color: "#fff",
        
            }}
          >
            Log In as Guest
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
