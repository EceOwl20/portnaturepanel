import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { errorHandle } from "../Utils/error.js";

export const kayitOl = async (request, response, next) => {
    const {username, name, email, password} = request.body;
    const newUser = new User ({username, name, email, password});
    try {
        await newUser.save();
        response.status(201).json("Kullanıcı Kaydı Başarılı")
    } catch (error) {
        next(error)
    }
}

export const girisYap = async (request, response, next) => {
    const {username, password} = request.body;
    try {
        const validate = await User.findOne({username, password});
        if(!validate){
            return next(errorHandle(404, "Kullanıcı adı veya şifre hatalı"));
        }
        const token = jwt.sign({id:validate.id},"DGTLFACE");
        response.cookie("token", token, {expired: new Date(Date.now()+24*60*60*1000), httpOnly: true}).status(200).json(validate);
    } catch (error) {
        next(error);
    }
}

export const cikisYap = async (request, response, next) => {
    try {
        response.clearCookie("token")
        response.status(201).json("Çıkış İşlemi Başarılı")
    } catch (error) {
        next(error)
    }
}