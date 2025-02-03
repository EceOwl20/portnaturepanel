import Blog from "../models/blog.js";

export const yeniMakale = async (request, response, next) => {
    try {
        console.log("Gelen veri:", request.body); // kontrol
        const blog = await Blog.create(request.body);
        return response.status(201).json(blog);
    } catch (error) {
        console.error("Veritabanı hatası:", error);
        next(error);
    }
  }

  export const makaleGetirByLangAndSlug = async (req, res, next) => {
    try {
      const { title, language } = req.params;
      const blog = await Blog.findOne({ title });
  
      if (!blog) {
        return res
          .status(404)
          .json({ success: false, message: "Bu slug için blog bulunamadı." });
      }
  
      return res.status(200).json({ success: true, blog });
    } catch (error) {
      console.error("makaleGetirByLangAndSlug Hatası:", error);
      next(error);
    }
  };  
  

export const makaleListele = async (request, reponse, next) => {
    try {
      const blogs = await Blog.find();
      reponse.status(200).json({ success: true, blogs });
    } catch (error) {
      next(error);
    }
}

export const makaleGetir = async (request, response, next) => {
    const {id } = request.params;
    try {
        const blog = await Blog.findById( id );
        if (blog) {
            response.status(200).json({ success: true, blog });
        } else {
            response.status(404).json({ success: false, message: "Blog bulunamadı" });
        }
    } catch (error) {
        next(error);
    }
}

export const makaleGuncelle = async (req, res, next) => {
  try {
    const { slug } = req.params; // Slug ile blogu bul
    const updatedData = req.body; // Güncellenmiş veriler

    // Blogu slug'a göre bul ve güncelle
    const blog = await Blog.findOneAndUpdate(
      { $or: [
          { "urls.tr": slug },
          { "urls.en": slug },
          { "urls.ru": slug },
          { "urls.de": slug },
        ] 
      },
      { $set: updatedData }, // Yeni verilerle güncelle
      { new: true } // Güncellenmiş veriyi döndür
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog bulunamadı" });
    }

    return res.status(200).json({ success: true, message: "Blog güncellendi", blog });
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    next(error);
  }
};

  

export const makaleSil = async (request, response, next) => {
    try {
        const blog = await Blog.findByIdAndDelete(request.params.id);
        if (blog) {
            response.status(200).json({ success: true, message: 'Blog başarıyla silindi', blog });
        } else {
            response.status(404).json({ success: false, message: 'Blog bulunamadı' });
        }
    } catch (error) {
        console.error('makaleSil Hatası:', error);
        response.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
};


export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params; // URL'den slug'ı al

    // Blog'u slug'a göre bul
    const blog = await Blog.findOne({
      $or: [
        { "urls.tr": slug },
        { "urls.en": slug },
        { "urls.ru": slug },
        { "urls.de": slug },
      ],
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found for the given slug." });
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getBlogList = async (req, res) => {
  try {
    const blogs = await Blog.find({}, "urls sections thumbnail"); // Sadece gerekli alanları getir
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Error fetching blogs", error });
  }
};


