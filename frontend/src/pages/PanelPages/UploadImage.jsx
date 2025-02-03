import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase.js";

const UploadImage = () => {
  const [progressBar, setProgressBar] = useState(0);
  const [formData, setFormData] = useState({
    name: { en: "", ru: "", de: "", tr: "" },
    altText: { en: "", ru: "", de: "", tr: "" },
    firebaseUrl: "",
  });
  const [file, setFile] = useState(null);
  const [wait, setWait] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (file) => {
    setWait(true);

    const storage = getStorage(app);
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressBar(Math.round(progress));
      },
      (error) => {
        setError(error.message || "Image upload failed.");
        setWait(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, firebaseUrl: downloadURL }));
        setWait(false);
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [dataset.lang]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWait(true);
    setError(null);
    setSuccess(false);

    if (
      !formData.firebaseUrl ||
      Object.values(formData.name).some((v) => !v) ||
      Object.values(formData.altText).some((v) => !v)
    ) {
      setError("All fields are required.");
      setWait(false);
      return;
    }

    try {
      const response = await fetch("/api/images/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data) {
        setError(data?.message || "Image upload failed.");
        setWait(false);
        return;
      }

      setSuccess(true);
      setFormData({
        name: { en: "", ru: "", de: "", tr: "" },
        altText: { en: "", ru: "", de: "", tr: "" },
        firebaseUrl: "",
      });
      setFile(null);
      setProgressBar(0);
      alert("Image uploaded successfully!");
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setWait(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center font-monserrat">
      <div className="flex flex-col w-[70%] items-center justify-center my-12 py-10 px-6 bg-gray-500">
        <h2 className="text-[30px] font-medium font-monserrat text-[#ffffff]">
          Resim Yükle
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center w-[100%] gap-5 min-h-[400px]"
        >
          {formData.firebaseUrl && (
            <img
              src={formData.firebaseUrl}
              alt="Uploaded"
              className="max-w-[200px] max-h-[200px]"
            />
          )}
          <p>
            {progressBar > 0 && progressBar < 100
              ? `${progressBar}%`
              : progressBar === 100 && "Yüklendi"}
          </p>
          <input
            className="flex border border-[#0E0C1B] py-2 p-2 w-[57%] bg-white rounded-md"
            type="file"
            name="firebaseUrl"
            accept="image/*"
            onChange={handleFileChange}
            required
            disabled={wait}
          />
          {["en", "ru", "de", "tr"].map((lang) => (
            <div key={lang} className="flex py-1 px-2 gap-[2%] w-[60%] ">
              <input
                type="text"
                name="name"
                placeholder={`Name (${lang})`}
                data-lang={lang}
                value={formData.name[lang]}
                onChange={handleInputChange}
                required
                className="flex border border-[#0E0C1B] bg-white py-2 px-[1%] bg-transparent w-[48%] rounded-md"
              />
              <input
                type="text"
                name="altText"
                placeholder={`Alt Text (${lang})`}
                data-lang={lang}
                value={formData.altText[lang]}
                onChange={handleInputChange}
                required
                className="flex border border-[#0E0C1B] bg-white bg-transparent py-2 px-[1%] w-[48%] rounded-md"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={wait}
            className="mt-10 border z-90 text-white hover:text-[#0E0C1B] border-[#0E0C1B] py-[6px] px-[20px] bg-[#0E0C1B] hover:bg-white rounded-md"
          >
            {wait ? "Uploading..." : "Yükle"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>Upload successful!</p>}
        </form>
      </div>
    </div>
  );
};

export default UploadImage;
