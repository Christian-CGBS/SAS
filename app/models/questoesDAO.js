function questoesDAO(connection){
    this._connection = connection;
}

questoesDAO.prototype.salvarQuestao = async function(questoes, callback){
    await this._connection.collection('questoes').insertOne(questoes);
    callback();
}

questoesDAO.prototype.salvarEntrada = async function(analise, callback){
    console.log(analise);
    await this._connection.collection('analise').insertOne(analise);
    callback();
}

questoesDAO.prototype.getSaida = async function(){
    const result = await this._connection.collection('questoes').find();
    return result;
}

questoesDAO.prototype.getAnalise = async function(){
    const result = await this._connection.collection('analise').find();
    return result;
}

/*

questoesDAO.prototype.getCriticidade = function(callback){
    this._connection.query('select normatividade, compreensao, exatidao, utilidade, confiabilidade, atualidade, rapidez, completude, satisfacao, facilidade_uso, facilidade_aprendizagem from analise order by asc', callback);
} */

module.exports = function() {
    return questoesDAO;
}