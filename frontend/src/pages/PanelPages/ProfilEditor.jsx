import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProfilEditor = () => {

    const { id } = useParams();
    const [user, setUser] = useState({
        username: '',
        name: '',
        email: '',
        password: ''
    });
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [wait, setWait] = useState(false);
    const [loading, setLoading] = useState(true);

    const getUserDetail = async () => {
        try {
          const response = await fetch(`/api/user/getirbir/${id}`);
          const data = await response.json();
      
          if (!response.ok || data.success === false) {
            setError(data.message || 'Kullanıcı bilgileri alınamadı.');
            return;
          }
          if (data.data) {
            setUser((prevUser) => ({
              ...prevUser,
              ...data.data,
            }));
          } else {
            setUser((prevUser) => ({
              ...prevUser,
              ...data,
            }));
          }
        } catch (error) {
          setError('Sunucudan veri alınırken bir hata oluştu.');
        } finally {
          setLoading(false);
        }
      };
      

    useEffect(()=>{
        getUserDetail();
    },[])

    const handleUserChange = (e) => {
        setUser({
            ...user,
            [e.target.name] : e.target.value
        })
    }

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setWait(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch (`/api/user/guncelle/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            if (!data.success) {
                setError(data.message || "Güncelleme Başarısız");
            } else {
                setSuccess("Güncelleme Başarılı");
            }
        } catch (error) {
            console.error("Güncelleme Hatası:", error);
            setError("Güncelleme Sırasında Bir Hata Oluştu");
        } finally {
            setWait(false);
        }
    }
    console.log(user)
    return (
        <section className="max-w-[1400px] my-[50px] mx-auto w-[40%] py-[40px] px-[30px] rounded-[8px] text-white text-center">
          <h1 className='text-[30px] mb-[30px] text-[#ffffff] w-full font-medium'>Profil Düzenle</h1>
          {error && <p className="bg-[#f8d7da] text-[#721c24]">{error}</p>}
          {success && <p className="bg-[#f8d7da] text-[#155724]">{success}</p>}
          {wait && <p className="bg-[#fff3cd] text-[#856404]">Bekleyiniz..</p>}
          <form onSubmit={handleUserSubmit} className="flex w-[100%] flex-col items-center justify-center gap-2">
            <label className='mb-[5px] w-full font-bold' htmlFor="username">Kullanıcı Adı</label>
            <input
              id="username"
              type="text"
              name="username"
              value={user.username || ""}
              onChange={handleUserChange}
              className='w-[96%] p-[12px] mb-[20px] border border-[#ccc] rounded-[4px] text-[16px] text-[#0e0c1b]'
            />
    
            <label className='mb-[5px] w-full  font-bold' htmlFor="name">Adınız Soyadınız</label>
            <input
              id="name"
              type="text"
              name="name"
              value={user.name || ""}
              onChange={handleUserChange}
              className='w-[96%] p-[12px] mb-[20px] border border-[#ccc] rounded-[4px] text-[16px] text-[#0e0c1b]'
            />
    
            <label className='mb-[5px] w-full font-bold' htmlFor="email">E-posta Adresiniz</label>
            <input
              id="email"
              type="text"
              name="email"
              value={user.email || ""}
              onChange={handleUserChange}
              className='w-[96%] p-[12px] mb-[20px] border border-[#ccc] rounded-[4px] text-[16px] text-[#0e0c1b]'
            />
    
            <label className='mb-[5px] w-full font-bold' htmlFor="password">Parola</label>
            <input
              id="password"
              type="text"
              name="password"
              value={user.password || ""}
              onChange={handleUserChange}
              className='w-[96%] p-[12px] mb-[20px] border border-[#ccc] rounded-[4px] text-[16px] text-[#0e0c1b]'
            />
    
            <button className="p-[12px] mt-6 w-[40%] bg-[#0e0c1b] text-white borer-none rounded-[4px] text-[18px] cursor-pointer duration-500 hover:bg-[#56a7d0] hover:duration-500" type="submit">{wait ? "Bekleyiniz.." : "Kaydet"}</button>
          </form>
        </section>
      );
    };
    
    export default ProfilEditor;