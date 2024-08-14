import { useState, useEffect } from "react";

const useWidth = () => {
  const [width, setWidth] = useState(0); // Initial width to prevent errors on first render

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    handleResize(); // Set initial width on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []); // Empty dependency array ensures it runs only once

  return width;
};

export default useWidth;
