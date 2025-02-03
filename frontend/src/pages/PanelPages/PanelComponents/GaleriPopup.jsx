import React, { useState, useEffect } from "react";

const GaleriPopup = ({
  isModalOpen,
  handleModalToggle,
  onImageSelect,
}) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images/all");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch images");
        }

        setImages(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (!isModalOpen) return null;  // Modal kapalıysa hiç render etme
  if (loading) return <p>Loading images...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleImageClick = (image) => {
    onImageSelect(image);   // Seçilen resmi EditComponent'e gönder
    handleModalToggle();    // Galeri popup'ı kapat
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
      onClick={handleModalToggle}
    >
      <div
        className="flex flex-col w-full md:w-4/6 overflow-y-scroll h-screen md:h-[800px] bg-white items-center justify-center relative"
        onClick={(e) => e.stopPropagation()} // Tıklama olayını durdurur, böylece iç panel kapanmaz
      >
        <button
          className="absolute top-4 right-4 text-[40px]"
          onClick={handleModalToggle}
        >
          &times;
        </button>

        <div className="flex flex-col w-full items-center justify-start py-6 gap-4 min-h-[70vh]">
          <h2 className="font-monserrat text-[30px] font-medium text-black">
            Galeri
          </h2>

          <div className="grid grid-cols-4 gap-6 p-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group w-[240px] h-[160px] items-center justify-center cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.firebaseUrl}
                  alt={image.name?.en || "Image"} // Varsayılan dil: en
                  className="w-full h-full rounded-md object-contain"
                />
                <div className="absolute bottom-1 left-0 right-0 bg-black/70 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.name?.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaleriPopup;
