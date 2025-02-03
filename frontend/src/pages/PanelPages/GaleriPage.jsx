import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getApp } from "firebase/app";

const GaleriPage = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [wait, setWait] = useState(false);

  const app = getApp();
  const storage = getStorage(app);

  // Veritabanından resimleri çek
  const fetchImagesFromDB = async () => {
    try {
      const response = await fetch('/api/images/all'); // Tüm resimleri getir
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data); // Verileri state'e kaydet
    } catch (error) {
      console.error("Resimler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchImagesFromDB(); // Sayfa yüklendiğinde veritabanından resimleri al
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setWait(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Yükleme ilerlemesi burada izlenebilir
          },
          (error) => reject(error),
          () => resolve()
        );
      });

      const downloadURL = await getDownloadURL(storageRef);

      // Veritabanına yeni resim kaydet
      const newImage = {
        name: { en: fileName, tr: fileName, de: fileName, ru: fileName },
        altText: { en: fileName, tr: fileName, de: fileName, ru: fileName },
        firebaseUrl: downloadURL,
      };

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage),
      });

      if (!response.ok) throw new Error('Failed to upload image');
      const savedImage = await response.json();

      // Yeni resmi state'e ekle
      setImages((prev) => [savedImage.newImage, ...prev]);
      setFile(null);
    } catch (error) {
      console.error("Yükleme Hatası:", error);
    } finally {
      setWait(false);
    }
  };

  const handleDelete = async (image) => {
    setWait(true);
    try {
      const fileRef = ref(storage, `images/${image.name.en}`);

      // Firebase'den sil
      await deleteObject(fileRef);

      // Veritabanından kaydı sil
      const response = await fetch(`/api/images/${image._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete image');

      // State'den sil
      setImages((prev) => prev.filter((img) => img._id !== image._id));
    } catch (error) {
      console.error("Silme Hatası:", error);
    } finally {
      setWait(false);
    }
  };

  return (
    <div className="p-4">
      <h1>Galeri</h1>
      <div className="flex items-center gap-2 my-4">
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={wait} />
        <button onClick={handleUpload} disabled={wait || !file}>
          Yükle
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="border p-2 flex flex-col items-center">
            <img src={img.firebaseUrl} alt={img.altText.en || "Resim"} className="w-full" />
            <button 
              onClick={() => handleDelete(img)} 
              disabled={wait}
              className="mt-2 text-red-500"
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaleriPage;
