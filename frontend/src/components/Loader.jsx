import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import ShinyText from "./ShinyText";

const Loader = () => {
  const { wokeUp } = useAuth();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (wokeUp) {
      // delay unmount to allow fade-out animation
      const timer = setTimeout(() => setVisible(false), 700); // match duration
      return () => clearTimeout(timer);
    }
  }, [wokeUp]);

  if (!visible) return null;

  return (
    <div
      className={`w-full h-screen absolute top-0 left-0 z-50 bg-black flex flex-col justify-center items-center transition-opacity duration-700 ${
        wokeUp ? "opacity-0" : "opacity-100"
      }`}
    >
      <ShinyText
        text="[WAKING UP THE BACKEND]"
        disabled={false}
        speed={3}
        className="tracking-widest text-2xl"
      />
      <p className="text-white/50 tracking-widest mt-2">PLEASE HANG IN THERE</p>
    </div>
  );
};

export default Loader;
