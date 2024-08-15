import React, { useState, useContext } from "react";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import useLogin from "../hooks/useLogin";
import { toast } from "react-hot-toast";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

export default function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const { loading, login } = useLogin();
  const handleLogin = async (e) => {
    e.preventDefault();
    const userInfo = await login(username, password);
    if (userInfo) {
      setUserInfo(userInfo);
      navigate("/home");
    } else {
      toast.error("Login failed");
      setPassword("");
      setUsername("");
    }
  };
  const toggleShow = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <main>
      <Header />
      <form className="login" onSubmit={handleLogin}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="passwrap">
          <input
            type={showPassword ? "password" : "text"}
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <FaRegEyeSlash className="togglepass" onClick={toggleShow} />
          ) : (
            <FaRegEye className="togglepass" onClick={toggleShow} />
          )}
        </div>
        <button disabled={loading}>
          {loading ? <div className="loader"></div> : "Login"}
        </button>
      </form>
    </main>
  );
}
