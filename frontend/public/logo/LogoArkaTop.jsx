import React from "react";

function LogoArkaTop({ className }) {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1920"
        height="96"
        viewBox="0 0 1920 96"
        fill="none"
      >
        <path
          d="M0 0H1920V96H0V0Z"
          fill="pink"
          fillOpacity="1" // Opaklık tam dolu.
        />
      </svg>
    </div>
  );
}

export default LogoArkaTop;
