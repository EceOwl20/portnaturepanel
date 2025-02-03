import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GaleriPopup from "./PanelComponents/GaleriPopup";

const EditComponent = () => {
  // --------------------------------------------------
  // ROUTE PARAMS / NAVIGATION
  // --------------------------------------------------
  const { pageName, componentIndex, language } = useParams();
  const navigate = useNavigate();

  const supportedLanguages = ["en", "tr", "de", "ru"];

  // --------------------------------------------------
  // STATE: COMPONENT DATA, ERROR, SUCCESS
  // --------------------------------------------------
  const [componentData, setComponentData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // --------------------------------------------------
  // STATE: SEARCH QUERIES & RESULTS (General / Items / SubImages / Filter / Restaurant)
  // --------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [subImageSearchQuery, setSubImageSearchQuery] = useState("");
  const [subImageSearchResults, setSubImageSearchResults] = useState([]);

  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [itemSearchResults, setItemSearchResults] = useState([]);

  const [filterImageSearchQuery, setFilterImageSearchQuery] = useState("");
  const [filterImageSearchResults, setFilterImageSearchResults] = useState([]);

  const [restaurantImageSearchQuery, setRestaurantImageSearchQuery] =
    useState("");
  const [restaurantImageSearchResults, setRestaurantImageSearchResults] =
    useState([]);

  // --------------------------------------------------
  // STATE: GALERİ OPEN/CLOSE
  // --------------------------------------------------
  const [isGaleriOpen, setGaleriOpen] = useState(false);
  // #### EKLENDİ: Hangi alanı güncelleyeceğimizi tutan state
  const [activeField, setActiveField] = useState(null);

  // #### EKLENDİ: Galeri üzerinden seçilen resmi "activeField"’e göre ekle
  const handleGalleryImageSelect = (selectedImage) => {
    if (activeField === "singleImage") {
      setComponentData((prev) => ({
        ...prev,
        props: {
          ...prev.props,
          image: {
            ...prev.props.image,
            firebaseUrl: selectedImage.firebaseUrl,
            altText: selectedImage.altText,
          },
        },
      }));
    } else if (activeField === "singleImage2") {
      setComponentData((prev) => ({
        ...prev,
        props: {
          ...prev.props,
          image2: {
            ...prev.props.image2, // image2'yi doğru şekilde güncelliyoruz
            firebaseUrl: selectedImage.firebaseUrl,
            altText: selectedImage.altText,
          },
        },
      }));
    } else if (activeField === "singleIconImage") {
      setComponentData((prev) => ({
        ...prev,
        props: {
          ...prev.props,
          iconImage: {
            ...prev.props.iconImage,
            firebaseUrl: selectedImage.firebaseUrl,
            altText: selectedImage.altText,
          },
        },
      }));
    } else if (activeField === "singleIconImage2") {
      setComponentData((prev) => ({
        ...prev,
        props: {
          ...prev.props,
          iconImage2: {
            ...prev.props.iconImage2,
            firebaseUrl: selectedImage.firebaseUrl,
            altText: selectedImage.altText,
          },
        },
      }));
    } else if (activeField?.type === "images") {
      handleReplaceImage("images", activeField.index, selectedImage);
    } else if (activeField?.type === "subImages") {
      handleReplaceImage("subImages", activeField.index, selectedImage);
    } else if (activeField?.type === "items") {
      handleReplaceImage("items", activeField.index, selectedImage);
    } else if (activeField?.type === "restaurantItems") {
      const { index } = activeField; // RestaurantItems için index kontrolü
      setComponentData((prev) => {
        const updatedRestaurantItems = [...prev.props.restaurantItems];
        updatedRestaurantItems[index] = {
          ...updatedRestaurantItems[index],
          image: {
            firebaseUrl: selectedImage.firebaseUrl,
            altText: selectedImage.altText,
          },
        };

        return {
          ...prev,
          props: {
            ...prev.props,
            restaurantItems: updatedRestaurantItems,
          },
        };
      });
    }

    setGaleriOpen(false);
  };

  // --------------------------------------------------
  // useEffect: FETCH COMPONENT DATA ON MOUNT
  // --------------------------------------------------
  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const response = await fetch(
          `/api/page/${pageName}/translations/${language}/components/${componentIndex}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Data fetch failed.");
        setComponentData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchComponentData();
  }, [pageName, language, componentIndex]);

  // --------------------------------------------------
  // useEffect: SEARCH QUERY DEBOUNCING (searchQuery)
  // --------------------------------------------------
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      handleSearch(); // her 300ms sonrasında arama
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // --------------------------------------------------
  // useEffect: SEARCH QUERY DEBOUNCING (itemSearchQuery)
  // --------------------------------------------------
  useEffect(() => {
    if (!itemSearchQuery) {
      setItemSearchResults([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      handleItemSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [itemSearchQuery]);

  // ------------restaurant-------------

  useEffect(() => {
    if (!restaurantImageSearchQuery) {
      setRestaurantImageSearchResults([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      handleRestaurantImageSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [restaurantImageSearchQuery]);

  // --------------------------------------------------
  // GALERİ OPEN/CLOSE HANDLER
  // --------------------------------------------------
  const handleGaleriToggle = () => {
    setGaleriOpen(!isGaleriOpen);
  };

  // --------------------------------------------------
  // HANDLERS: INPUT & ARRAY MODIFICATIONS
  // --------------------------------------------------
  const handleInputChange = (field, value) => {
    setComponentData((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setComponentData((prev) => {
      const updatedArray = [...prev.props[field]];
      updatedArray[index] = { ...updatedArray[index], [key]: value };

      return {
        ...prev,
        props: {
          ...prev.props,
          [field]: updatedArray,
        },
      };
    });
  };

  const handleAltTextChange = (fieldType, index, lang, value) => {
    setComponentData((prev) => {
      const updatedField = [...prev.props[fieldType]];
      updatedField[index].altText[lang] = value; // Seçili dilin alt metnini güncelle
      return {
        ...prev,
        props: {
          ...prev.props,
          [fieldType]: updatedField,
        },
      };
    });
  };

  const handleHeaderChange = (field, index, lang, value) => {
    setComponentData((prev) => {
      const updatedArray = [...prev.props[field]];
      updatedArray[index].header = value;

      return {
        ...prev,
        props: {
          ...prev.props,
          [field]: updatedArray,
        },
      };
    });
  };

  const handleArrayHeaderChange = (field, index, value) => {
    setComponentData((prev) => {
      const updatedArray = [...prev.props[field]];

      // Sadece string olan değeri güncelliyoruz.
      if (typeof updatedArray[index] === "string") {
        updatedArray[index] = value;
      } else {
        console.warn(
          `Expected string but got ${typeof updatedArray[
            index
          ]} at index ${index}`
        );
      }

      return {
        ...prev,
        props: {
          ...prev.props,
          [field]: updatedArray,
        },
      };
    });
  };

  // const handleTextChange = (field, index, lang, value) => {
  //   setComponentData((prev) => {
  //     const updatedArray = [...prev.props[field]];
  //     updatedArray[index].text[lang] = value;

  //     return {
  //       ...prev,
  //       props: {
  //         ...prev.props,
  //         [field]: updatedArray,
  //       },
  //     };
  //   });
  // };

  const handleTextChange = (field, index, value) => {
    setComponentData((prev) => {
      const updatedArray = [...prev.props[field]];
      updatedArray[index].text = value; // ✅ DOĞRUDAN STRING OLARAK ATAMA YAPILDI
  
      return {
        ...prev,
        props: {
          ...prev.props,
          [field]: updatedArray,
        },
      };
    });
  };
  

  const handleDelayChange = (field) => {
    setComponentData((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        delay: field,
      },
    }));
  };

  // --------------------------------------------------
  // HANDLERS: SINGLE IMAGE UPDATES
  // --------------------------------------------------
  const handleImageUrlChange = (value) => {
    setComponentData((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        image: {
          ...prev.props.image,
          firebaseUrl: value,
        },
      },
    }));
  };

  const handleImageAltTextChange = (field, lang, value) => {
    setComponentData((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        [field]: {
          ...prev.props[field],
          altText: {
            ...prev.props[field].altText,
            [lang]: value,
          },
        },
      },
    }));
  };

  // const handleLangFieldChange = (field, lang, value) => {
  //   setComponentData((prev) => ({
  //     ...prev,
  //     props: {
  //       ...prev.props,
  //       [field]: {
  //         ...prev.props[value],
  //       },
  //     },
  //   }));
  // };

  const handleFieldChange = (fieldName, value) => {
    setComponentData((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        [fieldName]: value,
      },
    }));
  };

  const handleAutoplayChange = (newValue) => {
    setComponentData((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        autoplay: newValue,
      },
    }));
  };

  const handleAddItem = (field) => {
    setComponentData((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        [field]: [
          ...prev.props[field],
          field === "images" || field === "subImages"
            ? {
                firebaseUrl: "",
                altText: "",
                width: 0,
                height: 0,
              }
            : field === "headers"
            ? "" // Headers için yeni string ekliyoruz
            : { en: "", tr: "", de: "", ru: "" },
        ],
      },
    }));
  };  

  // --------------------------------------------------
  // HANDLERS: SEARCH
  // --------------------------------------------------
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/images/search?name=${searchQuery}&lang=en`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image not found");
      }
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubImageSearch = async () => {
    try {
      const response = await fetch(
        `/api/images/search?name=${subImageSearchQuery}&lang=en`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "SubImage not found");
      }
      setSubImageSearchResults([data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleItemSearch = async () => {
    try {
      const response = await fetch(
        `/api/images/search?name=${itemSearchQuery}&lang=en`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Item not found");
      }
      setItemSearchResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterImageSearch = async () => {
    try {
      const response = await fetch(
        `/api/images/search?name=${filterImageSearchQuery}&lang=en`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image not found");
      }
      setFilterImageSearchResults([data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestaurantImageSearch = async () => {
    try {
      const response = await fetch(
        `/api/images/search?name=${restaurantImageSearchQuery}&lang=en`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image not found");
      }
      setRestaurantImageSearchResults([data]);
    } catch (err) {
      setError(err.message);
    }
  };

  // --------------------------------------------------
  // HANDLERS: REPLACE IMAGE
  // --------------------------------------------------
  const handleReplaceSingleImage = (field, selectedImage) => {
    setComponentData((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        [field]: {
          ...prev.props[field],
          firebaseUrl: selectedImage.firebaseUrl,
          altText: selectedImage.altText[language],
        },
      },
    }));
  };

  const handleReplaceImage = (field, index, selectedImage) => {
    handleArrayChange(field, index, "firebaseUrl", selectedImage.firebaseUrl);
    handleArrayChange(field, index, "altText", selectedImage.altText);
  };

  const handleReplaceFilterItemImage = (index, field, selectedImage) => {
    setComponentData((prev) => {
      const updatedArray = [...prev.props.filterItems];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: {
          ...updatedArray[index][field],
          firebaseUrl: selectedImage.firebaseUrl,
          altText: selectedImage.altText[language],
        },
      };
      return {
        ...prev,
        props: {
          ...prev.props,
          filterItems: updatedArray,
        },
      };
    });
  };

  // const handleReplaceRestaurantItemImage = (index, field, selectedImage) => {
  //   setComponentData((prev) => {
  //     const updatedArray = [...prev.props.restaurantItems];
  //     updatedArray[index] = {
  //       ...updatedArray[index],
  //       [field]: {
  //         ...updatedArray[index][field],
  //         firebaseUrl: selectedImage.firebaseUrl,
  //         altText: selectedImage.altText[language],
  //       },
  //     };
  //     return {
  //       ...prev,
  //       props: {
  //         ...prev.props,
  //         restaurantItems: updatedArray,
  //       },
  //     };
  //   });
  // };

  const handleReplaceRestaurantItemImage = (field, index, selectedImage) => {
    handleArrayChange(field, index, "firebaseUrl", selectedImage.firebaseUrl);
    handleArrayChange(field, index, "altText", selectedImage.altText);
  };

  // --------------------------------------------------
  // HANDLERS: SAVE CHANGES
  // --------------------------------------------------
  const handleSave = async () => {
    try {
      const response = await fetch(
        `/api/page/${pageName}/translations/${language}/components/${componentIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(componentData),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Save failed.");
      }
      setSuccess(true);
      alert("Component updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  // --------------------------------------------------
  // HANDLERS: ITEM CRUD
  // --------------------------------------------------
  const handleItemInputChange = (field, index, key, value) => {
    setComponentData((prev) => {
      const updatedItems = [...prev.props.items];
      updatedItems[index] = { ...updatedItems[index], [key]: value };

      return {
        ...prev,
        props: {
          ...prev.props,
          [field]: updatedItems,
        },
      };
    });
  };

  const handleItemTextChange = (field, index, lang, value) => {
    setComponentData((prev) => {
      const updatedItems = [...prev.props.items];
      updatedItems[index].text = value;

      return {
        ...prev,
        props: {
          ...prev.props,
          [field]: updatedItems,
        },
      };
    });
  };

  const handleAddNewItem = () => {
    setComponentData((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        items: [
          ...(prev.props.items || []),
          {
            firebaseUrl: "",
            text: { en: "", tr: "", de: "", ru: "" },
            largeWidth: 0,
            largeHeight: 0,
            smallWidth: 0,
            smallHeight: 0,
          },
        ],
      },
    }));
  };

  const handleRemove = async (field, index) => {
    if (!pageName || !language || componentIndex === undefined || index === undefined) {
      console.error("🔴 Eksik parametreler! Silme işlemi yapılamadı.");
      return;
    }
  
    // Silme API endpoint'ini belirleme
    let apiEndpoint;
    if (field === "items") {
      apiEndpoint = `/api/page/${pageName}/translations/${language}/components/${componentIndex}/items/${index}`;
    } else if (field === "images") {
      apiEndpoint = `/api/page/${pageName}/translations/${language}/components/${componentIndex}/images/${index}`;
    } else {
      console.error("❌ Geçersiz field:", field);
      return;
    }
  
    try {
      console.log(`🟡 Silme isteği gönderiliyor: ${field}, Index: ${index}, Component Index: ${componentIndex}`);
  
      const response = await fetch(apiEndpoint, { method: "DELETE" });
  
      if (!response.ok) {
        const data = await response.json();
        console.error(`❌ ${field} silme başarısız:`, data.message);
        throw new Error(data.message || `Failed to delete ${field}`);
      }
  
      // State'i güncelle (items veya images'den kaldır)
      setComponentData((prev) => ({
        ...prev,
        props: {
          ...prev.props,
          [field]: prev.props[field].filter((_, i) => i !== index),
        },
      }));
  
      console.log(`✅ ${field} başarıyla silindi!`);
  
    } catch (err) {
      console.error(`❌ Error deleting ${field}:`, err);
    }
  };
  
  


  const handleRemoveHeader = async (index) => {
    // Kullanıcıya onay mesajı göster
    const confirmDelete = window.confirm("Bu başlığı silmek istediğinizden emin misiniz?");
    
    // Eğer kullanıcı "Vazgeç" derse, işlem iptal edilir.
    if (!confirmDelete) {
      console.log("🛑 Kullanıcı iptal etti, silme işlemi yapılmadı.");
      return;
    }
  
    try {
      console.log(`🔵 Silme isteği gönderiliyor... Header Index: ${index}`);
  
      const response = await fetch(
        `/api/page/${pageName}/translations/${language}/components/${componentIndex}/headers/${index}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete header");
      }
  
      // UI'dan header'ı kaldır
      setComponentData((prev) => ({
        ...prev,
        props: {
          ...prev.props,
          headers: prev.props.headers.filter((_, i) => i !== index),
        },
      }));
  
      console.log("✅ Header başarıyla silindi!");
  
    } catch (err) {
      console.error("❌ Error deleting header:", err);
    }
  };
  
  

  const renderComponentPreview = (data) => {
    switch (data.type) {
      case "Carousel":
        return (
          <Carousel
            images={data.props.images || []}
            delay={data.props.delay || 3000}
            autoplay={data.props.autoplay || false}
          />
        );
      case "ImageWithText":
        return (
          <div className="flex flex-col items-center">
            <img
              src={data.props.image?.firebaseUrl || ""}
              alt={data.props.image?.altText || "Image"}
              className="w-full max-w-md rounded"
            />
            <h3 className="mt-4 text-xl font-semibold">{data.props.header}</h3>
            <p className="mt-2 text-gray-600">{data.props.text}</p>
          </div>
        );
      default:
        return <p>No preview available for this component type.</p>;
    }
  };

  // --------------------------------------------------
  // EARLY RETURNS IF NO DATA OR ERROR
  // --------------------------------------------------
  if (error) return <p>Error: {error}</p>;
  if (!componentData) return <p>Loading...</p>;

  // --------------------------------------------------
  // DESTRUCTURING FOR SINGLE FIELDS
  // --------------------------------------------------
  const singleImage = componentData.props.image;
  const singleImage2 = componentData.props.image2;
  const singleButtonImage = componentData.props.singleButtonImage;
  const singleButtonText = componentData.props.buttonText;
  const singleButtonText2 = componentData.props.buttonText2;
  const singleButtonText3 = componentData.props.buttonText3;
  const singleButtonLink = componentData.props.buttonLink;
  const singleButtonLink2 = componentData.props.buttonLink2;
  const singleButtonLink3 = componentData.props.buttonLink3;
  const singleHeader = componentData.props.header;
  const singleText = componentData.props.text;
  const singleText2 = componentData.props.text2;
  const singleSpan = componentData.props.span;
  const singleDelay = componentData.props.delay;
  const singleAutoplay = componentData.props.autoplay;
  const singleIconImage = componentData.props.iconImage;
  const singleIconImage2 = componentData.props.iconImage2;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div className="flex flex-col items-start font-monserrat z-50 bg-transparent justify-start m-5">
      <div className="flex flex-row items-center justify-between w-full">
        <h1 className="text-[25px] font-medium my-4 text-[#ffffff]">
          Edit Component: {componentData.type}
        </h1>
        {/* Dil Butonları */}
        <div className="flex gap-2">
          {supportedLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() =>
                navigate(
                  `/panel/pages/${pageName}/translations/${lang}/components/${componentIndex}`
                )
              }
              className={`px-4 py-2 rounded ${
                lang === language ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* GRID WRAPPER */}
      <div className="grid grid-cols-2 items-start justify-center w-[40%] gap-[2%]">
        {/* GALERİ POPUP */}
        {isGaleriOpen && (
          <GaleriPopup
            isModalOpen={isGaleriOpen}
            handleModalToggle={handleGaleriToggle}
            onImageSelect={handleGalleryImageSelect}
          />
        )}

        {/* DİĞER PROP KEY'LERİNİN DÜZENLENMESİ */}
        {Object.keys(componentData.props || {}).map((key) => {
          const value = componentData.props[key];

          // Bu alanların alt tarafta özel UI'ları var; o yüzden burada göstermiyoruz
          if (
            key === "images" ||
            key === "subImages" ||
            key === "headers" ||
            key === "texts" ||
            key === "links" ||
            key === "items" ||
            key === "image" ||
            key === "image2" ||
            key === "buttonImage" ||
            key === "buttonText" ||
            key === "buttonText2" ||
            key === "buttonText3" ||
            key === "buttonLink" ||
            key === "buttonLink2" ||
            key === "buttonLink3" ||
            key === "header" ||
            key === "text" ||
            key === "text2" ||
            key === "span" ||
            key === "iconImage" ||
            key === "iconImage2" ||
            key === "autoplay" ||
            key === "delay"
          ) {
            return null;
          }

          // Eğer value dört dilli bir obje ise (en, tr, de, ru)
          const isLangObject =
            value &&
            typeof value === "object" &&
            ["en", "tr", "de", "ru"].every((lang) =>
              value.hasOwnProperty(lang)
            );

          if (isLangObject) {
            return (
              <div
                key={key}
                className="flex flex-col gap-2 border p-4 rounded-md mt-4 w-full"
              >
                <h3 className="font-bold text-lg">{key} (Multi-language)</h3>
                {Object.keys(value).map((lang) => (
                  <div key={lang} className="flex flex-col gap-2">
                    <label className="text-black text-[18px] font-semibold">
                      {key} ({lang})
                    </label>
                    <input
                      type="text"
                      value={value[lang]}
                      onChange={(e) => {
                        setComponentData((prev) => ({
                          ...prev,
                          props: {
                            ...prev.props,
                            [key]: {
                              ...prev.props[key],
                              [lang]: e.target.value,
                            },
                          },
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            );
          }
          // else {
          //   // Basit string/number ise
          //   return (
          //     <div
          //       key={key}
          //       className="flex flex-col gap-2 border p-4 rounded-md mt-4 w-full bg-white"
          //     >
          //       <label className="text-black text-[13px] font-semibold">
          //         {key}
          //       </label>
          //       <input
          //         className="border p-2 text-[10px]"
          //         type="text"
          //         value={componentData.props[key]}
          //         onChange={(e) => handleInputChange(key, e.target.value)}
          //       />
          //     </div>
          //   );
          // }
        })}

        {/* --------------- SINGLE IMAGE 1 --------------- */}
        {singleImage && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[16px]">Single Image</h2>
            <label className="font-semibold hidden">Firebase URL</label>
            <input
              type="text"
              value={singleImage.firebaseUrl || ""}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="border p-2 hidden"
            />

            {singleImage.firebaseUrl && (
              <img
                src={singleImage.firebaseUrl}
                alt="Preview"
                className="w-[200px] h-auto object-contain mt-2 border rounded"
              />
            )}

            <button
              className="bg-blue-600 text-white px-2 py-1 w-[80%] rounded mt-2 text-[12px]"
              onClick={() => {
                setActiveField("singleImage"); // “image” alanını güncelleyeceğimizi belirt
                setGaleriOpen(true); // popup’ı aç
              }}
            >
              Galeri Aç
            </button>

            <h3 className="font-semibold mt-4 text-[15px]">Alt Text </h3>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Alt Text ({language})</label>
              <input
                type="text"
                value={singleImage.altText[language] || ""}
                onChange={(e) => handleImageAltTextChange(e.target.value)}
                className="border p-2 text-[12px]"
              />
            </div>
          </div>
        )}

        {/* Search for a new image for Image1 */}
        {/* {singleImage && (
          <div className="flex flex-col gap-2 items-center mt-4">
            <label className="text-[#e45252] text-[18px] font-semibold">
              Search for a new image for Image1
            </label>
            <input
              type="text"
              placeholder="Enter image name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border py-2 px-3 w-[50%]"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>

            {searchResults.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <h4>Search Results</h4>
                {searchResults.map((result, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border p-2 rounded-md cursor-pointer"
                    onClick={() => handleReplaceSingleImage("image", result)}
                  >
                    <img
                      src={result.firebaseUrl}
                      alt={result.altText.en}
                      className="w-16 h-16 object-cover"
                    />
                    <p>{result.altText.en}</p>
                  </div>
                ))}
              </div>
            )}
          </div> 
        )}*/}

        {/* --------------- SINGLE IMAGE 2 --------------- */}
        {singleImage2 && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[16px]">Single Image</h2>
            <label className="font-semibold hidden">Firebase URL</label>
            <input
              type="text"
              value={singleImage2.firebaseUrl || ""}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="border p-2 hidden"
            />

            {singleImage2.firebaseUrl && (
              <img
                src={singleImage2.firebaseUrl}
                alt="Preview"
                className="w-[200px] h-auto object-contain mt-2 border rounded"
              />
            )}

            <button
              className="bg-blue-600 text-white px-2 py-1 w-[80%] rounded mt-2 text-[12px]"
              onClick={() => {
                setActiveField("singleImage2"); // “image” alanını güncelleyeceğimizi belirt
                setGaleriOpen(true); // popup’ı aç
              }}
            >
              Galeri Aç
            </button>

            <h3 className="font-semibold mt-4 text-[15px]">Alt Text </h3>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Alt Text </label>
              <input
                type="text"
                value={singleImage2.altText}
                onChange={(e) => handleImageAltTextChange(e.target.value)}
                className="border p-2 text-[12px]"
              />
            </div>
          </div>
        )}

        {/* --------------- ICON IMAGE --------------- */}
        {singleIconImage && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[16px]">IconImage</h2>
            <label className="font-semibold hidden">Firebase URL</label>
            <input
              type="text"
              value={singleIconImage.firebaseUrl || ""}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="border p-2 text-[12px] hidden"
            />
            {singleIconImage.firebaseUrl && (
              <img
                src={singleIconImage.firebaseUrl}
                alt="Preview"
                className="w-24 h-auto object-contain mt-2 border rounded"
              />
            )}
            <button
              className="bg-blue-600 text-white px-2 py-1 w-[80%] rounded mt-2 text-[12px]"
              onClick={() => {
                setActiveField("singleIconImage"); // “image” alanını güncelleyeceğimizi belirt
                setGaleriOpen(true); // popup’ı aç
              }}
            >
              Galeri Aç
            </button>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-semibold">Alt Text </label>
              <input
                type="text"
                value={singleIconImage.altText}
                onChange={(e) => handleImageAltTextChange(e.target.value)}
                className="border p-2 font-normal text-[12px]"
              />
            </div>
          </div>
        )}

        {/* {singleIconImage && (
          <div className="flex flex-col gap-2 items-center mt-4">
            <label className="text-[#e45252] text-[18px] font-semibold">
              Search for a new image for IconImage
            </label>
            <input
              type="text"
              placeholder="Enter image name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border py-2 px-3 w-[50%]"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>

            {searchResults.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <h4>Search Results</h4>
                {searchResults.map((result, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border p-2 rounded-md cursor-pointer"
                    onClick={() =>
                      handleReplaceSingleImage("iconImage", result)
                    }
                  >
                    <img
                      src={result.firebaseUrl}
                      alt={result.altText.en}
                      className="w-16 h-16 object-cover"
                    />
                    <p>{result.altText.en}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )} */}

        {/* --------------- ICON IMAGE 2 --------------- */}
        {singleIconImage2 && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-xl">IconImage 2</h2>
            <label className="font-semibold hidden ">Firebase URL</label>
            <input
              type="text"
              value={singleIconImage2.firebaseUrl || ""}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="border p-2 text-[12px] hidden"
            />

            {singleIconImage2.firebaseUrl && (
              <img
                src={singleIconImage2.firebaseUrl}
                alt="Preview"
                className="w-24 h-auto object-contain mt-2 border rounded"
              />
            )}
            <button
              className="bg-blue-600 text-white px-2 py-1 w-[80%] rounded mt-2 text-[12px]"
              onClick={() => {
                setActiveField("singleIconImage2"); // “image” alanını güncelleyeceğimizi belirt
                setGaleriOpen(true); // popup’ı aç
              }}
            >
              Galeri Aç
            </button>

            <h3 className="font-semibold mt-4">Alt Text</h3>
            <div className="flex flex-col gap-2">
              <label>Alt Text </label>
              <input
                type="text"
                value={singleIconImage2.altText}
                onChange={(e) => handleImageAltTextChange(e.target.value)}
                className="border p-2"
              />
            </div>
          </div>
        )}

        {/* --------------- BUTTON IMAGE & TEXT --------------- */}
        {singleButtonImage && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-xl">Single Image</h2>
            <label className="font-semibold">Firebase URL</label>
            <input
              type="text"
              value={singleButtonImage.firebaseUrl || ""}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="border p-2"
            />

            <h3 className="font-semibold mt-4">Alt Text </h3>

            <div className="flex flex-col gap-2">
              <label>Alt Text </label>
              <input
                type="text"
                value={singleButtonImage.altText}
                onChange={(e) => handleImageAltTextChange(e.target.value)}
                className="border p-2"
              />
            </div>
          </div>
        )}

        {singleButtonText && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[15px]">Button Text </h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Button Text </label>
              <input
                type="text"
                value={singleButtonText}
                onChange={(e) =>
                  handleFieldChange("buttonText", e.target.value)
                }
                className="border p-2 text-[12px]"
              />
            </div>
          </div>
        )}

        {singleButtonText2 && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[15px]">Button Text 2</h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Button Text 2</label>
              <input
                type="text"
                value={singleButtonText2}
                onChange={(e) =>
                  handleFieldChange("buttonText2", e.target.value)
                }
                className="border p-2 text-[12px]"
              />
            </div>
          </div>
        )}

        {singleButtonText3 && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[15px]">Button Text 3</h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Button Text 3</label>
              <input
                type="text"
                value={singleButtonText3}
                onChange={(e) =>
                  handleFieldChange("buttonText3", e.target.value)
                }
                className="border p-2 text-[12px]"
              />
            </div>
          </div>
        )}

        {singleButtonLink && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[15px]">Button Link </h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Button Link </label>
              <input
                type="text"
                value={singleButtonLink}
                onChange={(e) =>
                  handleFieldChange("buttonLink", e.target.value)
                }
                className="border p-2 text-[12px]"
              />
            </div>
          </div>
        )}

        {singleButtonLink2 && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[15px]">Button Link 2 </h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Button Link 2 </label>
              <input
                type="text"
                value={singleButtonLink2}
                onChange={(e) =>
                  handleFieldChange("buttonLink2", e.target.value)
                }
                className="border p-2 text-[12px]"
              />
            </div>
          </div>
        )}

        {singleButtonLink3 && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[15px]">Button Link 3</h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Button Link 3</label>
              <input
                type="text"
                value={singleButtonLink3}
                onChange={(e) =>
                  handleFieldChange("buttonLink3", e.target.value)
                }
                className="border p-2 text-[12px]"
              />
            </div>
          </div>
        )}

        {/* --------------- SINGLE HEADER --------------- */}
        {singleHeader && (
          <div className="flex flex-col gap-4 w-[100%] p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[12px]">Header </h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Header </label>
              <input
                type="text"
                value={singleHeader}
                onChange={(e) => handleFieldChange("header", e.target.value)}
                className="border p-2 text-[10px]"
              />
            </div>
          </div>
        )}

        {/* --------------- SINGLE TEXT --------------- */}
        {singleText && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white text-black">
            <h2 className="font-bold text-[12px]">Text </h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Text </label>
              <input
                type="text"
                value={singleText}
                onChange={(e) => handleFieldChange("text", e.target.value)}
                className="border p-2 text-[10px]"
              />
            </div>
          </div>
        )}

        {/* --------------- SINGLE TEXT 2--------------- */}
        {singleText2 && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white text-black">
            <h2 className="font-bold text-[12px]">Text 2</h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Text 2</label>
              <input
                type="text"
                value={singleText2}
                onChange={(e) => handleFieldChange("text", e.target.value)}
                className="border p-2 text-[10px]"
              />
            </div>
          </div>
        )}

        {/* --------------- SINGLE SPAN --------------- */}
        {singleSpan && (
          <div className="flex flex-col gap-4 w-full border p-4 rounded my-4 bg-white">
            <h2 className="font-bold text-[12px]">Span </h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px]">Span Text </label>
              <input
                type="text"
                value={singleSpan}
                onChange={(e) => handleFieldChange("span", e.target.value)}
                className="border p-2 text-[10px]"
              />
            </div>
          </div>
        )}

        {/* --------------- DELAY & AUTOPLAY --------------- */}
        {(singleDelay !== undefined || singleAutoplay !== undefined) && (
          <div className="flex flex-col border p-3 mt-4 justify-center items-center bg-white rounded">
            {/* SINGLE DELAY */}
            {singleDelay !== undefined && (
              <div className="flex flex-col gap-4 w-full">
                <h2 className="font-bold text-[15px]">Delay</h2>
                <label className="text-[12px]">Delay (saniye)</label>
                <input
                  type="text"
                  value={singleDelay / 1000}
                  onChange={(e) => handleDelayChange(e.target.value * 1000)}
                  className="border p-2 text-[10px]"
                />
              </div>
            )}

            {/* SINGLE AUTOPLAY */}
            {singleAutoplay !== undefined && (
              <div className="flex flex-col gap-4 w-full my-4">
                <h2 className="font-bold text-[15px]">Autoplay</h2>
                <label className="font-semibold text-[12px]">Autoplay</label>
                <select
                  value={singleAutoplay ? "true" : "false"}
                  onChange={(e) =>
                    handleAutoplayChange(e.target.value === "true")
                  }
                  className="border p-2 text-[10px]"
                >
                  <option className="text-[10px]" value="true">
                    true
                  </option>
                  <option className="text-[10px]" value="false">
                    false
                  </option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --------------- FILTER ITEMS --------------- */}
      {componentData.props.filterItems?.length > 0 && (
        <div className="flex flex-col gap-4 w-full mt-8">
          <h2 className="text-[20px] text-[#0e0c1b] font-semibold ml-2">
            Filter Items
          </h2>
          {componentData.props.filterItems.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-md flex flex-col gap-2"
            >
              <h3>Filter Item {index + 1}</h3>

              {/* image alanı */}
              <label className="font-semibold text-[16px]">Image URL</label>
              <input
                type="text"
                value={item.image?.firebaseUrl || ""}
                onChange={(e) => {
                  const updatedArray = [...componentData.props.filterItems];
                  updatedArray[index] = {
                    ...updatedArray[index],
                    image: {
                      ...updatedArray[index].image,
                      firebaseUrl: e.target.value,
                    },
                  };
                  setComponentData((prev) => ({
                    ...prev,
                    props: {
                      ...prev.props,
                      filterItems: updatedArray,
                    },
                  }));
                }}
              />

              {/* Search for a new main image */}
              <div className="flex flex-col gap-2 items-center my-2">
                <label className="text-black text-[18px] font-semibold">
                  Search for a new image
                </label>
                <input
                  type="text"
                  placeholder="Enter image name"
                  value={filterImageSearchQuery}
                  onChange={(e) => setFilterImageSearchQuery(e.target.value)}
                  className="border py-2 px-3 w-[50%]"
                />
                <button
                  onClick={handleFilterImageSearch}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Search
                </button>

                {filterImageSearchResults.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <h4>Search Results</h4>
                    {filterImageSearchResults.map((result, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 border p-2 rounded-md cursor-pointer"
                        onClick={() =>
                          handleReplaceFilterItemImage(index, "image", result)
                        }
                      >
                        <img
                          src={result.firebaseUrl}
                          alt={result.altText.en}
                          className="w-16 h-16 object-cover"
                        />
                        <p>{result.altText.en}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* image altText */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">AltText</label>
                <input
                  type="text"
                  value={item.image.altText}
                  onChange={(e) => {
                    const updatedArray = [...componentData.props.filterItems];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      image: {
                        ...updatedArray[index].image,
                        altText: {
                          ...updatedArray[index].image.altText,
                          [lang]: e.target.value,
                        },
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        filterItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* iconImage alanı */}
              <label className="font-semibold text-[16px] mt-4">
                Icon Image URL
              </label>
              <input
                type="text"
                value={item.iconImage?.firebaseUrl || ""}
                onChange={(e) => {
                  const updatedArray = [...componentData.props.filterItems];
                  updatedArray[index] = {
                    ...updatedArray[index],
                    iconImage: {
                      ...updatedArray[index].iconImage,
                      firebaseUrl: e.target.value,
                    },
                  };
                  setComponentData((prev) => ({
                    ...prev,
                    props: {
                      ...prev.props,
                      filterItems: updatedArray,
                    },
                  }));
                }}
              />

              {/* iconImage altText */}

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Icon AltText</label>
                <input
                  type="text"
                  value={item.iconImage.altText}
                  onChange={(e) => {
                    const updatedArray = [...componentData.props.filterItems];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      iconImage: {
                        ...updatedArray[index].iconImage,
                        altText: {
                          ...updatedArray[index].iconImage.altText,
                          [lang]: e.target.value,
                        },
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        filterItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* iconImage dimensions */}
              <div className="flex gap-2 mt-2">
                <div className="flex flex-col w-[50%]">
                  <label className="text-sm font-semibold">largeWidth</label>
                  <input
                    type="number"
                    value={item.iconImage?.largeWidth || 0}
                    onChange={(e) => {
                      const updatedArray = [...componentData.props.filterItems];
                      updatedArray[index] = {
                        ...updatedArray[index],
                        iconImage: {
                          ...updatedArray[index].iconImage,
                          largeWidth: Number(e.target.value),
                        },
                      };
                      setComponentData((prev) => ({
                        ...prev,
                        props: {
                          ...prev.props,
                          filterItems: updatedArray,
                        },
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-col w-[50%]">
                  <label className="text-sm font-semibold">largeHeight</label>
                  <input
                    type="number"
                    value={item.iconImage?.largeHeight || 0}
                    onChange={(e) => {
                      const updatedArray = [...componentData.props.filterItems];
                      updatedArray[index] = {
                        ...updatedArray[index],
                        iconImage: {
                          ...updatedArray[index].iconImage,
                          largeHeight: Number(e.target.value),
                        },
                      };
                      setComponentData((prev) => ({
                        ...prev,
                        props: {
                          ...prev.props,
                          filterItems: updatedArray,
                        },
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <div className="flex flex-col w-[50%]">
                  <label className="text-sm font-semibold">smallWidth</label>
                  <input
                    type="number"
                    value={item.iconImage?.smallWidth || 0}
                    onChange={(e) => {
                      const updatedArray = [...componentData.props.filterItems];
                      updatedArray[index] = {
                        ...updatedArray[index],
                        iconImage: {
                          ...updatedArray[index].iconImage,
                          smallWidth: Number(e.target.value),
                        },
                      };
                      setComponentData((prev) => ({
                        ...prev,
                        props: {
                          ...prev.props,
                          filterItems: updatedArray,
                        },
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-col w-[50%]">
                  <label className="text-sm font-semibold">smallHeight</label>
                  <input
                    type="number"
                    value={item.iconImage?.smallHeight || 0}
                    onChange={(e) => {
                      const updatedArray = [...componentData.props.filterItems];
                      updatedArray[index] = {
                        ...updatedArray[index],
                        iconImage: {
                          ...updatedArray[index].iconImage,
                          smallHeight: Number(e.target.value),
                        },
                      };
                      setComponentData((prev) => ({
                        ...prev,
                        props: {
                          ...prev.props,
                          filterItems: updatedArray,
                        },
                      }));
                    }}
                  />
                </div>
              </div>

              {/* header (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Header</label>
                <input
                  type="text"
                  value={item.header}
                  onChange={(e) => {
                    const updatedArray = [...componentData.props.filterItems];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      header: {
                        ...updatedArray[index].header,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        filterItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* text (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Text</label>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => {
                    const updatedArray = [...componentData.props.filterItems];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      text: {
                        ...updatedArray[index].text,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        filterItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* buttonText (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Button Text</label>
                <input
                  type="text"
                  value={item.buttonText}
                  onChange={(e) => {
                    const updatedArray = [...componentData.props.filterItems];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      buttonText: {
                        ...updatedArray[index].buttonText,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        filterItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* buttonLink (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Button Link</label>
                <input
                  type="text"
                  value={item.buttonLink}
                  onChange={(e) => {
                    const updatedArray = [...componentData.props.filterItems];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      buttonLink: {
                        ...updatedArray[index].buttonLink,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        filterItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* time (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Time</label>
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) => {
                    const updatedArray = [...componentData.props.filterItems];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      time: {
                        ...updatedArray[index].time,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        filterItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* kidsFriendly (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Kids Friendly?</label>
                <input
                  type="text"
                  value={item.kidsFriendly}
                  onChange={(e) => {
                    const updatedArray = [...componentData.props.filterItems];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      kidsFriendly: {
                        ...updatedArray[index].kidsFriendly,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        filterItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* ageLimit (çok dilli) */}

              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Age Limit</label>
                <input
                  type="text"
                  value={item.ageLimit}
                  onChange={(e) => {
                    const updatedArray = [...componentData.props.filterItems];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      ageLimit: {
                        ...updatedArray[index].ageLimit,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        filterItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --------------- RESTAURANT ITEMS --------------- */}
      {componentData.props.restaurantItems?.length > 0 && (
        <div className="flex flex-col gap-8 w-full mt-8 text-white">
          <h2 className="text-[20px] text-[#fff] font-semibold ml-2">
            Restaurant Items
          </h2>
          {componentData.props.restaurantItems.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-md flex flex-col gap-2"
            >
              <h3>Restaurant Item {index + 1}</h3>

              {/* image alanı */}
              <label className="font-semibold text-[16px] hidden">
                Image URL
              </label>
              <input
                type="text"
                className="hidden"
                value={item.image?.firebaseUrl || ""}
                onChange={(e) => {
                  const updatedArray = [...componentData.props.restaurantItems];
                  updatedArray[index] = {
                    ...updatedArray[index],
                    image: {
                      ...updatedArray[index].image,
                      firebaseUrl: e.target.value,
                    },
                  };
                  setComponentData((prev) => ({
                    ...prev,
                    props: {
                      ...prev.props,
                      restaurantItems: updatedArray,
                    },
                  }));
                }}
              />

              {item.image.firebaseUrl && (
                <img
                  src={item.image.firebaseUrl}
                  alt={`Preview of Image ${index + 1}`}
                  className="w-60 h-40 object-cover mt-2 border rounded-md"
                />
              )}

              {/* Image search */}
              <div className="flex flex-col gap-2 items-center">
                <div className="flex w-full items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setActiveField({ type: "restaurantItems", index });
                      setGaleriOpen(true); // <--- EKLE
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-[12px]"
                  >
                    Galeri
                  </button>

                  <button
                    onClick={handleRestaurantImageSearch}
                    className="bg-green-700 text-white px-2 py-1 rounded text-[12px] whitespace-nowrap"
                  >
                    Resim Yükle
                  </button>
                </div>

                {restaurantImageSearchResults.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2 overflow-y-scroll h-[200px] ">
                    <h4>Search Results</h4>
                    {restaurantImageSearchResults.map((result, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 border p-2 rounded-md cursor-pointer"
                        onClick={() =>
                          handleReplaceRestaurantItemImage(
                            index,
                            "restaurantImages",
                            result
                          )
                        }
                      >
                        <img
                          src={result.firebaseUrl}
                          alt={result.altText}
                          className="w-16 h-16 object-cover"
                        />
                        <p>{result.altText}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search for a new main image */}
              <div className="flex flex-col gap-2 items-center my-2">
                {restaurantImageSearchResults.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <h4>Search Results</h4>
                    {restaurantImageSearchResults.map((result, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 border p-2 rounded-md cursor-pointer"
                        onClick={() =>
                          handleReplaceRestaurantItemImage(
                            index,
                            "image",
                            result
                          )
                        }
                      >
                        <img
                          src={result.firebaseUrl}
                          alt={result.altText}
                          className="w-16 h-16 object-cover"
                        />
                        <p>{result.altText}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* image altText */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">
                  AltText ({language})
                </label>
                <input
                  className="text-black"
                  type="text"
                  value={item.image.altText[language] || ""} //item.image.altText
                  onChange={(e) => {
                    const updatedArray = [
                      ...componentData.props.restaurantItems,
                    ];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      image: {
                        ...updatedArray[index].image,
                        altText: {
                          ...updatedArray[index].image.altText,
                          [lang]: e.target.value,
                        },
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        restaurantItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* header (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Header</label>
                <input
                  type="text"
                  className="text-black"
                  value={item.header}
                  onChange={(e) => {
                    const updatedArray = [
                      ...componentData.props.restaurantItems,
                    ];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      header: {
                        ...updatedArray[index].header,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        restaurantItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* text (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Text</label>
                <input
                  type="text"
                  className="text-black"
                  value={item.text}
                  onChange={(e) => {
                    const updatedArray = [
                      ...componentData.props.restaurantItems,
                    ];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      text: {
                        ...updatedArray[index].text,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        restaurantItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* span (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Span</label>
                <input
                  type="text"
                  className="text-black"
                  value={item.span}
                  onChange={(e) => {
                    const updatedArray = [
                      ...componentData.props.restaurantItems,
                    ];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      span: {
                        ...updatedArray[index].span,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        restaurantItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* buttonText (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Button Text</label>
                <input
                  type="text"
                  className="text-black"
                  value={item.buttonText}
                  onChange={(e) => {
                    const updatedArray = [
                      ...componentData.props.restaurantItems,
                    ];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      buttonText: {
                        ...updatedArray[index].buttonText,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        restaurantItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>

              {/* buttonLink (çok dilli) */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold">Button Link</label>
                <input
                  type="text"
                  className="text-black"
                  value={item.buttonLink}
                  onChange={(e) => {
                    const updatedArray = [
                      ...componentData.props.restaurantItems,
                    ];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      buttonLink: {
                        ...updatedArray[index].buttonLink,
                        [lang]: e.target.value,
                      },
                    };
                    setComponentData((prev) => ({
                      ...prev,
                      props: {
                        ...prev.props,
                        restaurantItems: updatedArray,
                      },
                    }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --------------- IMAGES ARRAY --------------- */}
      {componentData.props.images?.length > 0 && (
        <div className="w-[100%] flex flex-col gap-[4%] items-start justify-center">
          <div className="w-[50%] overflow-x-scroll grid col-span-2">
            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-white text-[20px] font-bold pl-2"></h2>
              <div className="flex flex-row gap-3 w-full">
                {componentData.props.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 border p-4 rounded-md bg-white w-full h-96 overflow-y-scroll"
                  >
                    <h3 className="font-semibold">Görsel {index + 1}</h3>
                    <label className="text-black text-[18px] font-semibold hidden">
                      Firebase URL
                    </label>
                    <input
                      type="text"
                      value={image.firebaseUrl}
                      className="hidden"
                      onChange={(e) =>
                        handleArrayChange(
                          "images",
                          index,
                          "firebaseUrl",
                          e.target.value
                        )
                      }
                    />
                    {image.firebaseUrl && (
                      <img
                        src={image.firebaseUrl}
                        alt={`Preview of Image ${index + 1}`}
                        className="w-full h-32 object-cover mt-2 border rounded-md"
                      />
                    )}

                    {/* Image search */}
                    <div className="flex flex-col gap-2 items-center">
                      <div className="flex w-full items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setActiveField({ type: "images", index }); // <--- EKLE
                            setGaleriOpen(true); // <--- EKLE
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-[12px]"
                        >
                          Galeri
                        </button>

                        <button
                          onClick={handleSearch}
                          className="bg-green-700 text-white px-2 py-1 rounded text-[12px] whitespace-nowrap"
                        >
                          Resim Yükle
                        </button>
                      </div>

                      {searchResults.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2 overflow-y-scroll h-[200px]">
                          <h4>Search Results</h4>
                          {searchResults.map((result, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-4 border p-2 rounded-md cursor-pointer"
                              onClick={() =>
                                handleReplaceImage("images", index, result)
                              }
                            >
                              <img
                                src={result.firebaseUrl}
                                alt={result.altText.en}
                                className="w-16 h-16 object-cover"
                              />
                              <p>{result.altText.en}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Alt Text Düzenleme */}
                    <div className="flex flex-col gap-2">
                      <label className="text-black text-[15px] font-semibold">
                        Alt Text ({language})
                      </label>
                      <input
                        type="text"
                        value={image.altText[language] || ""}
                        className="text-[12px] border p-1"
                        onChange={(e) =>
                          handleAltTextChange(
                            "images",
                            index,
                            language,
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-black text-[18px] font-semibold">
                        Header
                      </label>
                      <input
                        className="px-2 py-1 rounded-md border"
                        type="text"
                        value={image.header}
                        onChange={(e) =>
                          handleHeaderChange("images", index, e.target.value)
                        }
                      />
                    </div>

                    {/* {Object.keys(image.text || {}).map(() => ( */}
                    <div className="flex flex-col gap-2">
                      <label className="text-black text-[18px] font-semibold">
                        Text
                      </label>
                      <input
                      className="px-2 py-1 rounded-md border"
                        type="text"
                        value={image.text}
                        onChange={(e) =>
                          handleTextChange("images", index, e.target.value)
                        }
                      />
                    </div>
                    <button
                onClick={() => handleRemove("images", index)}
                className=" mt-2 w-1/2 bg-red-600 text-white py-1 px-2 rounded whitespace-nowrap text-[12px]"
              >
                Remove
              </button>
                  </div>
                ))}
                
              </div>
              <button
                onClick={() => handleAddItem("images")}
                className="bg-green-700 text-white px-4 py-2 rounded w-[18%] my-4 whitespace-nowrap text-[14px]"
              >
                Add New Image
              </button>
            </div>
          </div>
          {/* Sağ Taraf: Preview */}
          {/* <div className="w-[100%] bg-white p-4 border-l rounded">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <div className="border rounded p-4">
              {componentData && componentData.props.images ? (
                // <CarouselPreview images={componentData.props.images} />
                <HomeCarousel images={componentData.props.images} header={componentData.props.header} delay={5} />
              ) : (
                <p>No images to preview.</p>
              )}
            </div>
          </div> */}
        </div>
      )}

      {/* --------------- SUBIMAGES ARRAY --------------- */}
      {componentData.props.subImages?.length > 0 && (
        <div className="w-[40%] overflow-x-scroll grid col-span-2">
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-[16px] text-white font-semibold mt-6 ml-2">
              Sub Images
            </h2>
            <div className="flex flex-row gap-3 w-full">
              {componentData.props.subImages.map((subImage, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 border p-4 rounded-md bg-white w-full h-96 overflow-y-scroll"
                >
                  <h3>Sub Image {index + 1}</h3>
                  <label className="text-black text-[18px] font-semibold hidden ">
                    Firebase URL
                  </label>
                  <input
                    type="text"
                    value={subImage.firebaseUrl}
                    className="hidden"
                    onChange={(e) =>
                      handleArrayChange(
                        "subImages",
                        index,
                        "firebaseUrl",
                        e.target.value
                      )
                    }
                  />

                  {subImage.firebaseUrl && (
                    <img
                      src={subImage.firebaseUrl}
                      alt={`Preview of subImage ${index + 1}`}
                      className="w-full h-32 object-cover mt-2 border rounded-md"
                    />
                  )}

                  {/* SubImage search */}
                  <div className="flex flex-col gap-2 items-center mt-1">
                    <div className="flex w-full items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setActiveField({ type: "subImages", index }); // <--- EKLE
                          setGaleriOpen(true); // <--- EKLE
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-[12px]"
                      >
                        Galeri
                      </button>

                      <button
                        onClick={handleSubImageSearch}
                        className="bg-green-700 text-white px-2 py-1 rounded text-[12px] whitespace-nowrap"
                      >
                        Resim Yükle
                      </button>
                    </div>

                    {subImageSearchResults.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2 overflow-y-scroll h-[200px]">
                        <h4>Search Results</h4>
                        {subImageSearchResults.map((result, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 border p-2 rounded-md cursor-pointer"
                            onClick={() =>
                              handleReplaceImage("subImages", index, result)
                            }
                          >
                            <img
                              src={result.firebaseUrl}
                              alt={result.altText.en}
                              className="w-16 h-16 object-cover"
                            />
                            <p>{result.altText.en}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[15px] font-semibold">
                      Alt Text ({language})
                    </label>
                    <input
                      type="text"
                      value={subImage.altText[language] || ""}
                      onChange={(e) =>
                        handleAltTextChange(
                          "subImages",
                          index,
                          language,
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleAddItem("subImages")}
              className="bg-green-700 text-white px-4 py-2 rounded w-[20%] whitespace-nowrap my-4 text-[14px]"
            >
              Add New SubImage
            </button>
          </div>
        </div>
      )}

      {/* --------------- HEADERS ARRAY --------------- */}
      {componentData.props.headers?.length > 0 && (
        <div className="flex flex-col gap-7 w-full">
          <h2 className="text-[20px] text-white font-semibold mt-6 ml-2">
            Headers
          </h2>
          {componentData.props.headers.map((header, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border p-4 rounded-md w-[40%]"
            >
              <h3 className="text-white text-[14px] font-medium">Header {index + 1}</h3>
              <div className="flex flex-col gap-2">
                <label className="text-white text-[14px] font-semibold">
                  Header
                </label>
                <input
                className="px-2 py-1 rounded-md text-[13px]"
                  type="text"
                  value={header || ""}
                  onChange={(e) =>
                    handleArrayHeaderChange("headers", index, e.target.value)
                  }
                />
              </div>
              <button
                onClick={() => handleRemoveHeader(index)}
                className="mt-5 w-[120px] bg-red-600 text-white py-1 px-2 rounded whitespace-nowrap text-[12px]"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddItem("headers")}
            className="bg-green-700 text-white px-2 py-2 rounded w-[12%] my-4 text-[14px]"
          >
            Add New Headers
          </button>
        </div>
      )}

      {/* --------------- ITEMS ARRAY --------------- */}
      {componentData.props.items?.length > 0 && (
        <div className="flex flex-col gap-4 w-[40%] mt-8">
          <h2 className="text-[15px] text-white font-semibold ml-2">Items</h2>
          {componentData.props.items.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-md flex flex-col gap-2 text-black bg-white text-[12px] items-center justify-center w-full"
            >
              <h3 className="text-black">Item {index + 1}</h3>

              <label className="hidden">Image URL</label>
              <input
                className="border p-2 text-[10px] hidden"
                type="text"
                value={item.firebaseUrl}
                onChange={(e) =>
                  handleItemInputChange(
                    "items",
                    index,
                    "firebaseUrl",
                    e.target.value
                  )
                }
              />

              {item.firebaseUrl && (
                <img
                  src={item.firebaseUrl}
                  alt={`Preview of subImage ${index + 1}`}
                  className="w-24 h-auto object-cover mt-2 border rounded-md "
                />
              )}

              <div className="flex flex-col gap-2 items-center mt-1">
                <div className="flex w-full items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setActiveField({ type: "items", index }); // <--- EKLE
                      setGaleriOpen(true); // <--- EKLE
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-[12px]"
                  >
                    Galeri
                  </button>

                  <button
                    onClick={handleSubImageSearch}
                    className="bg-green-700 text-white px-2 py-1 rounded text-[12px] whitespace-nowrap"
                  >
                    Resim Yükle
                  </button>
                </div>

                {itemSearchResults.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2 overflow-y-scroll h-[200px]">
                    <h4>Search Results</h4>
                    {itemSearchResults.map((result, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 border p-2 rounded-md cursor-pointer"
                        onClick={() =>
                          handleReplaceImage("items", index, result)
                        }
                      >
                        <img
                          src={result.firebaseUrl}
                          alt={result.altText.en}
                          className="w-16 h-16 object-cover"
                        />
                        <p>{result.altText.en}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col w-[95%] gap-3">
                <label className="text-[12px]">Large Dimensions</label>
                <input
                  className="border p-2 text-[10px]"
                  type="number"
                  placeholder="Width"
                  value={item.largeWidth}
                  onChange={(e) =>
                    handleItemInputChange(
                      "items",
                      index,
                      "largeWidth",
                      e.target.value
                    )
                  }
                />
                <input
                  className="border p-2 text-[10px]"
                  type="number"
                  placeholder="Height"
                  value={item.largeHeight}
                  onChange={(e) =>
                    handleItemInputChange(
                      "items",
                      index,
                      "largeHeight",
                      e.target.value
                    )
                  }
                />

                <label className="text-[12px]">Small Dimensions</label>
                <input
                  className="border p-2 text-[10px]"
                  type="number"
                  placeholder="Width"
                  value={item.smallWidth}
                  onChange={(e) =>
                    handleItemInputChange(
                      "items",
                      index,
                      "smallWidth",
                      e.target.value
                    )
                  }
                />
                <input
                  className="border p-2 text-[10px]"
                  type="number"
                  placeholder="Height"
                  value={item.smallHeight}
                  onChange={(e) =>
                    handleItemInputChange(
                      "items",
                      index,
                      "smallHeight",
                      e.target.value
                    )
                  }
                />

                <label>Text</label>
                <input
                  className="border p-2 text-[10px]"
                  type="text"
                  placeholder={`Text`}
                  value={item.text}
                  onChange={(e) =>
                    handleItemTextChange("items", index, e.target.value)
                  }
                />
              </div>

              <button
                onClick={() => handleRemove("items", index)}
                className="w-1/3 bg-red-600 text-white py-1 px-4 rounded whitespace-nowrap text-[12px] mt-2"
              >
                Remove Item
              </button>
            </div>
          ))}
          <button
            onClick={handleAddNewItem}
            className="bg-green-700 text-white py-2 px-4 rounded mt-4 w-[18%] text-[14px]"
          >
            Add New Item
          </button>
        </div>
      )}

      {/* --------------- SAVE BUTTON --------------- */}
      <button
        onClick={handleSave}
        className="bg-[#818cca] hover:bg-[#231e43] text-white text-[16px] font-semibold px-4 py-2 rounded my-5 mt-12"
      >
        Save Changes
      </button>
      {success && (
        <p className="text-green-500">Component updated successfully!</p>
      )}
    </div>
  );
};

export default EditComponent;
