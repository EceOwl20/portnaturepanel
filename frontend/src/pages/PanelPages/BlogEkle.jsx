import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase.js";

const BlogEkle = () => {
  const { activeUser } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    urls: { tr: "", en: "", ru: "", de: "" },
    author: activeUser._id,
    thumbnail: "",
    images: [],
    sections: {
      tr: [],
      en: [],
      ru: [],
      de: [],
    },
  });

  const [error, setError] = useState(false);
  const [wait, setWait] = useState(false);
  const [success, setSuccess] = useState(false);
  const [thumbnail, setThumbnail] = useState(undefined);
  const [imageError, setImageError] = useState(false);
  const [progressBar, setProgressBar] = useState(0);

  // Slug oluşturma fonksiyonu
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Dil bazlı URL güncelleme effect
  useEffect(() => {
    const newUrls = { ...form.urls };
    const languages = ["tr", "en", "ru", "de"];

    languages.forEach((lang) => {
      if (form.sections[lang].length > 0 && form.sections[lang][0].title) {
        newUrls[lang] = generateSlug(form.sections[lang][0].title);
      }
    });

    setForm((prevForm) => ({ ...prevForm, urls: newUrls }));
    // form.sections değiştiğinde çalışır
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sections]);

  useEffect(() => {
    if (thumbnail) {
      handleUploadThumbnail(thumbnail);
    }
  }, [thumbnail]);

  const handleUploadThumbnail = (image) => {
    setWait(true);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadImage = uploadBytesResumable(storageRef, image);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressBar(Math.round(progress));
      },
      (error) => {
        setImageError(error.message || "Resim yükleme hatası");
        setWait(false);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
          setForm((prevForm) => ({
            ...prevForm,
            thumbnail: downloadURL,
          }));
          setWait(false);
        });
      }
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // urls.tr, urls.en gibi alanlar yok, url alanı yok artık
    // Eğer URL alanlarını manuel değiştirmek isterseniz burada kontrol edebilirsiniz
    // Ancak biz otomatik oluşturuyoruz diye varsayıyorum, bu yüzden urls için input kullanmıyoruz.
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleAddSection = (language) => {
    setForm((prevForm) => ({
      ...prevForm,
      sections: {
        ...prevForm.sections,
        [language]: [...prevForm.sections[language], { title: "", content: "" }],
      },
    }));
  };

  const handleSectionChange = (language, index, field, value) => {
    setForm((prevForm) => {
      const updatedSections = prevForm.sections[language].map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      );
      return {
        ...prevForm,
        sections: {
          ...prevForm.sections,
          [language]: updatedSections,
        },
      };
    });
  };

  const handleImagesUpload = (e) => {
    setWait(true);
    const files = e.target.files;
    const storage = getStorage(app);
    const uploadPromises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const uploadPromise = new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgressBar(Math.round(progress));
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });

      uploadPromises.push(uploadPromise);
    }

    Promise.all(uploadPromises)
      .then((downloadURLs) => {
        setForm((prevForm) => ({
          ...prevForm,
          images: [...prevForm.images, ...downloadURLs],
        }));
        setWait(false);
      })
      .catch((error) => {
        setImageError(error.message || "Resim yükleme hatası");
        setWait(false);
      });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setWait(true);

    try {
      const response = await fetch("/api/blog/yeni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (data.success === false) {
        setError(data.message || "Bir hata oluştu.");
        setWait(false);
        return;
      }

      setSuccess("Veri Başarılı Bir Şekilde Yüklendi");
      console.log("Veri Kaydedildi", data);
      setWait(false);
    } catch (error) {
      setError(error.message || "Bir hata oluştu.");
      setWait(false);
    }
  };

  return (
    <section className="flex flex-col p-10 gap-6">
  <form
    onSubmit={handleFormSubmit}
    className="flex flex-col gap-6 p-10 rounded-xl w-full bg-gray-500 font-monserrat"
  >
    <div className="text-center font-bold text-[24px]">BLOG EKLE</div>

    {/* Thumbnail Yükleme ve URL Gösterimi */}
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
        <h4 className="font-bold text-white">Thumbnail Yükle</h4>
        {form.thumbnail && (
          <img
            src={form.thumbnail}
            alt="Thumbnail"
            className="w-full max-h-[200px] object-cover rounded-lg"
          />
        )}
        <p className="text-white">
          {progressBar > 0 && progressBar < 100
            ? `${progressBar}%`
            : progressBar === 100 && "Yüklendi"}
        </p>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          className="rounded-sm bg-white p-2"
          onChange={(e) => setThumbnail(e.target.files[0])}
          disabled={wait}
        />
      </div>

      <div className="flex flex-col w-full md:w-2/3 bg-white p-4 rounded-lg">
        <h4 className="font-bold">URL'ler:</h4>
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/w40/tr.png"
            alt="Türkçe"
            className="w-6 h-4"
          />
          <p>Türkçe: {form.urls.tr}</p>
        </div>
        <div className="flex items-center gap-2">
          <img
            src='https://flagcdn.com/w40/gb.png'
            alt="İngilizce"
            className="w-6 h-4"
          />
          <p>İngilizce: {form.urls.en}</p>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/w40/ru.png"
            alt="Rusça"
            className="w-6 h-4"
          />
          <p>Rusça: {form.urls.ru}</p>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/w40/de.png"
            alt="Almanca"
            className="w-6 h-4"
          />
          <p>Almanca: {form.urls.de}</p>
        </div>
      </div>
    </div>

    {/* Çoklu Fotoğraf Yükleme ve Dil Bölümleri */}
    <div className="flex flex-col gap-6">
      {/* Çoklu Fotoğraf Yükleme */}
      <div className="bg-white p-4 rounded-lg">
  <h4 className="font-bold">Fotoğraflar Yükle</h4>
  <input
    type="file"
    accept="image/*"
    multiple
    className="rounded-sm bg-gray-200 p-2 w-full"
    onChange={handleImagesUpload}
    disabled={wait}
  />
  {/* Fotoğraf Önizlemeleri */}
  <div className="flex flex-wrap gap-4 mt-4">
    {form.images.map((image, index) => (
      <div key={index} className="relative">
        <img
          src={image}
          alt={`Fotoğraf ${index + 1}`}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>
    ))}
  </div>
</div>


      {/* Dil Bölümleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["tr", "en", "ru", "de"].map((lang) => (
          <div key={lang} className="bg-white p-4 rounded-lg">
            <h3 className="flex items-center gap-2 font-bold">
              <img
                src={`https://flagcdn.com/w40/${lang === "en" ? "gb" : lang}.png`}
                alt={`${lang.toUpperCase()} Bayrağı`}
                className="w-6 h-4"
              />
              {lang === "tr"
                ? "Türkçe"
                : lang === "en"
                ? "İngilizce"
                : lang === "ru"
                ? "Rusça"
                : "Almanca"}
            </h3>
            {form.sections[lang].map((section, index) => (
              <div key={index} className="flex flex-col gap-2 mt-4">
                <input
                  type="text"
                  className="rounded-sm bg-gray-100 p-2"
                  placeholder="Başlık"
                  value={section.title}
                  onChange={(e) =>
                    handleSectionChange(lang, index, "title", e.target.value)
                  }
                />
                <textarea
                  placeholder="İçerik"
                  className="rounded-sm bg-gray-100 p-2"
                  value={section.content}
                  onChange={(e) =>
                    handleSectionChange(lang, index, "content", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="mt-4 text-white bg-black p-2 rounded-md hover:bg-gray-700 transition duration-300"
              onClick={() => handleAddSection(lang)}
              disabled={wait}
            >
              {lang === "tr"
                ? "Türkçe Bölüm Ekle"
                : lang === "en"
                ? "İngilizce Bölüm Ekle"
                : lang === "ru"
                ? "Rusça Bölüm Ekle"
                : "Almanca Bölüm Ekle"}
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* Form Gönderme */}
    <div className="flex items-center justify-center">
      <button
        type="submit"
        className="bg-black text-white flex justify-center rounded-sm py-2 px-6 hover:bg-gray-700 transition duration-300"
        disabled={wait}
      >
        {wait ? "Bekleyin..." : "Kaydet"}
      </button>
    </div>

    {/* Hata ve Başarı Mesajları */}
    {error && <p className="text-red-500 text-center">{error}</p>}
    {success && <p className="text-green-500 text-center">{success}</p>}
  </form>
</section>


  );
};

export default BlogEkle;
