import React, { useState } from "react";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const signup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      alert("user registerd");
      navigate("/home");
    }
    setPassword("");
    setUsername("");
  };
  return (
    <main>
      <Header />
      <form className="signup" onSubmit={signup}>
        <h1>Sign Up</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Sign Up</button>
      </form>
    </main>
  );
}
