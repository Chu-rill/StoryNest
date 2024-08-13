import React, { useState, useContext } from "react";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
export default function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const login = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      res.json().then((userInfo) => {
        setUserInfo(userInfo);
        alert("user logged in");
        navigate("/home");
      });
    }
    setPassword("");
    setUsername("");
  };
  return (
    <main>
      <Header />
      <form className="login" onSubmit={login}>
        <h1>Login</h1>
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
        <button>Login</button>
      </form>
    </main>
  );
}
