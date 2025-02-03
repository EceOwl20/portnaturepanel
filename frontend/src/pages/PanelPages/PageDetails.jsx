import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const PageDetails = () => {
  const { pageName, language } = useParams();
  const [pageDetails, setPageDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const response = await fetch(
          `/api/page/${pageName}/translations/${language}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch page details");
        }

        // Yanıtın doğrudan `translations` key'i içinde olduğunu varsayalım
        setPageDetails(data.translations || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPageDetails();
  }, [pageName, language]);

  if (error) return <p>Error: {error}</p>;
  if (!pageDetails.length) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 pb-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white my-5">
        {pageName} - {language.toUpperCase()} Component Listesi
      </h1>

      {pageDetails.length > 0 ? (
        <table className="min-w-full bg-white mt-10">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Başlık</th>
              <th className="py-2 px-4 border">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pageDetails.map((component, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">{component.type}</td>
                <td className="py-2 px-4 border">
                  <Link
                    to={`/panel/pages/${pageName}/translations/${language}/components/${index}`}
                  >
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                      Düzenle
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Component bulunamadı.</p>
      )}
    </div>
  );
};

export default PageDetails;
