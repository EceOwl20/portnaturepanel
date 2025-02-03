import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const [form, setForm] = useState({});
    const [error, setError] = useState(false);
    const [wait, setWait] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setWait(true);
        const response = await fetch ("/api/giris/kayit-ol", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        });
        console.log(form)

        const data = await response.json();
        if(data.success===false){
            setError(data.message);
            setWait(false);
            return;
        }

        navigate("/giris");

        console.log("kayıt başarılı")
    }
  return (
    <section className='w-screen h-[60vh] bg-white text-center flex flex-col my-[2%] items-center justify-center font-monserrat'>
        <h1 className='text-[32px] text-[#243039] mb-[1%]'>Kayıt Ol</h1>
        <form onSubmit={handleSubmit} className='flex justify-center items-center text-white flex-col min-h-content gap-[2%] w-[30%] bg-[#243039] rounded-[20px] p-[1%]'>
            <label htmlFor="username">Kullanıcı Adı</label>
            <input id='username' type="text" name='username' onChange={handleChange} className='text-[#243039] w-[70%] py-[3%] px-[2%] h-[5%] rounded-[10px] border '/>

            <label htmlFor="name">Adınız Soyadınız</label>
            <input id='name' type="text" name='name' onChange={handleChange} className='w-[70%] text-[#243039] h-[5%] py-[3%] px-[2%] rounded-[10px] border '/>

            <label htmlFor="email">E-posta Adresiniz</label>
            <input id='email' type="text" name='email' onChange={handleChange} className='w-[70%] text-[#243039] h-[5%] py-[3%] px-[2%] rounded-[10px] border ' />

            <label htmlFor="password">Paralo</label>
            <input id='password' type="text" name='password' onChange={handleChange} className='w-[70%] text-[#243039] h-[5%] py-[3%] px-[2%] rounded-[10px] border '/>

            <button className='mt-[5%] mb-[1%] w-[15%] p-[10px] whitespace-nowrap font-monserrat rounded-[10px] border-customGray bg-white text-customGray cursor-pointer hover:bg-customGray hover:text-white' type='submit'>{wait ? "Bekleyiniz..":"Kayıt Ol"}</button>
            {error && <p className='error'>{error}</p>}
        </form>
    </section>
  )
}

export default Register