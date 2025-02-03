// controller/metric.js
import Metric from "../models/metric.js";

export const getMetrics = async (req, res) => {
  try {
    const metrics = await Metric.find();
    return res.status(200).json(metrics);
  } catch (error) {
    console.error('Metrik verileri alınamadı:', error);
    res.status(500).json({ error: 'Metrik verileri alınamadı' });
  }
};


// Örnek bir "upsert" create
export const upsertMetric = async (req, res) => {
  try {
    const { name, dataPoints } = req.body; 
    // dataPoints => örn. [{ timestamp, value }] dizi

    // 1) name var mı veritabanında arayalım
    const existing = await Metric.findOne({ name });
    if (!existing) {
      // Yoksa yeni metric oluşturalım
      const newMetric = await Metric.create({ name, dataPoints });
      return res.status(201).json({
        message: "Yeni metric oluşturuldu",
        metric: newMetric
      });
    } else {
      // Varsa dataPoints'e ekleyelim
      // Basit örnek: Tüm dataPoints'i push edelim
      // (İsterseniz tek dataPoint eklemek için $push da yapabilirsiniz)
      existing.dataPoints.push(...dataPoints); 
      await existing.save();
      return res.status(200).json({
        message: "Mevcut metric'e dataPoints eklendi",
        metric: existing
      });
    }
  } catch (error) {
    console.error("upsertMetric error:", error);
    res.status(500).json({ error: "Failed to upsert metric" });
  }
};

// Örnek bir "update" fonksiyonu (var olan dataPoint'i güncellemek isterseniz)
export const updateOneMetricData = async (req, res) => {
  try {
    const { id } = req.params;
    const { timestamp, value } = req.body;
    // Burada "ilk dataPoint"i veya "belirli index"i güncellesiniz; 
    // tasarımınıza göre bir yaklaşım
    const metric = await Metric.findById(id);
    if (!metric) return res.status(404).json({ message: "Metric not found" });

    // Basitçe: metric.dataPoints[0] güncelledik
    // Veya find ile timestamp'i bulup value'yi değiştirebilirsiniz
    if (!metric.dataPoints[0]) {
      // Ekle
      metric.dataPoints.push({ timestamp, value });
    } else {
      metric.dataPoints[0].timestamp = timestamp;
      metric.dataPoints[0].value = value;
    }
    await metric.save();
    res.json({ message: "Metric updated", metric });
  } catch (err) {
    console.error("updateOneMetricData error:", err);
    res.status(500).json({ error: "Failed to update metric data" });
  }
};
