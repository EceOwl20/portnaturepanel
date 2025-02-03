import exp from "express";
import { getirBir, getirUsers, guncelleUser, silUsers, countOfUser,getAllUsers } from "../controller/user.js";

const router = exp.Router();

router.get("/getir", getirUsers);
router.delete("/delete/:id", silUsers)
router.put("/guncelle/:id", guncelleUser)
router.get("/getirbir/:id", getirBir)
router.get("/count", countOfUser)
router.get("/all", getAllUsers)

export default router;