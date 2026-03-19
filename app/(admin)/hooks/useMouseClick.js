import { useEffect } from "react";

const useMouseClick = (ref, close) => {
  useEffect(() => {
    let handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
};

export default useMouseClick;
