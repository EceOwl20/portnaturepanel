import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {

  return (
    <header className="relative w-screen h-[96px] flex items-center top-0 bg-[#0e0c1b] justify-center">
      {/* Logo ve Navigasyon */}
      <div className="relative flex items-center justify-between w-[95%] h-full px-[5%] font-sans text-[16px] text-white font-medium">
        {/* Logo */}
        <Link to="/panel">
          <img
            src="/logo/DgtlLogoRenk.png"
            className="h-[40px] ml-[20px]"
            alt="DGTLFACELOGO"
          />
        </Link>

        <div className="flex items-center justify-center gap-12">
          <Link
            className="hover:bg-white hover:text-[#0e0c1b] py-1 px-2 rounded-md"
            to="/"
          >
            Ana Sayfa
          </Link>
          <Link
            className="hover:bg-white hover:text-[#0e0c1b] py-1 px-2 rounded-md"
            to="/panel"
          >
            Panel
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Header;
