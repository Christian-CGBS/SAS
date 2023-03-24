const {MongoClient, ObjectId} = require("mongodb");

require('dotenv').config();

let singleton;

async function connect(){
    if (singleton) return singleton;

    const client = new MongoClient(process.env.MONGODB_HOST);

    await client.connect();
    console.log('conexão com o bd efetuado com sucesso!');

    singleton = client.db('banco_questoes');
    return singleton;
}
module.exports = connect;

