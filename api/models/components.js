 import mongoose from "mongoose";

const componentSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Bileşen tipi (ör: "Carousel", "HeaderSection")
  page: { type: String, required: true }, // Sayfa adı veya ID (ör: "homepage")
  props: { type: Object, default: {} }, // Bileşene gönderilen tüm props
});

const Component = mongoose.model("Component", componentSchema);
export default Component;
