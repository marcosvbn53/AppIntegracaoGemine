import conectarDb from "../config/db.js";
import { ObjectId } from "mongodb";

const conn = await conectarDb(process.env.STRING_CONEXAO);

export async function getAll(){
    const db = conn.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.find().toArray();
}

export async function getItemId(id){
    const db = conn.db("imersao-instabytes");
    const colecao = db.collection("posts");
    const objectId = new ObjectId(id);
    return colecao.find({_id:objectId}).toArray();
}

export async function postCreate(novoPost){
    const db = conn.db("imersao-instabytes");
    const colecao = db.collection("posts");

    return colecao.insertOne(novoPost);
}

export async function postUpdate(id, updatePost){
    const db = conn.db("imersao-instabytes");
    const colecao = db.collection("posts");
    const objectId = ObjectId.createFromHexString(id);
    return colecao.updateOne({ _id: new ObjectId(objectId)}, {$set:updatePost});
}