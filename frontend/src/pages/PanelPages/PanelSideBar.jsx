import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logOutError, logOutStart, logOutSuccess } from "../../redux/userSlice";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const PanelSideBar = () => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeUser } = useSelector((state) => state.user);

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

  // “Galeri” menüsüne tıklanınca hem “galleryOpen” toggle,
  // hem de "/panel/gallery" sayfasına navigate
  const handleGalleryClick = () => {
    setGalleryOpen(!galleryOpen);
    navigate("/panel/gallery");
  };

  return (
    <section className="flex relative overflow-hidden min-h-screen max-w-screen z-10">
      {/* <div className="-top-1/2 absolute -right-1/4 my-ellipse2 z-1"></div> */}

      <aside className="flex flex-col items-center w-[10%] min-w-screen min-h-content bg-[#0e0c1b] p-[15px] relative">
      {/* <div className="-bottom-1/2 absolute -left-1/2 my-ellipse z-1"></div> */}
       
        <nav className="flex flex-col items-start w-full gap-[10px] z-10">
          <NavLink
            className="flex items-center w-[90%] text-white font-monserrat text-[15px] rounded-lg p-[7px] cursor-pointer hover:bg-white hover:text-[#0e0c1b]"
            to="/panel"
          >
            Panel
          </NavLink>
          {/* <NavLink
            className="flex items-center w-[90%] text-white font-monserrat text-[15px] rounded-lg p-[7px] cursor-pointer hover:bg-white hover:text-[#0e0c1b]"
            to="/panel/dashboard"
          >
            Dashboard
          </NavLink> */}
          <NavLink
            className="flex items-center w-[90%] text-white font-monserrat text-[15px] rounded-lg p-[7px] cursor-pointer hover:bg-white hover:text-[#0e0c1b]"
            to="/panel/pages"
          >
            Pages
          </NavLink>
          <NavLink
            className="flex items-center w-[90%] text-white font-monserrat text-[15px] rounded-lg p-[7px] cursor-pointer hover:bg-white hover:text-[#0e0c1b]"
            to="/panel/yeniblogekle"
          >
            Yeni Blog Ekle
          </NavLink>
          <NavLink
            className="flex items-center w-[90%] text-white font-monserrat text-[15px] rounded-lg p-[7px] cursor-pointer hover:bg-white hover:text-[#0e0c1b]"
            to="/panel/bloglar"
          >
            Bloglar
          </NavLink>
          <NavLink
            className="flex items-center w-[90%] text-white font-monserrat text-[15px] rounded-lg p-[7px] cursor-pointer hover:bg-white hover:text-[#0e0c1b]"
            to="/panel/users"
          >
            Kullanıcıları Yönet
          </NavLink>

          {/* “Galeri” menüsü (ana item) */}
          <div className="flex flex-col w-[90%]">
            <div
              onClick={handleGalleryClick}
              className="flex items-center text-white font-monserrat text-[15px] rounded-lg p-[7px] hover:bg-white hover:text-[#0e0c1b] cursor-pointer"
            >
              <span className="mr-2">Galeri</span>
              {galleryOpen ? <FaChevronDown /> : <FaChevronRight />}
            </div>

            {/* Sub-menü: sadece galleryOpen === true ise */}
            {galleryOpen && (
              <div className="flex flex-col ml-5">
                <NavLink
                  to="/panel/upload-image"
                  className="flex items-center w-[90%] whitespace-nowrap text-white font-monserrat text-[15px] rounded-lg p-[5px] cursor-pointer hover:bg-white hover:text-[#0e0c1b]"
                >
                  Resim yükle
                </NavLink>
                <NavLink
                  to="/panel/search-image"
                  className="flex items-center w-[90%] text-white font-monserrat text-[15px] rounded-lg p-[5px] cursor-pointer hover:bg-white hover:text-[#0e0c1b]"
                >
                  Resim Ara
                </NavLink>
              </div>
            )}
          </div>
          {/* end Galeri menüsü */}

          <a
            className="flex items-center w-[90%] text-white font-monserrat text-[15px] rounded-lg p-[7px] cursor-pointer hover:bg-white hover:text-[#0e0c1b]"
            href="#"
            onClick={handleLogOut}
          >
            Çıkış Yap
          </a>
        </nav>
      </aside>

      <main className="m-0 p-0 border-box w-full bg-gray-800">
        <Outlet />
      </main>
    </section>
  );
};

export default PanelSideBar;
