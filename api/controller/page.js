import Page from "../models/page.js";

// Tüm sayfaları getirme
export const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find();
    if (!pages || pages.length === 0) {
      return res.status(404).json({ message: "No pages found" });
    }
    res.status(200).json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



export const getPageByName = async (req, res) => {
  try {
    const { pageName } = req.params;
    const page = await Page.findOne({ pageName });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



// Yeni sayfa ekleme
export const createPage = async (req, res) => {
  try {
    const { pageName, translations } = req.body;

    // Eğer sayfa zaten varsa tekrar oluşturulmasını engelle
    const existingPage = await Page.findOne({ pageName });
    if (existingPage) {
      return res
        .status(400)
        .json({ message: "Page with this name already exists" });
    }

    const newPage = new Page({
      pageName,
      translations,
    });

    await newPage.save();
    res.status(201).json(newPage);
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



// Sayfayı güncelleme
export const updatePage = async (req, res) => {
  try {
    const { pageName } = req.params;
    const { translations } = req.body;

    const updatedPage = await Page.findOneAndUpdate(
      { pageName },
      { translations },
      { new: true }
    );

    if (!updatedPage) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.status(200).json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({ message: "Server error", error });
  }
};





// Sayfayı silme
export const deletePage = async (req, res) => {
  try {
    const { pageName } = req.params;

    const deletedPage = await Page.findOneAndDelete({ pageName });

    if (!deletedPage) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateLanguageComponents = async (req, res) => {
  const { pageName, language } = req.params; // language = "en", "tr", "de", "ru"
  const components = req.body;

  try {
    const page = await Page.findOne({ pageName });
    if (!page) return res.status(404).json({ message: "Page not found" });

    page.translations[language] = components;
    await page.save();

    res.status(200).json({ message: `Components updated for language: ${language}` });
  } catch (error) {
    console.error("Error updating language components:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



// // Belirli bir component'i güncelleme
// export const updateComponent = async (req, res) => {
//   const { pageName, language, componentIndex } = req.params;
//   const updatedData = req.body;

//   try {
//     const page = await Page.findOne({ pageName });
//     if (!page) return res.status(404).json({ message: "Page not found" });

//     const translation = page.translations.find((t) => t.language === language);
//     if (!translation) return res.status(404).json({ message: `Translation for ${language} not found` });

//     translation.components[componentIndex] = updatedData;
//     await page.save();

//     res.status(200).json({ message: "Component updated successfully" });
//   } catch (error) {
//     console.error("Error updating component:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };


export const deleteItemFromComponent = async (req, res) => {
  const { pageName, language, componentIndex, itemIndex } = req.params;

  try {
    console.log(`🟢 Silme işlemi başladı: ${pageName}, Dil: ${language}, Component Index: ${componentIndex}, Item Index: ${itemIndex}`);

    // Sayfayı bul
    const page = await Page.findOne({ pageName });
    if (!page) {
      console.log("🔴 Sayfa bulunamadı!");
      return res.status(404).json({ message: "Page not found" });
    }

    console.log(`✅ Sayfa bulundu: ${pageName}`);

    // İlgili dili bul
    const translation = page.translations[language];
    if (!translation) {
      console.log(`🔴 ${language} dili için çeviri bulunamadı.`);
      return res.status(404).json({ message: `Translation for ${language} not found` });
    }

    console.log(`✅ ${language} dili için çeviri bulundu.`);

    // İlgili component'i bul
    const component = translation[componentIndex];
    if (!component) {
      console.log(`🔴 Component bulunamadı veya index yanlış: ${componentIndex}`);
      return res.status(404).json({ message: "Component not found" });
    }

    console.log(`✅ Component bulundu: ${component.type}`);

    // Eğer bileşenin `items` dizisi yoksa veya geçersiz bir index verilmişse hata döndür
    if (!component.props.items || !component.props.items[itemIndex]) {
      console.log(`🔴 Item bulunamadı!`);
      return res.status(404).json({ message: "Item not found" });
    }

    console.log(`✅ Item bulundu, silme işlemi yapılıyor...`);

    // Seçili item'ı array'den çıkar
    component.props.items.splice(itemIndex, 1);

    // Veriyi kaydet
    await page.save();

    console.log("✅ Item başarıyla silindi!");

    return res.status(200).json({ message: "Item deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting item:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
;

export const deleteImageFromComponent = async (req, res) => {
  const { pageName, language, componentIndex, imageIndex } = req.params;

  try {
    console.log(`🟢 Silme işlemi başladı: ${pageName}, Dil: ${language}, Component Index: ${componentIndex}, Image Index: ${imageIndex}`);

    // Sayfayı bul
    const page = await Page.findOne({ pageName });
    if (!page) {
      console.log("🔴 Sayfa bulunamadı!");
      return res.status(404).json({ message: "Page not found" });
    }

    console.log(`✅ Sayfa bulundu: ${pageName}`);

    // Sayfadaki ilgili dilin çevirisini al
    const translation = page.translations[language];
    if (!translation) {
      console.log(`🔴 ${language} dili için çeviri bulunamadı.`);
      return res.status(404).json({ message: "Language translation not found" });
    }

    console.log(`✅ ${language} dili için çeviri bulundu.`);

    // İlgili bileşene ulaş
    const component = translation[componentIndex];
    if (!component) {
      console.log(`🔴 Component bulunamadı veya index yanlış: ${componentIndex}`);
      return res.status(404).json({ message: "Component not found" });
    }

    console.log(`✅ Component bulundu: ${component.type}`);

    // Eğer bileşenin images array'i yoksa veya geçersiz bir index verilmişse hata döndür
    if (!component.props.images || !component.props.images[imageIndex]) {
      console.log(`🔴 Image bulunamadı!`);
      return res.status(404).json({ message: "Image not found" });
    }

    console.log(`✅ Image bulundu, silme işlemi yapılıyor...`);

    // Seçili image'ı array'den çıkar
    component.props.images.splice(imageIndex, 1);

    // Veriyi kaydet
    await page.markModified(`translations.${language}`);
    await page.save();

    console.log("✅ Image başarıyla silindi!");

    return res.status(200).json({ message: "Image deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting image:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


export const deleteHeaderFromComponent = async (req, res) => {
  const { pageName, language, componentIndex, headerIndex } = req.params;

  try {
    console.log(`🟢 Silme işlemi başladı: ${pageName}, Dil: ${language}, Component Index: ${componentIndex}, Header Index: ${headerIndex}`);

    // Sayfayı MongoDB'de bul
    const page = await Page.findOne({ pageName });

    if (!page) {
      console.error("🔴 Sayfa bulunamadı:", pageName);
      return res.status(404).json({ message: "Page not found" });
    }

    console.log("✅ Sayfa bulundu:", pageName);

    // Eğer translations undefined ise kontrol ekle
    if (!page.translations || !page.translations[language]) {
      console.error(`🔴 ${language} dili için çeviri bulunamadı!`);
      return res.status(404).json({ message: "Language translations not found" });
    }

    console.log(`🟡 ${language} dili için bileşenler mevcut.`);

    // Bileşeni al
    const components = page.translations[language];
    if (!components || components.length <= componentIndex) {
      console.error("🔴 Component bulunamadı veya index yanlış:", componentIndex);
      return res.status(404).json({ message: "Component not found" });
    }

    console.log("✅ Component bulundu:", componentIndex);

    const component = components[componentIndex];

    // Headers kontrolü
    if (!component.props?.headers || !Array.isArray(component.props.headers)) {
      console.error("🔴 Headers dizisi yok veya tanımsız!");
      return res.status(404).json({ message: "Headers array not found" });
    }

    console.log("🟢 Mevcut headers:", component.props.headers);

    // Header index geçerli mi kontrol et
    if (headerIndex < 0 || headerIndex >= component.props.headers.length) {
      console.error("🔴 Geçersiz header index:", headerIndex);
      return res.status(400).json({ message: "Invalid header index" });
    }

    console.log("🟢 Header siliniyor:", component.props.headers[headerIndex]);

    // Header'ı sil
    component.props.headers.splice(headerIndex, 1);

    // Güncellenmiş sayfayı kaydet
    await page.markModified(`translations.${language}`);
    await page.save();

    console.log("✅ Header başarıyla silindi ve veritabanı güncellendi!");

    return res.status(200).json({ message: "Header deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting header:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};





// Sayfa çevirilerini döndüren controller
export const getPageTranslations = async (req, res) => {
  const { pageName, language } = req.params;

  try {
    // Sayfayı veritabanından çek
    const page = await Page.findOne({ pageName });

    // Eğer sayfa bulunamazsa 404 döndür
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // İlgili dil için çevirileri al, yoksa boş array döndür
    const translations = page.translations[language] || [];

    res.status(200).json({ translations });
  } catch (error) {
    console.error("Error fetching translations:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateComponent = async (req, res) => {
  const { pageName, language, componentIndex } = req.params;
  const updatedComponent = req.body; // Güncellenmiş component verisi

  try {
    const page = await Page.findOne({ pageName });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    const translation = page.translations[language];
    if (!translation) {
      return res
        .status(404)
        .json({ message: `No translations found for language: ${language}` });
    }

    if (!translation[componentIndex]) {
      return res.status(404).json({ message: "Component not found" });
    }

    // Mevcut component'i koruyarak güncelle
    translation[componentIndex] = {
      ...translation[componentIndex], // Mevcut verileri koru
      ...updatedComponent,           // Yeni verilerle güncelle
      props: {
        ...translation[componentIndex].props, // Mevcut props'u koru
        ...updatedComponent.props,           // Yeni props'u ekle
      },
    };

    await page.save();

    res.status(200).json({ message: "Component updated successfully" });
  } catch (error) {
    console.error("Error updating component:", error);
    res.status(500).json({ message: "Server error", error });
  }
};




export const getComponentByIndex = async (req, res) => {
  const { pageName, language, componentIndex } = req.params;

  try {
    const page = await Page.findOne({ pageName });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    const translation = page.translations[language];
    if (!translation) {
      return res.status(404).json({ message: `No translations found for language: ${language}` });
    }

    const component = translation[componentIndex];
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.status(200).json(component);
  } catch (error) {
    console.error("Error fetching component:", error);
    res.status(500).json({ message: "Server error", error });
  }
};









