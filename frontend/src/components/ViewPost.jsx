import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";

const ViewPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const posts = user.post;

  useEffect(() => {
    const findPost = (id) => {
      return posts.find((post) => {
        return post._id === id;
      });
    };

    const foundPost = findPost(id);
    setPost(foundPost)
    console.log(post);
    
  }, [post]);

  if(!post){
    return <h1>no post found</h1>
  }

  return (
    <>
      {/* Mobile-only content */}
      <div className="md:hidden min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-100 text-gray-900 flex flex-col items-center py-12 px-6 font-sans">
        <div className="max-w-lg w-full flex flex-col gap-8">
          <div className="w-full aspect-[4/5] bg-gray-300  flex items-center justify-center text-gray-500 h-[40rem] font-semibold text-2xl select-none cursor-pointer ease-in-out ">
         <img src={post.post} alt="post " className="h-full w-full object-cover" />
          </div>
          <span className="uppercase text-gray-600 tracking-wide font-medium text-xs">
            Caption
          </span>
          <p className="text-base font-light leading-relaxed tracking-wide">
            {post.caption}
          </p>
        </div>
      </div>

      {/* Desktop-only message */}
      <div className="hidden md:flex  min-h-screen items-center justify-center text-center p-6 bg-gray-100 text-gray-800 font-sans">
        <h1 className="text-xl font-semibold">
          This website is only for mobile users
        </h1>
      </div>
    </>
  );
};

export default ViewPost;
