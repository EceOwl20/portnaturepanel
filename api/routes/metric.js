// routes/metric.js
import { Router } from "express";
import { getMetrics, upsertMetric, updateOneMetricData } from "../controller/metric.js";

const router = Router();

router.get("/metrics", getMetrics);      // Tüm metrikleri liste
router.post("/", upsertMetric);         // POST /api/metric -> upsert (yeni oluştur veya var olana ekle)
router.put("/:id", updateOneMetricData);// PUT /api/metric/:id -> dataPoint güncelleme

export default router;
