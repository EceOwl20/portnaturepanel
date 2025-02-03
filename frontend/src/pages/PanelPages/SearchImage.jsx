import React, { useState } from "react";

const SearchImage = () => {
  const [search, setSearch] = useState({ name: "", lang: "en" });
  const [images, setImages] = useState([]); // Arama sonuçları
  const [wait, setWait] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setWait(true);
    setError(null);
    setImages([]); // Önceki sonuçları sıfırla

    try {
      const response = await fetch(
        `/api/images/search?name=${search.name}&lang=${search.lang}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.length) {
        setError(data?.message || "No images found");
        setWait(false);
        return;
      }

      setImages(data); // Yeni sonuçları yükle
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setWait(false);
    }
  };

  const handleLanguageSelection = (lang) => {
    setSearch({ ...search, lang });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-auto my-12">
      <div className="flex flex-col w-[70%] items-start justify-center p-[3%]">
        <h2 className="text-[30px] font-medium font-monserrat text-[#fff]">
          Resim Ara
        </h2>
        <form
          onSubmit={handleSearch}
          className="flex w-[80%] items-center justify-start m-4 gap-6 mt-10"
        >
          <input
            className="flex border border-[#0E0C1B] py-1 px-2"
            type="text"
            placeholder="Name"
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
            required
          />
          {/* Dil Seçimi */}
          <div className="relative">
            <button
              className="flex items-center justify-between w-full border border-[#0E0C1B] py-1 px-2 bg-[#0E0C1B] text-white text-[15px] rounded"
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown();
              }}
            >
              {search.lang === "en"
                ? "English"
                : search.lang === "ru"
                ? "Russian"
                : search.lang === "de"
                ? "German"
                : "Türkçe"}
              <span className="ml-2">▼</span>
            </button>
            {isOpen && (
              <ul className="absolute bg-white border border-[#0E0C1B] w-full z-10">
                {["en", "ru", "de", "tr"].map((lang) => (
                  <li
                    key={lang}
                    className="py-2 px-4 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleLanguageSelection(lang)}
                  >
                    {lang === "en"
                      ? "English"
                      : lang === "ru"
                      ? "Russian"
                      : lang === "de"
                      ? "German"
                      : "Türkçe"}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            disabled={wait}
            className="border text-white hover:text-[#0E0C1B] border-[#0E0C1B] py-[5px] px-[10px] bg-[#0E0C1B] hover:bg-white"
          >
            {wait ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Hata Mesajı */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Sonuçlar */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, index) => (
              <div key={index} className="w-[25%] h-auto flex flex-col border p-2">
                <img
                  src={img.firebaseUrl}
                  alt={img.altText[search.lang]}
                  className="max-w-full"
                />
                <p className="text-center text-sm mt-2">
                  {img.altText[search.lang]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchImage;
