import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
const Profile = () => {
  const { user, logout } = useAuth();
  const posts = user.post;
  const navigate = useNavigate();
  const goToPost = (id) => {
    navigate(`/post/${id}`);
  };
  const createPost = () => {
    navigate("/create-post");
  };
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className=" w-full h-screen md:hidden tracking-tighter relative">
        <div className="bg-white px-8 py-4">
          <h1 className="text-2xl font-bold">@{user.user.username}</h1>
        </div>
        <div className="px-8 py-4 bg-white flex flex-col gap-3 justify-center items-center">
          <span className="bg-zinc-400 h-40 w-40 rounded-full overflow-hidden ">
            <img
              src={user.user.pfp}
              alt="pfp"
              className="h-full w-full  object-cover"
            />
          </span>
          <h1 className="text-3xl font-bold ">{user.user.fullname}</h1>
          <p className="  w-[70%] text-center text-sm leading-[1] opacity-70">
            {user.user.bio}
          </p>
          <a
            href=""
            className="bg-black text-white px-16 py-2 text-sm font-semibold rounded-md mt-5 "
          >
            {" "}
            star my github{" "}
          </a>
        </div>

        <div className=" w-full px-8 py-4 flex justify-center gap-4 flex-wrap">
          {posts.map((post, index) => (
            <div key={index} className="h-64 w-56 bg-zinc-500 overflow-hidden">
              <img
                src={post.post}
                alt="post"
                className="h-full w-full object-cover "
                onClick={() => {
                  goToPost(post._id);
                }}
              />
            </div>
          ))}
        </div>

        <span
          className=" rounded bg-black fixed bottom-5 left-1/2 -translate-x-1/2 text-white flex justify-between items-center cursor-pointer px-10 gap-4 py-3 "
          onClick={createPost}
        >
          <GoPlus size={"1.6rem"} /> create post
        </span>
        <span
          className=" rounded bg-black fixed top-5 right-5 text-white flex justify-between items-center cursor-pointer px-10 gap-4 py-3 "
          onClick={handleLogout}
        >
          logout
        </span>
      </div>

      <div className="hidden md:flex justify-center items-center text-3xl w-full h-screen ">
        <h1>this website is only available for mobile</h1>
      </div>
    </>
  );
};

export default Profile;
