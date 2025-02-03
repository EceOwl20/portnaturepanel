import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase.js";

const EditImage = () => {
  const { id } = useParams(); // URL'den resim ID'sini al
  const navigate = useNavigate(); // İşlem sonrası yönlendirme için
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: { en: "", ru: "", de: "", tr: "" },
    altText: { en: "", ru: "", de: "", tr: "" },
  });
  const [firebaseUrl, setFirebaseUrl] = useState(""); // Firebase URL'sini tutar
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Sayfa yüklendiğinde mevcut resim verilerini getir
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/images/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch image");
        }

        setImage(data);
        setFormData({
          name: data.name,
          altText: data.altText,
        });
        setFirebaseUrl(data.firebaseUrl); // Mevcut firebaseUrl'yi ayarla
      } catch (err) {
        setError(err.message);
      }
    };

    fetchImage();
  }, [id]);

  // Input değişikliklerini yönetir
  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    const lang = dataset.lang; // Hangi dil olduğunu al

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: {
        ...prevFormData[name],
        [lang]: value, // İlgili dili güncelle
      },
    }));
  };

  // Resmi Firebase'e yükler ve URL'yi alır
  const handleUpload = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Yeni resim seçildiğinde çağrılır
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedUrl = await handleUpload(file);
        setFirebaseUrl(uploadedUrl); // Yeni URL'yi ayarla
      } catch (err) {
        console.error("Error uploading new image:", err);
        setError("Error uploading image");
      }
    }
  };

  // Form gönderildiğinde çağrılır
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const updatedData = {
      ...formData,
      firebaseUrl: firebaseUrl || image.firebaseUrl, // Yeni veya mevcut firebaseUrl
    };

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update image");
      }

      setSuccess(true);
      alert("Image updated successfully!");
      navigate("/panel/gallery"); // Galeriye yönlendir
    } catch (err) {
      setError(err.message);
    }
  };

  if (!image) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center bg-slate-500 py-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center w-[40%] gap-5 min-h-[400px]"
      >
        {/* Mevcut veya yeni resmi göster */}
        <img src={firebaseUrl || image.firebaseUrl} alt="Current" className="w-[50%] h-auto" />

        {/* Yeni resim seçmek için input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border py-2 px-3"
        />

        <p className="bg-white text-black p-2 rounded-md">{image.firebaseUrl}</p>

        {/* Dil bazında name ve altText alanları */}
        {["en", "ru", "de", "tr"].map((lang) => (
          <div key={lang} className="flex flex-col w-full">
            <label>{`Name (${lang})`}</label>
            <input
              type="text"
              name="name"
              placeholder={`Name (${lang})`}
              data-lang={lang}
              value={formData.name[lang]}
              onChange={handleInputChange}
              required
              className="border py-2 px-3"
            />
            <label>{`Alt Text (${lang})`}</label>
            <input
              type="text"
              name="altText"
              placeholder={`Alt Text (${lang})`}
              data-lang={lang}
              value={formData.altText[lang]}
              onChange={handleInputChange}
              required
              className="border py-2 px-3"
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded"
        >
          Update
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Update successful!</p>}
      </form>
    </div>
  );
};

export default EditImage;
