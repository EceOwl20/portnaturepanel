import express from "express";
import { getComponentsByPage, updateComponent } from "../controller/components.js";

const router = express.Router();

router.get("/:page", getComponentsByPage); // Sayfadaki bileşenleri getir
router.put("/:id", updateComponent); // Bileşeni güncelle

export default router;
