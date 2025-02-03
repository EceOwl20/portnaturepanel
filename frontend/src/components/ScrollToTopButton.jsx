import React, { useState, useEffect } from "react";
import arrow from "../../public/images/uparrowıIcon.png"

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll durumunu izleme
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Sayfanın en üstüne kaydırma
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll effect
    });
  };

  return (
    <div className="flex">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="p-3 cursor-pointer text-white rounded-full shadow-lg hover:bg-gray-400 transition"
        >
          <img src={arrow} alt="arrow" width={arrow.width} height={arrow.height}/>
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
