import fs from "fs";
import { getAll, getItemId, postCreate, postUpdate } from "../model/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Importa o módulo do sistema de arquivos (fs) para manipulação de arquivos.
// Importa funções para obter todos os posts, obter um post por ID e criar um novo post 
// do módulo "postsModel.js".
export async function listAll(req, res){
    // Função assíncrona para listar todos os posts.
    const resultado = await getAll();
    // Chama a função getAll() para obter todos os posts e aguarda a resposta.
    if(resultado != null && resultado.length > 0){
        // Se houver resultados, retorna um status 200 (sucesso) com os dados em formato JSON.
        return res.status(200).json(resultado);
     }else{
        // Se não houver resultados, retorna um status 404 (não encontrado).
         return res.status(404).send("Nenhum dado encontrado!");
    }
}

export async function getItem(req, res){
    // Função assíncrona para obter um post por ID.
    let resultado = await getItemId(req.params.id);
    // Obtém o ID do post a partir dos parâmetros da requisição e chama a função getItemId().
    if(resultado != null)
        // Se o post for encontrado, retorna um status 200 (sucesso) com os dados em formato JSON.
        return res.status(200).json(resultado);
    else 
        // Se o post não for encontrado, retorna um status 404 (não encontrado).
        return res.status(404).send("Nenhum dado encontrado!");
}

export async function createPost(req, res){
    // Função assíncrona para criar um novo post.
    const novoPost = req.body;
    // Obtém os dados do novo post a partir do corpo da requisição.

    try{
         // Tenta criar o novo post.
         const postCriado = await postCreate(novoPost);
         // Se a criação for bem-sucedida, retorna um status 200 (sucesso) com os dados do post criado.
         return res.status(200).json(postCriado);
    }catch(erro){
         // Se ocorrer um erro, registra o erro no console e retorna um status 500 (erro interno do servidor).
         console.error(erro.message);
         return res.status(500).json({"Erro":"Falha na requisição"});
    }
}

export async function uploadImage(req, res){
    // Função assíncrona para fazer upload de uma imagem e criar um novo post.
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt:req.file.originalname
    }
    // Cria um novo objeto de post com os dados da imagem.
    try{
        // Tenta criar o novo post.
        const postImagem = await postCreate(novoPost);
        // Renomeia o arquivo da imagem para um nome único e move para a pasta de uploads.
        const imagemAtualizada = `uploads/${postImagem.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada);
        // Retorna um status 200 (sucesso) com os dados do post criado.
        return res.status(200).json(postImagem);
    }catch(erro){
        // Se ocorrer um erro, registra o erro no console e retorna um status 500 (erro interno do servidor).
         console.error(erro.message);
        return res.status(500).json({"Erro":"Falha na requisição"});
    }    
}

export async function updateUpload(req, res){
    const id = req.params.id;
    const urlImagem = `http://localhost:3003/uploads/${id}.png`;    
    
    try{
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao =  await gerarDescricaoComGemini(req.body.alt,imageBuffer);
        const updatePost = {
            imgUrl : urlImagem,
            descricao : descricao,//req.body.descricao,
            alt : req.body.alt
        }
        const postUpdated = await postUpdate(id, updatePost);
        res.status(200).json(postUpdated);
    }catch(erro){
        console.error(erro.message);
        return res.status(500).json({"Erro":"Falha na requisição"});
    }
}
