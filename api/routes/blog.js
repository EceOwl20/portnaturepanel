import exp from "express"
import { makaleGetir, makaleGuncelle, makaleListele, makaleSil, yeniMakale, makaleGetirByLangAndSlug, getBlogBySlug, getBlogList } from "../controller/blog.js"

const router = exp.Router();

router.post("/yeni", yeniMakale);
router.post("/guncelle/:slug", makaleGuncelle)
router.get("/liste",getBlogList);
//router.get("/getir/:id", makaleGetir);
router.delete("/sil/:id",makaleSil)
router.get("/getir/:lang/:slug", makaleGetirByLangAndSlug);
router.get("/:slug",getBlogBySlug)


export default router;
