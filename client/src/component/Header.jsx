import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const logout = () => {
    fetch("http://localhost:3001/auth/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  };
  useEffect(() => {
    fetch("http://localhost:3001/auth/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  const username = userInfo?.username;
  return (
    <main>
      <header>
        <Link to="/home" className="logo">
          Nspire
        </Link>

        <nav>
          {username && (
            <>
              <Link to="/create">Create Post</Link>
              <a href="" onClick={logout}>
                Logout
              </a>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Login</Link>

              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </header>
    </main>
  );
}
