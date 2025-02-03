import mongoose from "mongoose";

const localizedStringSchema = new mongoose.Schema({
  en: { type: String, required: true },
  ru: { type: String, required: true },
  de: { type: String, required: true },
  tr: { type: String, required: true },
});

const imageSchema = new mongoose.Schema({
  name: localizedStringSchema,
  altText: localizedStringSchema,
  firebaseUrl: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
  page: { type: String }, // Sayfa bilgisi için opsiyonel alan
});

const Image = mongoose.model("Image", imageSchema);

export default Image;
