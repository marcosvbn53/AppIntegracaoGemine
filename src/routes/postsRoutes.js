import express from "express";
import multer from "multer";
import cors from "cors";

const corsOptions = { 
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
};

import { listAll } from "../controllers/postsController.js";
import { getItem } from "../controllers/postsController.js";
import { createPost } from "../controllers/postsController.js";
import { uploadImage } from "../controllers/postsController.js";
import { updateUpload } from "../controllers/postsController.js";


//Configuração necessário para o windows, caso 
//contrario a imagem será renomeada para caracateres estranhos.
//Não é necessário para o linux/Mac apenas const upload = multer({dest:"./uploads"});
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})

const upload = multer({dest:"./uploads", storage});

const routes = (app) =>{
    app.use(express.json());
    app.use(cors(corsOptions));

    app.use((req, res, next)=>{
        console.log(`REQUISIÇÃO REALIZADA NA URL ${req.url}`);
        return next();
    })

    app.get("/api/posts/:id", getItem);
    app.get("/api/posts", listAll);

    app.post("/api/posts", createPost);
    app.post("/api/upload", upload.single("imagem"), uploadImage);
    app.put("/api/upload/:id", updateUpload);

}

export default routes;

