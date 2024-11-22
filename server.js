import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import routes from "./src/routes/postsRoutes.js";

const port = process.env.PORT;

const app = express();


app.use("/uploads", express.static(path.resolve("uploads")));

routes(app);

console.log(`Configuração de porta no arquivo ${port}`);

const posts = [
    { id:1, descricao:"Gato correndo", imagem:"https://placecats.com/300/200" },
    { id:2, descricao:"Gato manhoso", imagem:"https://placecats.com/300/200" },
    { id:3, descricao:"Gato panqueca", imagem:"https://placecats.com/300/200" }
];

function buscarPostId(id){
    return posts.findIndex(px => {
        return px.id === Number(id);
    })
}

app.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}`);
}); 


