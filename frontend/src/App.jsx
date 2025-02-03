import React from "react";
import Header from "./components/header/Header";
import BlogDüzenle from "./pages/PanelPages/BlogDüzenle";
import ScrollToTopButton from "./components/ScrollToTopButton"
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import HeaderDgtl from "./components/header/HeaderDgtl";
import Register from "./pages/Register";
import Panel from "./pages/PanelPages/Panel";
import "./App.css"
import BlogEkle from "./pages/PanelPages/BlogEkle";
import BlogListele from "./pages/PanelPages/BlogListele";

import ScrollToTop from "./components/ScrollToTop";

import GaleriPage from "./pages/PanelPages/GaleriPage";
import UploadImage from "./pages/PanelPages/UploadImage";
import SearchImage from "./pages/PanelPages/SearchImage";

import Gallery from "./pages/PanelPages/Gallery";
import EditImage from "./pages/PanelPages/EditImage";

import EditDynamicPage from "./pages/PanelPages/EditDynamicPage";
import EditPage from "./pages/PanelPages/EditPage";
import PageDetails from "./pages/PanelPages/PageDetails";
import PageList from "./pages/PanelPages/PageList";
import EditComponent from "./pages/PanelPages/EditComponent";
import { LanguageProvider } from "./context/LanguageContext";
import Users from "./pages/PanelPages/Users";
import ProfilEditor from "./pages/PanelPages/ProfilEditor";


const App = () => {
 const { activeUser } = useSelector((state) => state.user);

  return (
    <>
      <HelmetProvider>
        <BrowserRouter>
       <LanguageProvider>
       {activeUser ? (
            <HeaderDgtl />
          ) : (
            <>
              <Header />
            </>
          )}
          <main>
          {/* <ScrollToTop /> */}
           <Routes>
            <Route path="/" element={<Panel />} />

            <Route path="/panel" element={<Panel />} />
            <Route path="/giris" element={<Login />} />
            <Route path="/kayit-ol" element={<Register />} />
            <Route path="/panel" element={<Panel />}>
               
                <Route path="/panel/upload-image" element={<UploadImage />} />
                <Route path="/panel/search-image" element={<SearchImage />} />
                <Route path="/panel/gallery" element={<Gallery />} />

                <Route path="/panel/users" element={<Users />}></Route>
                <Route path="users/:id" element={<ProfilEditor />} />

                <Route path="/panel/bloglar" element={<BlogListele />} />
                <Route path="/panel/blog/guncelle/:slug" element={<BlogDüzenle />} />
                <Route path="/panel/yeniblogekle" element={<BlogEkle />} />
                <Route path="/panel/edit/:page" element={<EditDynamicPage />} />
                
                <Route path="/panel/pages" element={<PageList />} />
                <Route path="/panel/pages/:pageName/:language" element={<PageDetails />} />
                <Route path="/panel/pages/:pageName/translations/:language/components/:componentIndex" element={<EditComponent />} />


            </Route>
        
           </Routes>
          </main>
          <div className="flex items-center w-screen justify-center mb-4">
          <ScrollToTopButton/>
          </div>
       </LanguageProvider>
        </BrowserRouter>
      </HelmetProvider>
    </>

          
  );
};

export default App;
