const dbConnection = require('../../config/dbConnection');

module.exports.formulario = function(app, req, res) {
    res.render("questionario/formulario", {validacao : {}, questoes : {} });
    }

module.exports.questoes_salvar = async function(app, req, res){
    var questoes = req.body;
    req.assert('questao_01', 'A questão 01 é obrigatória').notEmpty();
    req.assert('questao_02', 'A questão 02 é obrigatória').notEmpty();
    req.assert('questao_03', 'A questão 03 é obrigatória').notEmpty();
    req.assert('questao_04', 'A questão 04 é obrigatória').notEmpty();
    req.assert('questao_05', 'A questão 05 é obrigatória').notEmpty();
    req.assert('questao_06', 'A questão 06 é obrigatória').notEmpty();
    req.assert('questao_07', 'A questão 07 é obrigatória').notEmpty();
    req.assert('questao_08', 'A questão 08 é obrigatória').notEmpty();
    req.assert('questao_09', 'A questão 09 é obrigatória').notEmpty();
    req.assert('questao_10', 'A questão 10 é obrigatória').notEmpty();
    req.assert('questao_11', 'A questão 11 é obrigatória').notEmpty();
    req.assert('questao_12', 'A questão 12 é obrigatória').notEmpty();
    req.assert('questao_13', 'A questão 13 é obrigatória').notEmpty();
    req.assert('questao_14', 'A questão 14 é obrigatória').notEmpty();
    req.assert('questao_15', 'A questão 15 é obrigatória').notEmpty();
    req.assert('questao_16', 'A questão 16 é obrigatória').notEmpty();
    req.assert('questao_17', 'A questão 17 é obrigatória').notEmpty();
    req.assert('questao_18', 'A questão 18 é obrigatória').notEmpty();
    req.assert('questao_19', 'A questão 19 é obrigatória').notEmpty();
    req.assert('questao_20', 'A questão 20 é obrigatória').notEmpty();
    req.assert('questao_21', 'A questão 21 é obrigatória').notEmpty();
    req.assert('identificacao_01', 'A questão 01 da identificação é obrigatória').notEmpty();
    req.assert('identificacao_02', 'A questão 02 da identificação é obrigatória').notEmpty();
    req.assert('identificacao_03', 'A questão 03 da identificação é obrigatória').notEmpty();
    req.assert('identificacao_04', 'A questão 04 da identificação é obrigatória').notEmpty();
    req.assert('identificacao_05', 'A questão 05 da identificação deve ser do tipo e-mail').isEmail();

    var erros = req.validationErrors();

    if (erros) {
        res.render("questionario/formulario", {validacao : erros, questoes : questoes});
        return;
    }

    var connection = await dbConnection();
    
    var saidaModel = new app.app.models.questoesDAO(connection);

    saidaModel.salvarQuestao(questoes, function(error, result){
        console.log(error, result);
        res.redirect('/final');
    });
}