import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// URLs her dil için ayrı tutuluyor
// Burada Türkçe URL zorunlu ve unique olabilir.
// Diğer diller opsiyonel olabilir (gerekirse onlar da required/unique yapılabilir).
const urlsSchema = new mongoose.Schema({
  tr: { type: String, required: true, unique: true },
  en: { type: String, unique: true,  },
  ru: { type: String, unique: true,  },
  de: { type: String, unique: true, },
});

const blogSchema = new mongoose.Schema(
  {
    urls: urlsSchema, // Dil bazlı URL'leri tutan alan
    author: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    images: [String],
    gallery: {
      type: [String],
      default: [],
    },
    sections: {
      tr: [sectionSchema],
      en: [sectionSchema],
      ru: [sectionSchema],
      de: [sectionSchema],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
