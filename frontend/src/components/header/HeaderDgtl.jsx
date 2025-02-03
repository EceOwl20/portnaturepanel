import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { logOutError, logOutStart, logOutSuccess } from "../../redux/userSlice";
import { FiLogOut, FiEdit } from "react-icons/fi";

const HeaderDgtl = () => {
  const { activeUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleLogOut = async () => {
    dispatch(logOutStart());
    const response = await fetch("/api/giris/cikis");
    const data = await response.json();
    if (data.success === false) {
      dispatch(logOutError(data.message));
      return;
    }
    dispatch(logOutSuccess(data));
  };

  const yetkiFunc = (number) => {
    if (number === 1) return "Admin";
    if (number === 2) return "Editor";
    if (number === 3) return "Kullanıcı";
    return "Bilinmiyor";
  };

  const yetki = activeUser ? yetkiFunc(activeUser.accessLevel) : null;

  // Profil dropdown’unun açık/kapalı durumunu tutuyoruz
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  // Örnek logout fonksiyonu
  const handleLogout = () => {
    // Burada Redux store'dan kullanıcıyı çıkış yaptırma veya token temizleme gibi işlemler
    console.log("Logout clicked!");
  };

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
          <Link
            className="hover:bg-white hover:text-[#0e0c1b] py-1 px-2 rounded-md"
            to="/panel/profil"
          >
           <span className="text-[#c3c2c2]"> Yetki:</span> {yetki ? yetki : "Bilinmiyor"}
          </Link>
          {/* <Link
            className="hover:bg-white hover:text-[#0e0c1b] py-1 px-2 rounded-md"
            to="/panel/"
          >
            Level: {yetki ? activeUser.accessLevel : "Bilinmiyor"}
          </Link> */}

          {/* Profil Kısmı */}
          <div className="relative">
            {/* Profil fotoğrafı + isim bir tıkla açılıp/kapanan element */}
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center justify-center gap-1 focus:outline-none"
            >
              {/* <img
                src={photo}
                alt="profile"
                width={photo.width}
                height={photo.height}
                className="w-[50px] h-[50px] rounded-lg"
              /> */}
              <div className="flex flex-col gap-0 items-start justify-center text-left">
                <span className="hover:bg-white hover:text-[#0e0c1b] py-1 px-2 rounded-md capitalize">
                  {activeUser.name}
                </span>
                <p className="py-1 px-2 rounded-md font-light text-[14px] text-[#c3c2c2]">
                  {activeUser.email}
                </p>
              </div>
            </button>

            {/* Dropdown Menüsü (Profil Düzenle & Logout) */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 w-full mt-2 text-[#c3c2c2] bg-[#0e0c1b] text-left rounded-md shadow-lg py-2 z-50">
                <Link
                  to={`/panel/users/${activeUser._id}`}
                  className="flex items-center justify-between px-4 py-2 hover:bg-white hover:text-[#0e0c1b]"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profili Düzenle
                  <FiEdit size={20} color="#548ecf" />
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogOut();
                  }}
                  className="flex w-full text-left px-4 py-2 hover:bg-white hover:text-[#0e0c1b] items-center justify-between"
                >
                  Log Out
                  <FiLogOut size={20} color="#ac3b35"/> 
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default HeaderDgtl;
