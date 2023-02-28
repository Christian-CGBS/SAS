/* PRIMEIRA TENTATIVA DE CONEXÃO COM O MONGO

var mongo = require('mongodb');

var connMongoDB = function(){
    console.log('entrou na função de conexão');
    var db = new mongo.Db(
        'banco_questoes',
        new mongo.Server(
            'localhost', // string contendo o endereço do servidor
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

/* SEGUNDA TENTATIVA DE CONEXÃO COM O MONGO 
const {MongoClient, ObjectId} = require("mongodb");

let singleton;

async function connect(){
    if (singleton) return singleton;

    const client = new MongoClient(process.env.MONGO_HOST);

    await client.connnect();

    singleton = client.db(process.env.MONGO_DATABASE);
    return singleton;    

} */