import Image from "../models/images.js";

// Resim yükleme
export const uploadImage = async (req, res) => {
  try {
    const { name, altText, firebaseUrl } = req.body;

    // Eksik alan kontrolü
    if (
      !name ||
      !altText ||
      !firebaseUrl ||
      !name.en ||
      !name.tr ||
      !name.ru ||
      !name.de ||
      !altText.en ||
      !altText.tr ||
      !altText.ru ||
      !altText.de
    ) {
      return res.status(400).json({
        message: "All fields (name, altText, firebaseUrl) are required in all languages",
      });
    }

    const newImage = new Image({ name, altText, firebaseUrl });
    await newImage.save();

    res.status(201).json({ message: "Image saved successfully!", newImage });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ message: "Error saving image", error });
  }
};

// İsme göre resim arama
export const searchImageByName = async (req, res) => {
  try {
    const { name, lang } = req.query;

    if (!name || !lang) {
      return res.status(400).json({ message: "Missing 'name' or 'lang' query" });
    }

    const images = await Image.find({
      [`name.${lang}`]: { $regex: name, $options: "i" },
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }

    res.status(200).json(images);
  } catch (error) {
    console.error("Error searching image by name:", error);
    res.status(500).json({ message: "Error searching image", error });
  }
};

// Tüm resimleri getirme
export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching all images:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Resim ID ile getirme
export const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json(image);
  } catch (error) {
    console.error("Error fetching image by ID:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Resim güncelleme
export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, altText, firebaseUrl } = req.body;

    if (
      !name ||
      !altText ||
      !firebaseUrl ||
      !name.en ||
      !name.tr ||
      !name.ru ||
      !name.de ||
      !altText.en ||
      !altText.tr ||
      !altText.ru ||
      !altText.de
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required, including firebaseUrl" });
    }

    const updatedImage = await Image.findByIdAndUpdate(
      id,
      { name, altText, firebaseUrl },
      { new: true, runValidators: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Resim silme
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await Image.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Sayfaya göre resimleri getirme
export const getImagesByPage = async (req, res) => {
  try {
    const { page } = req.query;

    const images = await Image.find({ page });
    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found for the specified page" });
    }

    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images by page:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getImagesByName = async (req, res) => {
  try {
    const { names, lang } = req.query; // names: virgülle ayrılmış isimler, lang: dil kodu
    if (!names || !lang) {
      return res.status(400).json({ message: "Both 'names' and 'lang' are required" });
    }

    // İsimleri virgüle göre ayır
    const nameArray = names.split(",").map(name => name.trim());

    // Veritabanından sorgula
    const images = await Image.find({
      [`name.${lang}`]: { $in: nameArray }, // name.[lang] alanına göre sorgu
    });

    // Eğer hiçbir eşleşme yoksa
    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found for the provided names and language" });
    }

    // Başarılı yanıt
    res.status(200).json({
      message: "Images fetched successfully",
      count: images.length,
      images,
    });
  } catch (error) {
    console.error("Error in getImagesByName:", error);
    res.status(500).json({
      message: "An error occurred while fetching images",
      error: error.message,
    });
  }
};
