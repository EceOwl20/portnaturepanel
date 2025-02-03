import exp from "express";
import { cikisYap, girisYap, kayitOl } from "../controller/loginRegister.js";


const router = exp.Router();


router.post("/kayit-ol",kayitOl);
router.post("/giris", girisYap)
router.get("/cikis", cikisYap)



export default router;