import React, { useState } from "react";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
export default function SignUp() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();
  const { loading, signup } = useSignup();
  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await signup(username, password);

    if (res) {
      navigate("/home");
    } else {
      toast.error("Signup failed. Please try again.");
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
      <form className="signup" onSubmit={handleSignup}>
        <h1>Sign Up</h1>
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
          {loading ? <div className="loader"></div> : "Sign Up"}
        </button>
      </form>
    </main>
  );
}
