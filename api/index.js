import express, { request } from "express";
import compression from "compression";
import mongo from "mongoose";
import userRoute from "./routes/user.js";
import loginRegister from "./routes/loginRegister.js";
import blogRoute from "./routes/blog.js";
import cors from "cors";
import imageRoute from "./routes/images.js";
import pageRoute from "./routes/page.js";
import componentRoute from "./routes/components.js";
// import metricRoute from "./routes/metric.js";

const connect = async () => {
    await mongo.connect("mongodb+srv://smbduknwn:1TL6SUtVqQDyWsnJ@port-nature.jvs90.mongodb.net/?retryWrites=true&w=majority&appName=Port-Nature", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
}

connect()
  .then(async () => {
    console.log("Bağlandı sorun yok...");
    //await seedMetrics();
    //console.log("Seed işlemi tamamlandı!");
  })
  .catch((db_error) => {
    console.log(db_error);
  });


const exp = express();
exp.use(express.json());
exp.use(cors())

exp.use(compression());

exp.listen(3000, () => {
    console.log("Port Açıldı. Sorun yok");
});
// 1) Ana sayfa rotası
exp.get("/", (req, res) => {
  res.send("Welcome to my API");
});

exp.use("/api/giris", loginRegister);
exp.use("/api/user", userRoute);
exp.use("/api/blog", blogRoute);
exp.use("/api/images", imageRoute);
exp.use("/api/page", pageRoute);
exp.use("/api/components", componentRoute);
// exp.use("/api/metric", metricRoute);

exp.use((error, request, response, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Kaynağı belli olmayan bir sorun var!";
    return response.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
