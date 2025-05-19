import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CreatePost from "./pages/CreatePost";
import { UserContextProvider } from "./context/UserContext";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
      <Toaster />
    </UserContextProvider>
  );
}

export default App;
