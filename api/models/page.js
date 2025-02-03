import mongoose from "mongoose";

const componentSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Component adı
  props: { type: mongoose.Schema.Types.Mixed, required: true }, // Props
});

const translationSchema = new mongoose.Schema({
  en: [componentSchema], // İngilizce dil bileşenleri
  tr: [componentSchema], // Türkçe dil bileşenleri
  de: [componentSchema], // Almanca dil bileşenleri
  ru: [componentSchema], // Rusça dil bileşenleri
});

const pageSchema = new mongoose.Schema({
  pageName: { type: String, required: true, unique: true }, // Sayfa adı
  translations: { type: translationSchema, required: true }, // Çeviri içeriği
});

const Page = mongoose.model("Page", pageSchema);
export default Page;
