/* PRIMEIRA TENTATIVA DE CONEXÃO COM O MONGO */

/*

var mongo = require('mongodb');

var connMongoDB = function(){
    console.log('entrou na função de conexão');
    var db = new mongo.Db(
        'banco_questoes',
        new mongo.Server(
            'mongodb+srv://adminUser:123@cluster0.gs9ov1u.mongodb.net/?retryWrites=true&w=majority', // string contendo o endereço do servidor
            27017, //porta de entrada
            {}    
        ),
        {}       
    );
    return db;
}

module.exports = function() {
    return connMongoDB;
} */

/* SEGUNDA TENTATIVA DE CONEXÃO COM O MONGO  */
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

