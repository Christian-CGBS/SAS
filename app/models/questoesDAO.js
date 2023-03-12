function questoesDAO(connection){
    this._connection = connection;
}

questoesDAO.prototype.salvarQuestao = async function(questoes, callback){
    await this._connection.collection('questoes').insertOne(questoes);
    callback();
}

questoesDAO.prototype.salvarEntrada = async function(analise, callback){
    await this._connection.collection('analise').insertOne(analise);
    callback();
}

questoesDAO.prototype.getSaida = async function(){
    const result = await this._connection.collection('questoes').find();
    return result;
}

questoesDAO.prototype.getAnalise = async function(){
    const result = await this._connection.collection('analise').find().limit(1).sort({$natural:-1});
    return result;
}

module.exports = function() {
    return questoesDAO;
}