const dbConnection = require('../../config/dbConnection');

module.exports.entrada = function(app, req, res) {
    
    // captura os dados de entrada para o diagnóstico //
    
    res.render("diagnostico/entrada", {validacao : {}, analise : {} });   
    
}

module.exports.entrada_salvar = async function(app, req, res) {

    // verifica os dados de entrada para o diagnóstico //

    var analise = req.body;
    req.assert('sistema', 'O nome do sistema é obrigatório').notEmpty();
    req.assert('dt_inicio', 'A data de início é obrigatória').isDate();
    req.assert('dt_fim', 'A data de fim é obrigatória').isDate();
    req.assert('qt_resp', 'A quantidade de usuários é obrigatória').notEmpty();    
    var erros = req.validationErrors();
    if (erros) {
        res.render("diagnostico/entrada", {validacao : erros, analise : analise});
        return;
    } 
    
    // salva os dados de entrada para o diagnóstico//

    var connection = await dbConnection();
    var saidaModel = new app.app.models.questoesDAO(connection);    
    saidaModel.salvarEntrada(analise, function(error, result){
        res.render("diagnostico/saida", {validacao : {}, analise : analise });
    });
}

module.exports.saida = async function(app, req, res) {
    
    // captura as respostas dos questionários //  
    
    var connection = await dbConnection();
    var saidaModel = new app.app.models.questoesDAO(connection);          
    saidaModel.getSaida(questoes, function(error, result){
        res.render("diagnostico/saida", {validacao : {}, questoes : questoes });
    });
    var questoes = req.body;
    
    // inicialização de variáveis //

    var sugestoes = "";
    var soma_usuarios_internos = 0;
    var qt_usuarios_internos = 0;
    var soma_usuarios_externos = 0;
    var qt_usuarios_externos = 0;
    var calc_r1 = 0;
    var calc_r2 = 0;
    var calc_r3 = 0;
    var calc_r41 = 0;
    var calc_r42 = 0;
    var calc_r43 = 0;
    var calc_r5 = 0;
    var calc_r6 = 0;
    var calc_r7 = 0;
    var grau_congruencia = 0;
    var qt_respostas_zeradas = 0;
        
    // processamento //

    for (var i=0; i < questoes.length; i++) {

        // pegando a data do registro e selecionando as questões situadas no intervalo //
        
        data_registro = questoes[i].dt_registro.slice(0,9);

        if (data_registro <= analise.dt_fim && data_registro >= analise.dt_inicio) {
                             
            // soma das respostas //
        
            soma_questao = questoes[i].questao_01 + questoes[i].questao_02 + questoes[i].questao_03 + questoes[i].questao_04 + questoes[i].questao_05 + questoes[i].questao_06 + questoes[i].questao_07 + questoes[i].questao_08 + questoes[i].questao_09 + questoes[i].questao_10 + questoes[i].questao_11 + questoes[i].questao_12 + questoes[i].questao_13 + questoes[i].questao_14 + questoes[i].questao_15 + questoes[i].questao_16 + questoes[i].questao_17 + questoes[i].questao_18 + questoes[i].questao_19 + questoes[i].questao_20 + questoes[i].questao_21;

            // agrupar algumas respostas em aspectos, para ordenação por maior criticidade (menor valor) //

            normatividade = questoes[i].questao_08 + questoes[i].questao_21;
            compreensao = questoes[i].questao_01;
            exatidao = questoes[i].questao_02 + questoes[i].questao_06 + questoes[i].questao_09;
            utilidade = questoes[i].questao_03 + questoes[i].questao_04 + questoes[i].questao_13;
            confiabilidade = questoes[i].questao_05 + questoes[i].questao_11 + questoes[i].questao_12;
            atualidade = questoes[i].questao_07;
            rapidez = questoes[i].questao_10;
            completude = questoes[i].questao_14;
            satisfacao = questoes[i].questao_15 + questoes[i].questao_20;
            facilidade_uso = questoes[i].questao_16 + questoes[i].questao_17 + questoes[i].questao_19;
            facilidade_aprendizagem = questoes[i].questao_18;

            // variáveis para o cálculo da correlação de postos de Spearman //

            calc_r1 += (questoes[i].questao_06 - questoes[i].questao_09)**2;
            calc_r2 += (questoes[i].questao_11 - questoes[i].questao_12)**2;
            calc_r3 += (questoes[i].questao_15 - questoes[i].questao_20)**2;
            calc_r41 += (questoes[i].questao_16 - questoes[i].questao_17)**2;
            calc_r42 += (questoes[i].questao_16 - questoes[i].questao_19)**2;
            calc_r43 += (questoes[i].questao_17 - questoes[i].questao_19)**2;
            calc_r5 += (questoes[i].questao_16 - questoes[i].identificacao_02)**2;
            calc_r6 += (questoes[i].questao_20 - questoes[i].identificacao_03)**2;
            calc_r7 += (questoes[i].questao_18 - questoes[i].identificacao_04)**2;
                        
            if (questoes[i].identificacao_01 == "0") { 
                soma_usuarios_internos += soma_questao; // somas dos usuários internos //
                qt_usuarios_internos++;

                // deduzir a quantidade de respostas iguais a zero ("não se aplica") //

                if (questoes[i].questao_01 == 0) {
                    qt_respostas_zeradas ++;
                }
                if (questoes[i].questao_02 == 0) {
                    qt_respostas_zeradas ++;
                } 
                if (questoes[i].questao_03 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_04 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_05 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_06 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_07 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_08 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_09 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_10 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_11 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_12 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_13 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_14 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_15 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_16 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_17 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_18 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_19 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_20 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_21 == 0) {
                    qt_respostas_zeradas ++;
                }

                qt_usuarios_internos -= qt_respostas_zeradas;

            } else {
                soma_usuarios_externos += soma_questao; // somas dos usuários externos //
                qt_usuarios_externos++;

                // deduzir a quantidade de respostas iguais a zero ("não se aplica") //

                if (questoes[i].questao_01 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_02 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_03 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_04 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_05 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_06 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_07 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_08 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_09 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_10 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_11 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_12 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_13 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_14 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_15 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_16 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_17 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_18 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_19 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_20 == 0) {
                    qt_respostas_zeradas ++;
                }    
                if (questoes[i].questao_21 == 0) {
                    qt_respostas_zeradas ++;
                }                    
                
                qt_usuarios_externos -= qt_respostas_zeradas;                
            }

            sugestoes += questoes[i].questao_22; // acumulação das sugestoes (texto) //
        }       
    }

    // cálculo do tamanho das amostras mínimas //
    
    amostra_internos = (analise.qt_resp_int * 0.5 * 1.96**2) / ((0.5 * 1.96**2) + (analise.qt_resp.int-1) * 0.05**2);

    amostra_externos = (analise.qt_resp_ext * 0.5 * 1.96**2) / ((0.5 * 1.96**2) + (analise.qt_resp.ext-1) * 0.05**2);

    if (amostra_internos <= analise.qt_resp_int && amostra_externos <= analise.qt_resp_ext) {
        analise.amostra_significativa = true;
    } else {
        analise.amostra_significativa = false;
    }
    
    // cálculo da admissão da amostra = análise de congruência //
    
    // variáveis de congruência: r1, r2, r3, r41, r42, r43, r5, r6 e r7 //

    // cálculo da correlação de postos de Spearman //

    r1 = 1 - ( (6 * calc_r1) / (analise.qt_resp - (analise.qt_resp**2 - 1)) );
    r2 = 1 - ( (6 * calc_r2) / (analise.qt_resp - (analise.qt_resp**2 - 1)) );
    r3 = 1 - ( (6 * calc_r3) / (analise.qt_resp - (analise.qt_resp**2 - 1)) );
    r41 = 1 - ( (6 * calc_r41) / (analise.qt_resp - (analise.qt_resp**2 - 1)) );
    r42 = 1 - ( (6 * calc_r42) / (analise.qt_resp - (analise.qt_resp**2 - 1)) );
    r43 = 1 - ( (6 * calc_r43) / (analise.qt_resp - (analise.qt_resp**2 - 1)) );
    r5 = 1 - ( (6 * calc_r5) / (analise.qt_resp - (analise.qt_resp**2 - 1)) );
    r6 = 1 - ( (6 * calc_r6) / (analise.qt_resp - (analise.qt_resp**2 - 1)) );
    r7 = 1 - ( (6 * calc_r7) / (analise.qt_resp - (analise.qt_resp**2 - 1)) );

    // cálculo de z para o teste de hipótese da correlação //

    z1 = r1 * Math.sqrt(r1-1);
    z2 = r2 * Math.sqrt(r2-1);
    z3 = r3 * Math.sqrt(r3-1);
    z41 = r41 * Math.sqrt(r41-1);
    z42 = r42 * Math.sqrt(r42-1);
    z43 = r43 * Math.sqrt(r43-1);
    z5 = r5 * Math.sqrt(r5-1);
    z6 = r6 * Math.sqrt(r6-1);
    z7 = r7 * Math.sqrt(r7-1);
    
    // se z estiver dentro da "região crítica" tem-se a correlação como verdadeira para o par de variáveis analisadas, adicionando +1 em grau_congruencia //

    if (z1 > 1.96) {
        grau_congruencia++;
    }
    if (z2 > 1.96) {
        grau_congruencia++;
    }    
    if (z3 > 1.96) {
        grau_congruencia++;
    }    
    if (z41 > 1.96) {
        grau_congruencia++;
    }    
    if (z42 > 1.96) {
        grau_congruencia++;
    }    
    if (z43 > 1.96) {
        grau_congruencia++;
    }    
    if (z5 > 1.96) {
        grau_congruencia++;
    }    
    if (z6 > 1.96) {
        grau_congruencia++;
    }    
    if (z7 > 1.96) {
        grau_congruencia++;
    }
  
    // resultados das variáveis de análise //

    analise.qt_resp = qt_usuarios_internos + qt_usuarios_externos;    
    analise.nota_usuarios_internos = soma_usuarios_internos / qt_usuarios_internos;
    analise.nota_usuarios_externos = soma_usuarios_externos / qt_usuarios_externos;
    analise.nota_final = (analise.nota_usuarios_internos * 7 + analise.nota_usuarios_externos * 3) / 10;    
    analise.grau_congruencia = grau_congruencia;

    // resultado usuários internos e externos //

    if (analise.nota_usuarios_internos < 42 ) {
        analise.resultado_ui = "sistema deve ser substituído";
    } else if (analise.nota_usuarios_internos < 63) {
        analise.resultado_ui = "sistema precisa de ajustes";
    } else {
        analise.resultado_ui = "sistema não necessita de alterações";
    }
    
    if (analise.nota_usuarios_externos < 42 ) {
        analise.resultado_ue = "sistema deve ser substituído";
    } else if (analise.nota_usuarios_externos < 63) {
        analise.resultado_ue = "sistema precisa de ajustes";
    } else {
        analise.resultado_ue = "sistema não necessita de alterações";
    }
    
    // resultado geral //
    
    if (analise.nota_final < 42 ) {
        analise.resultado = "sistema deve ser substituído";
    } else if (analise.nota_final < 63) {
        analise.resultado = "sistema precisa de ajustes";
    } else {
        analise.resultado = "sistema não necessita de alterações";
    }

    // salvar as variáveis dos aspectos de maior criticidade //
    
    analise.normatividade = normatividade;
    analise.compreensao = compreensao;
    analise.exatidao = exatidao;
    analise.utilidade = utilidade;
    analise.confiabilidade = confiabilidade;
    analise.atualidade = atualidade;
    analise.rapidez = rapidez;
    analise.completude = completude;
    analise.satisfacao = satisfacao;
    analise.facilidade_uso = facilidade_uso;
    analise.facilidade_aprendizagem = facilidade_aprendizagem;
    
    // apresentar os aspectos de maior criticidade em ordem crescente //


    // Análise da variável sugestoes //
    
    /* 1. separar em núcleos factuais:
    a) sugestoes_usuarios_internos e sugestoes_usuarios_externos
    b) sugestoes_usuarios_experientes e sugestoes_usuarios_neofitos */

    /* 2. extrair palavras relevantes:
    2.1) selecionar os aspectos de maior criticidade; 
    2.2) extrair palavras dos campos sugestoes (palavras acima de três letras);
    2.3) ver a frequência com que aparecem;
    2.4) retornar o resultado segmentado por núcleos factuais. */

    // salva e apresenta os dados do diagnóstico //

    res.render("diagnostico/saida", {validacao : {}, analise : analise });
    var analise = req.body;
    var connection = app.config.dbConnection();
    var saidaModel = new app.app.models.questoesDAO(connection);
    saidaModel.salvarEntrada(analise, function(error, result)
    {
        res.redirect('/saida');
    });
}