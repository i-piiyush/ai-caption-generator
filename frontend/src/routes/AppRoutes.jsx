import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useAuth } from "../context/AuthProvider";
import Profile from "../components/Profile";
import ViewPost from "../components/ViewPost";
import CreatePost from "../components/CreatePost";

const AppRoutes = () => {
  const { user } = useAuth();
  const [loggedIn,setLoggedIn] = useState(false)

  useEffect(()=>{
    if(user){
      loggedIn(true)
    }
    else{false}
  },[user])
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/post/:id" element={<ViewPost />}/>
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
