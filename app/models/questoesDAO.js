function questoesDAO(connection){
    this._connection = connection;
}

questoesDAO.prototype.getSaida = function(callback){
    this._connection.query('select * from questoes', callback);
}

questoesDAO.prototype.getAnalise = function(callback){
    this._connection.query('select * from analise', callback);
}

questoesDAO.prototype.getCriticidade = function(callback){
    this._connection.query('select normatividade, compreensao, exatidao, utilidade, confiabilidade, atualidade, rapidez, completude, satisfacao, facilidade_uso, facilidade_aprendizagem from analise order by asc', callback);
}

questoesDAO.prototype.salvarQuestao = function(questoes, callback){
    console.log(questoes);
    this._connection.query('insert into questoes set ?', questoes, callback);
}

questoesDAO.prototype.salvarEntrada = function(analise, callback){
    console.log(analise);
    this._connection.query('insert into analise set ?', analise, callback);
}

module.exports = function() {
    return questoesDAO;
}