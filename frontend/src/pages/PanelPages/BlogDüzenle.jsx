import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Firebase importları
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";

// Galeri popup bileşeni
import GaleriPopup from "./PanelComponents/GaleriPopup";

const BlogDüzenle = () => {
  const { slug, id } = useParams();
  const [form, setForm] = useState({
    urls: { tr: "", en: "", ru: "", de: "" },
    author: "",
    thumbnail: "",
    images: [],
    sections: {
      tr: [],
      en: [],
      ru: [],
      de: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wait, setWait] = useState(false);
  const [success, setSuccess] = useState(false);

  // Galeri modal kontrol
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dosya yükleme ile ilgili state'ler
  const [fileToUpload, setFileToUpload] = useState(null);
  const [progressBar, setProgressBar] = useState(0);

  // Blog verisini çek
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        const data = await response.json();
        if (data.success) {
          setForm(data.blog);
        } else {
          setError(data.message || "Blog verisi alınamadı.");
        }
      } catch (err) {
        setError(err.message || "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  // sections değiştiğinde urls'i (slug) güncelle
  useEffect(() => {
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };
  
    const newUrls = { ...form.urls };
    const languages = ["tr", "en", "ru", "de"];
  
    languages.forEach((lang) => {
      if (form.sections[lang]?.length > 0 && form.sections[lang][0]?.title) {
        newUrls[lang] = generateSlug(form.sections[lang][0].title); // Yeni slug oluştur
      }
    });
  
    setForm((prevForm) => ({ ...prevForm, urls: newUrls })); // Güncellenmiş slug'ları kaydet
  }, [form.sections]);
  

  // Form alanları değişimi
  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Section içeriği düzenleme
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

  // Yeni bölüm ekleme
  const handleAddSection = (language) => {
    setForm((prevForm) => ({
      ...prevForm,
      sections: {
        ...prevForm.sections,
        [language]: [...prevForm.sections[language], { title: "", content: "" }],
      },
    }));
  };

  // Galeri Popup açma/kapatma
  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Galeri'den resim seçilince
  const handleImageSelect = (image) => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, image.firebaseUrl],
    }));
  };

  // Dosya seçildiğinde
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  // Dosya upload işlemi (Firebase)
  const uploadImageToFirebase = () => {
    if (!fileToUpload) return;

    setWait(true);
    setError(null);
    setSuccess(false);

    const storage = getStorage(app);
    const fileName = `${Date.now()}_${fileToUpload.name}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressBar(Math.round(progress));
      },
      (err) => {
        setError(err.message || "Resim yükleme hatası");
        setWait(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Yükleme başarıyla bitti
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, downloadURL],
        }));
        setWait(false);
        setProgressBar(0);
        setFileToUpload(null);
        alert("Resim başarıyla yüklendi!");
      }
    );
  };

  // Resim silme
  const handleRemoveImage = (index) => {
    setForm((prev) => {
      const updated = [...prev.images];
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
  };

  // Form Submit (Güncelle)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setWait(true);
    setError(null);
    setSuccess(false);
  
    try {
      const response = await fetch(`/api/blog/guncelle/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form), // Formdaki tüm verileri gönder
      });
      const data = await response.json();
  
      if (data.success) {
        setSuccess(data.message || "Blog başarıyla güncellendi.");
      } else {
        setError(data.message || "Güncelleme başarısız oldu.");
      }
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setWait(false);
    }
  };
  

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-20">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full flex justify-center mt-20">
        <p className="text-xl text-red-500">Hata: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* ----- RESİMLER KISMI ----- */}
      <div className="md:w-1/3 p-4 bg-gray-100 rounded shadow-md flex flex-col gap-4">
        <h2 className="font-bold text-lg mb-2 text-gray-700 border-b pb-2">
          Resimler
        </h2>

        {/* Thumbnail gösterimi */}
        {form.thumbnail && (
          <div className="mb-2">
            <img
              src={form.thumbnail}
              alt="Thumbnail"
              className="max-w-full h-auto mb-2 border rounded-md shadow-sm"
            />
            <p className="text-sm text-gray-600">Ana görsel (thumbnail)</p>
          </div>
        )}

        {/* Mevcut images dizisini listeleme */}
        <div className="overflow-auto max-h-80 pr-2">
          {form.images && form.images.length > 0 ? (
            <div className="flex flex-col gap-2">
              {form.images.map((imgUrl, i) => (
                <div
                  key={i}
                  className="border bg-white rounded shadow-sm flex justify-between items-center p-2"
                >
                  <img
                    src={imgUrl}
                    alt={`Resim ${i}`}
                    className="max-h-16 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Eklenmiş resim yok.</p>
          )}
        </div>

        {/* Galeri'den Resim Ekle */}
        <button
          type="button"
          onClick={handleModalToggle}
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
        >
          Galeri'den Resim Ekle
        </button>

        {/* ----- Dosyadan Resim Yükleme ----- */}
        <div className="bg-white rounded p-3 shadow-sm mt-4">
          <label className="block font-semibold mb-2 text-gray-700">
            Dosyadan resim yükle:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={wait}
            className="border p-1 w-full rounded text-sm"
          />
          {/* Yükleme yüzdesi */}
          {progressBar > 0 && progressBar < 100 && (
            <p className="mt-1 text-sm text-gray-700">Yükleniyor: {progressBar}%</p>
          )}
          {progressBar === 100 && (
            <p className="mt-1 text-sm text-green-600">Yükleme tamamlandı.</p>
          )}

          <button
            type="button"
            onClick={uploadImageToFirebase}
            disabled={!fileToUpload || wait}
            className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
          >
            {wait ? "Yükleniyor..." : "Dosyayı Firebase'e Yükle"}
          </button>
        </div>
      </div>

      {/* ----- FORM ALANI ----- */}
      <form
        onSubmit={handleUpdate}
        className="md:w-2/3 flex flex-col gap-4 p-4 bg-gray-50 rounded shadow-md"
      >
        <h1 className="text-xl font-bold text-gray-700 border-b pb-2">
          Blog Düzenle
        </h1>

        <div className="bg-white p-3 rounded shadow-sm">
          <h4 className="font-bold text-gray-700 mb-2">Oluşan URL'ler:</h4>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">Türkçe:</span> {form.urls.tr}
            </p>
            <p>
              <span className="font-semibold">İngilizce:</span> {form.urls.en}
            </p>
            <p>
              <span className="font-semibold">Rusça:</span> {form.urls.ru}
            </p>
            <p>
              <span className="font-semibold">Almanca:</span> {form.urls.de}
            </p>
          </div>
        </div>

        {/* Yazar alanı */}
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1">Yazar</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleFormChange}
            className="w-full p-2 rounded border border-gray-300 text-sm"
            placeholder="Yazar adı"
          />
        </div>

        {/* Türkçe Bölümleri */}
        <SectionEditor
          languageKey="tr"
          languageLabel="Türkçe"
          sections={form.sections.tr}
          handleSectionChange={handleSectionChange}
          onAddSection={handleAddSection}
          wait={wait}
        />

        {/* İngilizce Bölümleri */}
        <SectionEditor
          languageKey="en"
          languageLabel="İngilizce"
          sections={form.sections.en}
          handleSectionChange={handleSectionChange}
          onAddSection={handleAddSection}
          wait={wait}
        />

        {/* Rusça Bölümleri */}
        <SectionEditor
          languageKey="ru"
          languageLabel="Rusça"
          sections={form.sections.ru}
          handleSectionChange={handleSectionChange}
          onAddSection={handleAddSection}
          wait={wait}
        />

        {/* Almanca Bölümleri */}
        <SectionEditor
          languageKey="de"
          languageLabel="Almanca"
          sections={form.sections.de}
          handleSectionChange={handleSectionChange}
          onAddSection={handleAddSection}
          wait={wait}
        />

        <div className="flex items-center justify-center mt-4">
          <button
            type="submit"
            disabled={wait}
            className="bg-black text-white w-1/2 py-2 rounded hover:bg-gray-800"
          >
            {wait ? "Bekleyin..." : "Güncelle"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        {success && <p className="text-green-600 mt-2 text-sm">{success}</p>}
      </form>

      {/* Galeri Modal */}
      <GaleriPopup
        isModalOpen={isModalOpen}
        handleModalToggle={handleModalToggle}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
};

/**
 * SectionEditor - Tekrarlanan section kodunu temiz tutmak için
 * ayrı bir küçük bileşen yazıyoruz.
 */
const SectionEditor = ({
  languageKey,
  languageLabel,
  sections,
  handleSectionChange,
  onAddSection,
  wait,
}) => {
  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-700">{languageLabel}</h3>
        <button
          type="button"
          onClick={() => onAddSection(languageKey)}
          disabled={wait}
          className="text-white bg-black px-2 py-1 rounded text-sm hover:bg-gray-800"
        >
          {languageLabel} Bölüm Ekle
        </button>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="mb-4">
          <label className="text-gray-700 text-sm">Başlık</label>
          <input
            type="text"
            className="block w-full p-2 mt-1 mb-2 border border-gray-300 rounded text-sm"
            placeholder={`${languageLabel} Başlık`}
            value={section.title || ""}
            onChange={(e) =>
              handleSectionChange(languageKey, index, "title", e.target.value)
            }
          />

          <label className="text-gray-700 text-sm">İçerik</label>
          <textarea
            rows={4}
            className="block w-full p-2 mt-1 border border-gray-300 rounded text-sm"
            placeholder={`${languageLabel} İçerik`}
            value={section.content || ""}
            onChange={(e) =>
              handleSectionChange(languageKey, index, "content", e.target.value)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default BlogDüzenle;
