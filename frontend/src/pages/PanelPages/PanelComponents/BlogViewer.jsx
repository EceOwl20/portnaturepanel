// components/BlogViewer.jsx
import React from "react";

/**
 * BlogViewer bileşeni
 * @param {Object} blog - Blog nesnesi
 * @param {string} language - Seçili dil (ör: "tr", "en", vs.)
 */
const BlogViewer = ({ blog, language }) => {
  if (!blog) {
    return <p>Blog verisi yok.</p>;
  }

  // sections ve images, BlogDetails'teki gibi
  const sections = blog.sections?.[language] || [];
  const images = blog.images || [];

  // Sıralama mantığı (örnek: her section ve image'a order ekleme):
  const sectionsWithOrder = sections.map((section, index) => ({
    ...section,
    type: "section",
    order: index * 2,
  }));

  const imagesWithOrder = images.map((image, index) => ({
    src: image,
    type: "image",
    order: index * 10 + 5,
  }));

  const combinedContent = [...sectionsWithOrder, ...imagesWithOrder];
  combinedContent.sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Thumbnail */}
      {blog.thumbnail && (
        <img
          src={blog.thumbnail}
          alt={sections[0]?.title || "Blog Thumbnail"}
          className="mb-6 w-7/12"
        />
      )}

      {combinedContent.length > 0 ? (
        combinedContent.map((item, index) => {
          if (item.type === "section") {
            // Başlık seviyesini dinamik belirleme (örnek)
            let headingLevel;
            if (index <= 0) headingLevel = 1;
            else if (index <= 4) headingLevel = 2;
            else if (index <= 9) headingLevel = 3;
            else if (index <= 13) headingLevel = 4;
            else headingLevel = 5;

            const HeadingTag = `h${headingLevel}`;

            return (
              <div
                key={item._id || `section-${index}`}
                className="flex flex-col items-center gap-7 w-7/12 mb-6"
              >
                {item.title && (
                  <HeadingTag className="mb-2 text-[40px] font-lora font-medium">
                    {item.title}
                  </HeadingTag>
                )}
                {item.content && (
                  <p className="text-[14px] font-monserrat">{item.content}</p>
                )}
              </div>
            );
          } else if (item.type === "image") {
            return (
              <div key={`image-${index}`} className="w-5/12 mb-6">
                <img
                  src={item.src}
                  alt={`Blog Image ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            );
          } else {
            return null;
          }
        })
      ) : (
        <p>Bu dil için içerik bulunamadı.</p>
      )}
    </div>
  );
};

export default BlogViewer;
