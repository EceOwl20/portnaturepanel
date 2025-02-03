import React, { useEffect, useState } from 'react';
import Table from './PanelComponents/Table';
import { Link } from 'react-router-dom';

const Users = () => {
  const [list, setList] = useState([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await fetch("/api/user/getir");
    const data = await response.json();
    if (data.success === false) {
      return;
    }
    setList(data);
  };

  

  const handleUserDelete = async (id) => {
    try {
      const response = await fetch(`/api/user/delete/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',}
      });
      const data = await response.json();
      if (data.success === false) {
        console.log("Hata Var !");
        return;
      }
      setList((prev) => prev.filter((liste) => liste._id !== id));
      setSuccess("Kullanıcı Başarıyla Silindi");
    } catch (error) {
      console.log(error.message);
    }
  };
    console.log(list)
  return (
    <main className='flex flex-col items-center mb-[20px] w-[100%]'>
      <h1 className='text-white text-[30px] my-4'>Kullanıcılar</h1>
      <Table
        head={["ID", "Kullanıcı Adı", "Adı Soyadı", "E-mail", "Yetki", "Aksiyonlar"]}
        body={
          list.map((item) => (
            [
              item._id,
              item.username,
              item.name,
              item.email,
              item.accessLevel,
              [
                <Link className='py-[5px] px-[10px] bg-[#548ecf] ml-[10px] mr-[10px] text-white border-none rounded-[5px] cursor-pointer' to={`${item._id}`}>Görüntüle</Link>,
                <button className='py-[5px] px-[10px] bg-[#ac3b35] ml-[10px] text-white border-none rounded-[5px] cursor-pointer' type='button' onClick={() => handleUserDelete(item._id)}>Sil</button>
              ]
            ]
          ))
        }
      >
      </Table>
      <p>{success}</p>
    </main>
  );
};

export default Users;