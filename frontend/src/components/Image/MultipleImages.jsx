import React, { useState, useEffect } from "react";

const MultipleImages = ({ names, lang = "en" }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/images/searchbyname?names=${names.join(",")}&lang=${lang}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Images not found");
        }

        setImages(data); 
      } catch (err) {
        setError(err.message);
      }
    };

    fetchImages();
  }, [names, lang]);

  if (error) return <p>Error: {error}</p>;
  if (images.length === 0) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center">
          <img
            src={image.firebaseUrl}
            alt={image.altText[lang]}
            className="w-full h-auto"
          />
          <p>{image.altText[lang]}</p>
        </div>
      ))}
    </div>
  );
};

export default MultipleImages;
