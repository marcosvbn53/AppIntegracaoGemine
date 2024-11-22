import { MongoClient } from 'mongodb';

export default async function conectarDb(stringConexao){
    let mongoClient;

    try{
        mongoClient = new MongoClient(stringConexao);
        console.log("Conectando ao cluster do banco de dados...");
        await mongoClient.connect();
        console.log("Conectando ao MongoDb Atlas com sucesso!");
        return mongoClient;
    }catch(erro){
        console.log(`Não foi possível realizar conexão : ${erro}`);
        process.exit();
    }
}

