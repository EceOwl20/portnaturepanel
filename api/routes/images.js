import express from "express";
import {
  uploadImage,
  searchImageByName,
  getImagesByName, // searchbyname için eklenen kontrolör
  getAllImages,
  getImageById,
  updateImage,
  deleteImage,
  getImagesByPage,
} from "../controller/images.js";

const router = express.Router();

// Resim yükleme
router.post("/upload", uploadImage);

// İsme göre arama (kısmi)
router.get("/search", searchImageByName);

// Birden fazla isimle arama (tam eşleşme)
router.get("/searchbyname", getImagesByName); // Eksik olan eklendi

// Tüm resimleri getirme
router.get("/all", getAllImages);

// ID ile resim getirme
router.get("/:id", getImageById);

// Resim güncelleme
router.put("/:id", updateImage);

// Resim silme
router.delete("/:id", deleteImage);

// Sayfaya göre resim getirme
router.get("/page", getImagesByPage);

export default router;
