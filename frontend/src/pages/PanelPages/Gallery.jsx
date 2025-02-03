import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Gallery = () => {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete image");
      }

      // Resmi frontend'den kaldır
      setImages((prevImages) => prevImages.filter((image) => image._id !== id));

      alert("Image deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>Error: {error}</p>;
//#6eaac3
  return (
    <div className="flex flex-col w-full items-center justify-start py-6 gap-4 min-h-[70vh]">
      <h2 className="font-monserrat text-[30px] font-medium text-white">Galeri</h2>
      <div className="grid grid-cols-6 gap-6 p-6 ">
      {images.map((image, index) => (
        <div key={index} className="relative group w-[240px] h-[160px] items-center justify-center">
          <img
            src={image.firebaseUrl}
            alt={image.name.en} //varsayılan en
             className="w-full h-full rounded-md object-contain"
            
          />
          <div className="absolute bottom-1 left-0 right-0 bg-black/70 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {image.name.en}
          </div>
          <button className="absolute top-2 left-2 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to={`/edit/${image._id}`}>Edit</Link>
          </button>

          <button
            onClick={() => handleDelete(image._id)}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Gallery;
