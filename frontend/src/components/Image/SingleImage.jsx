import React, { useState, useEffect } from "react";

const SingleImage = ({ name, lang = "en" }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `/api/images/searchbyname?names=${name}&lang=${lang}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Image not found");
        }

        setImage(data[0]); // Tek resim için ilk öğe
      } catch (err) {
        setError(err.message);
      }
    };

    fetchImage();
  }, [name, lang]);

  if (error) return <p>Error: {error}</p>;
  if (!image) return <p>Loading...</p>;

  return (
    <div>
      <img
        src={image.firebaseUrl}
        alt={image.altText[lang]}
        className="w-full h-auto"
      />
      <p>{image.altText[lang]}</p>
    </div>
  );
};

export default SingleImage;
