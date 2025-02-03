import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogListele = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blog/liste");
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        setError(data.message || "Bloglar Bulunamadı");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm("Bu blogu silmek istediğinize emin misiniz?")) {
      return;
    }
    try {
      const response = await fetch(`/api/blog/sil/${id}`, {
        method: "DELETE",
      });

      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Yanıt JSON formatında değil:", e);
      }

      if (response.ok && data && data.success) {
        setBlogs(blogs.filter((blog) => blog._id !== id));
        alert(data.message || "Blog başarıyla silindi.");
      } else {
        alert((data && data.message) || "Blog silinemedi.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Bir hata oluştu.");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div className="container mx-auto px-4 pb-4 h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white my-5">Blog Listesi</h1>
      {blogs.length > 0 ? (
        <table className="min-w-full bg-white mt-10">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Başlık (TR)</th>
              <th className="py-2 px-4 border">URL'ler</th>
              <th className="py-2 px-4 border">Diller</th>
              <th className="py-2 px-4 border">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td className="py-2 px-4 border">
                  {blog.sections["tr"][0]?.title || "Başlık yok"}
                </td>
                <td className="py-2 px-4 border">
                  {/* Her dil için URL gösterimi */}
                  <div className="flex flex-col">
                    <span>
                      <strong>TR:</strong> {blog.urls?.tr || "Yok"}
                    </span>
                    <span>
                      <strong>EN:</strong> {blog.urls?.en || "Yok"}
                    </span>
                    <span>
                      <strong>RU:</strong> {blog.urls?.ru || "Yok"}
                    </span>
                    <span>
                      <strong>DE:</strong> {blog.urls?.de || "Yok"}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-4 border">
                  {["tr", "en", "ru", "de"].map((lang) => (
                    <span
                      key={lang}
                      className={`inline-block px-2 py-1 rounded mr-1 text-sm ${
                        blog.sections[lang]?.length > 0
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </span>
                  ))}
                </td>
                <td className="py-2 px-4 border">
                  {/* Düzenle Linki */}
                  <Link to={`/panel/blog/guncelle/${blog.urls.tr}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                      Düzenle
                    </button>
                  </Link>
                  {/* Silme Butonu */}
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Blog bulunamadı.</p>
      )}
    </div>
  );
};

export default BlogListele;
