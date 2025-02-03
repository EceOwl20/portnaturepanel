import express from "express";
import {
  getAllPages,
  getPageByName,
  createPage,
  updatePage,
  deletePage,
  updateComponent,
  deleteItemFromComponent,
  deleteImageFromComponent,
  getPageTranslations,
  getComponentByIndex,
  deleteHeaderFromComponent
} from "../controller/page.js";

const router = express.Router();

// Tüm sayfaları getirme
router.get("/all", getAllPages);

// Belirli bir sayfayı getirme
router.get("/:pageName", getPageByName);

// Yeni sayfa ekleme
router.post("/create", createPage);

// Sayfayı güncelleme
router.put("/:pageName", updatePage);

// Sayfayı silme
router.delete("/:pageName", deletePage);

// Belirli bir component'i güncelleme
router.put("/:pageName/translations/:language/components/:componentIndex", updateComponent);

// Bir component'in items içerisinden belirli bir item'ı silme
router.delete("/:pageName/translations/:language/components/:componentIndex/items/:itemIndex", deleteItemFromComponent);

// Bir component'in images içerisinden belirli bir image'ı silme
router.delete("/:pageName/translations/:language/components/:componentIndex/images/:imageIndex", deleteImageFromComponent);

router.delete("/:pageName/translations/:language/components/:componentIndex/headers/:headerIndex", deleteHeaderFromComponent);

router.get("/:pageName/translations/:language", getPageTranslations); 

router.get("/:pageName/translations/:language/components/:componentIndex", getComponentByIndex);



export default router;
