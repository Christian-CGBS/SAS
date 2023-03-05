const dbConnection = require('../../config/dbConnection');

module.exports.entrada = function(app, req, res) {    
    // captura os dados de entrada para ANALISE
    res.render("diagnostico/entrada", {validacao : {}, analise : {} });    
}

module.exports.saida_vazia = async function(app, req, res) {    
    // retorna tela vazia se não foram encontrados registros
    res.render("diagnostico/saida_vazia");
}

module.exports.saida = async function(app, req, res) {
    // apresenta os dados de ANALISE
    var connection = await dbConnection();
    var saidaModel = new app.app.models.questoesDAO(connection);
    const resultado_analise = await saidaModel.getAnalise();
    const analise = await resultado_analise.toArray();

    // apresentar os aspectos de maior criticidade em ordem crescente //
    const criticidade = [
        {nome:"normatividade", valor:analise[0].normatividade},
        {nome:"compreensao", valor:analise[0].compreensao},
        {nome:"exatidao", valor:analise[0].exatidao},
        {nome:"utilidade", valor:analise[0].utilidade},
        {nome:"confiabilidade", valor:analise[0].confiabilidade},
        {nome:"atualidade", valor:analise[0].atualidade},
        {nome:"rapidez", valor:analise[0].rapidez},
        {nome:"completude", valor:analise[0].completude},
        {nome:"satisfacao", valor:analise[0].satisfacao},
        {nome:"facilidade_uso", valor:analise[0].facilidade_uso},
        {nome:"facilidade_aprendizagem", valor:analise[0].facilidade_aprendizagem}
    ]
    criticidade.sort(function(a, b){return a.valor - b.valor});

    // convertendo as datas de início e fim da pesquisa para o formato BR
    i = new Date(analise[0].dt_inicio);
    analise[0].dt_inicio = i.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
    f = new Date(analise[0].dt_fim);
    analise[0].dt_fim = f.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
        
    console.log('ANALISE antes da saída ', analise, criticidade);
    res.render("diagnostico/saida", {analise: analise[0], criticidade});
}

module.exports.entrada_salvar = async function(app, req, res) {
    // verifica os dados de entrada ANALISE

    var analise = req.body;
    console.log('como chegam os dados de entrada de ANALISE:', analise);
    req.assert('sistema', 'O nome do sistema é obrigatório').notEmpty();
    req.assert('dt_inicio', 'A data de início é obrigatória').isDate();
    req.assert('dt_fim', 'A data de fim é obrigatória').isDate();
    req.assert('qt_resp_int', 'A quantidade de usuários internos é obrigatória').notEmpty();    
    var erros = req.validationErrors();
    if (erros) {
        res.render("diagnostico/entrada", {validacao : erros, analise : analise});
        return;
    } 
    
    // Pegando a collection QUESTOES

    var connection = await dbConnection();
    var saidaModel = new app.app.models.questoesDAO(connection);          
    var resultado_saida = await saidaModel.getSaida();         
    var questoes = await resultado_saida.toArray();
    
    // convertendo as variáveis de string para numérico
                                                // dados informados na entrada do diagnóstico
    analise.qt_resp_int = Number(analise.qt_resp_int); // quantidade de respondentes internos
    analise.qt_resp_ext = Number(analise.qt_resp_ext); // quantidade de respondentes externos
    
    // inicialização de variáveis

    var sugestoes = "";

    var qt_usuario_interno = 0;              // (a) quantidade de usuários internos que responderam
                                             //  servirá para o cálculo da amostra junto com qt_resp_int
    var qt_resp_usuario_interno = 0;         // (b) quantidade de respostas dos usuários internos
    var qt_resp_usuario_interno_zerada = 0;  // (c) quantidade de respostas dos usuários internos ZERADAS
    var soma_usuario_interno = 0;            // (d) soma dos valores das questões dos usuários internos
                                             //         MÉDIA = d / (b - c)

    var qt_usuario_externo = 0;              // (a) quantidade de usuários externos que responderam
                                             //  servirá para o cálculo da amostra junto com qt_resp_ext
    var qt_resp_usuario_externo = 0;         // (b) quantidade de respostas dos usuários externos
    var qt_resp_usuario_externo_zerada = 0;  // (c) quantidade de respostas dos usuários externos ZERADAS
    var soma_usuario_externo = 0;            // (d) soma dos valores das questões dos usuários externos
                                             //         MÉDIA = d / (b - c)
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

    var normatividade = 0;
    var compreensao = 0;
    var exatidao = 0;
    var utilidade = 0;
    var confiabilidade = 0;
    var atualidade = 0;
    var rapidez = 0;
    var completude = 0;
    var satisfacao = 0;
    var facilidade_uso = 0;
    var facilidade_aprendizagem = 0;
            
    // processamento

    for (var i=0; i < questoes.length; i++) {

        // pegando a data do documento (registro)
        
        data_registro = questoes[i].dt_registro;
        
        // verificando se o documento se situa no intervalo de tempo informado
        
        dt_reg = new Date(data_registro).getTime();
        dt_in = new Date(analise.dt_inicio).getTime();
        dt_fm = new Date(analise.dt_fim).getTime();

        console.log('data do documento em questoes = ', data_registro, dt_reg);
        console.log('data de início da análise =', analise.dt_inicio, dt_in);
        console.log('data de fim da análise =', analise.dt_fim, dt_fm);        

        if (dt_reg >= dt_in && dt_reg <= dt_fm) {
                             
            // soma das respostas das questoes
        
            soma_questao = questoes[i].questao_01 + questoes[i].questao_02 + questoes[i].questao_03 + questoes[i].questao_04 + questoes[i].questao_05 + questoes[i].questao_06 + questoes[i].questao_07 + questoes[i].questao_08 + questoes[i].questao_09 + questoes[i].questao_10 + questoes[i].questao_11 + questoes[i].questao_12 + questoes[i].questao_13 + questoes[i].questao_14 + questoes[i].questao_15 + questoes[i].questao_16 + questoes[i].questao_17 + questoes[i].questao_18 + questoes[i].questao_19 + questoes[i].questao_20 + questoes[i].questao_21;

            // agrupar algumas respostas em aspectos, para ordenação por maior criticidade (menor valor)

            normatividade += questoes[i].questao_08 + questoes[i].questao_21;
            compreensao += questoes[i].questao_01;
            exatidao += questoes[i].questao_02 + questoes[i].questao_06 + questoes[i].questao_09;
            utilidade += questoes[i].questao_03 + questoes[i].questao_04 + questoes[i].questao_13;
            confiabilidade += questoes[i].questao_05 + questoes[i].questao_11 + questoes[i].questao_12;
            atualidade += questoes[i].questao_07;
            rapidez += questoes[i].questao_10;
            completude += questoes[i].questao_14;
            satisfacao += questoes[i].questao_15 + questoes[i].questao_20;
            facilidade_uso += questoes[i].questao_16 + questoes[i].questao_17 + questoes[i].questao_19;
            facilidade_aprendizagem += questoes[i].questao_18;

            // variáveis para o cálculo da correlação de postos de Spearman

            calc_r1 += (questoes[i].questao_06 - questoes[i].questao_09)**2;
            calc_r2 += (questoes[i].questao_11 - questoes[i].questao_12)**2;
            calc_r3 += (questoes[i].questao_15 - questoes[i].questao_20)**2;
            calc_r41 += (questoes[i].questao_16 - questoes[i].questao_17)**2;
            calc_r42 += (questoes[i].questao_16 - questoes[i].questao_19)**2;
            calc_r43 += (questoes[i].questao_17 - questoes[i].questao_19)**2;
            calc_r5 += (questoes[i].questao_16 - questoes[i].identificacao_02)**2;
            calc_r6 += (questoes[i].questao_20 - questoes[i].identificacao_03)**2;
            calc_r7 += (questoes[i].questao_18 - questoes[i].identificacao_04)**2;
                        
            if (questoes[i].identificacao_01 == 0) { 
                soma_usuario_interno += soma_questao; // somas dos usuários internos
                qt_usuario_interno++;

                // obter a quantidade de respostas iguais a zero ("não se aplica")

                if (questoes[i].questao_01 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }
                if (questoes[i].questao_02 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                } 
                if (questoes[i].questao_03 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_04 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_05 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_06 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_07 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_08 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_09 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_10 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_11 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_12 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_13 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_14 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_15 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_16 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_17 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_18 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_19 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_20 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }    
                if (questoes[i].questao_21 == 0) {
                    qt_resp_usuario_interno_zerada ++;
                }
                
            } else {
                soma_usuario_externo += soma_questao; // somas dos usuários externos
                qt_usuario_externo++;

                // obter a quantidade de respostas iguais a zero ("não se aplica")

                if (questoes[i].questao_01 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_02 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_03 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_04 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_05 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_06 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_07 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_08 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_09 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_10 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_11 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_12 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_13 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_14 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_15 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_16 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_17 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_18 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_19 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_20 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }    
                if (questoes[i].questao_21 == 0) {
                    qt_resp_usuario_externo_zerada ++;
                }                         
            }
            sugestoes = sugestoes + " " + questoes[i].questao_22; // acumulação das sugestoes (texto)

        } else {
            console.log('registro ',i, ' não pertence ao período de pesquisa informado');
        }
    
        qt_resp_usuario_interno += (21 - qt_resp_usuario_interno_zerada);
        if (qt_usuario_externo > 0) {
            qt_resp_usuario_externo += (21 - qt_resp_usuario_externo_zerada);
        }         
    
    }  /// fim da estrutura (laço - "for") que examina as questões de um formulário
    
    qt_resp = qt_usuario_interno + qt_usuario_externo;  // total de respondentes
        
    if (qt_resp > 0) { // só analisa se houver documentos selecionados

        // cálculo do tamanho das amostras mínimas
        // analise.qt_resp_int > 0 (quantidade de usuários internos é sempre positiva)

        amostra_internos = (analise.qt_resp_int * 0.5 * 1.96**2) / ((0.5 * 1.96**2) + (analise.qt_resp_int-1) * 0.05**2);

        // a amostra para usuários externos só é calculada se analise.qt_resp_ext > 0

        if (analise.qt_resp_ext > 0) {
            amostra_externos = (analise.qt_resp_ext * 0.5 * 1.96**2) / ((0.5 * 1.96**2) + (analise.qt_resp_ext-1) * 0.05**2);
        } else {
            amostra_externos = 0;
        }
        
        if (amostra_internos <= qt_usuario_interno && amostra_externos <= qt_usuario_externo) {
            analise.amostra_significativa = "S";
        } else {
            analise.amostra_significativa = "N";
        }
        
        // cálculo da admissão da amostra = análise de congruência    
        // variáveis de congruência: r1, r2, r3, r41, r42, r43, r5, r6 e r7
        // cálculo da correlação de postos de Spearman

        r1 = 1 - ( (6 * calc_r1) / (qt_resp - (qt_resp**2 - 1)) );
        r2 = 1 - ( (6 * calc_r2) / (qt_resp - (qt_resp**2 - 1)) );
        r3 = 1 - ( (6 * calc_r3) / (qt_resp - (qt_resp**2 - 1)) );
        r41 = 1 - ( (6 * calc_r41) / (qt_resp - (qt_resp**2 - 1)) );
        r42 = 1 - ( (6 * calc_r42) / (qt_resp - (qt_resp**2 - 1)) );
        r43 = 1 - ( (6 * calc_r43) / (qt_resp - (qt_resp**2 - 1)) );
        r5 = 1 - ( (6 * calc_r5) / (qt_resp - (qt_resp**2 - 1)) );
        r6 = 1 - ( (6 * calc_r6) / (qt_resp - (qt_resp**2 - 1)) );
        r7 = 1 - ( (6 * calc_r7) / (qt_resp - (qt_resp**2 - 1)) );

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

        analise.qt_resp = qt_usuario_interno + qt_usuario_externo;
        analise.sugestoes = sugestoes;

        console.log ('var soma_usuario_interno = ', soma_usuario_interno);
        console.log('var qt_resp_usuario_interno = ', qt_resp_usuario_interno);
        console.log('var qt_resp_usuario_interno_zerada = ', qt_resp_usuario_interno_zerada);

        console.log ('var soma_usuario_externo = ', soma_usuario_externo);
        console.log('var qt_resp_usuario_externo = ', qt_resp_usuario_externo);
        console.log('var qt_resp_usuario_externo_zerada = ', qt_resp_usuario_externo_zerada);

        analise.nota_usuario_interno = soma_usuario_interno / (qt_resp_usuario_interno-qt_resp_usuario_interno_zerada);

        if (qt_usuario_externo > 0) {
            analise.nota_usuario_externo = soma_usuario_externo / (qt_resp_usuario_externo-qt_resp_usuario_externo_zerada);
            analise.nota_final = (analise.nota_usuario_interno * 7 + analise.nota_usuario_externo * 3) / 10;
        } else {
            analise.nota_usuario_externo = 0;
            analise.nota_final = analise.nota_usuario_interno;
        }    
        
        analise.grau_congruencia = grau_congruencia;

        // resultado usuários internos e externos //

        if (analise.nota_usuario_interno < 42 ) {
            analise.resultado_ui = "sistema deve ser substituído";
        } else if (analise.nota_usuario_interno < 63) {
            analise.resultado_ui = "sistema precisa de ajustes";
        } else {
            analise.resultado_ui = "sistema não necessita de alterações";
        }
        
        if (qt_usuario_externo > 0) {
            if (analise.nota_usuario_externo < 42 ) {
                analise.resultado_ue = "sistema deve ser substituído";
            } else if (analise.nota_usuario_externo < 63) {
                analise.resultado_ue = "sistema precisa de ajustes";
            } else {
                analise.resultado_ue = "sistema não necessita de alterações";
            }
        } else {
            analise.resultado_ue = "não há usuários externos";
        }
            
        // resultado geral //
        
        if (analise.nota_final < 42 ) {
            analise.resultado = "sistema deve ser substituído";
        } else if (analise.nota_final < 63) {
            analise.resultado = "sistema precisa de ajustes";
        } else {
            analise.resultado = "sistema não necessita de alterações";               
        }
        
        // arrendondando para duas casas decimais as notas obtidas
        analise.nota_usuario_interno = analise.nota_usuario_interno.toFixed(2);
        analise.nota_usuario_externo = analise.nota_usuario_externo.toFixed(2);
        analise.nota_final = analise.nota_final.toFixed(2);

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
        
        // Análise da variável sugestoes
        
        /* 1. separar em núcleos factuais:
        a) sugestoes_usuarios_internos e sugestoes_usuarios_externos
        b) sugestoes_usuarios_experientes e sugestoes_usuarios_neofitos */

        /* 2. extrair palavras relevantes:
        2.1) selecionar os aspectos de maior criticidade; 
        2.2) extrair palavras dos campos sugestoes (palavras acima de três letras);
        2.3) ver a frequência com que aparecem;
        2.4) retornar o resultado segmentado por núcleos factuais. */

        // pega a data e salva os dados da ANALISE
        
        var d = new Date();
        analise.dt_registro = d.toISOString();
        
        saidaModel.salvarEntrada(analise, function(error, result)
            {
                res.redirect('/saida');
            });       
    } else {  // desvia para a saída vazia se registros não encontrados
        res.redirect("/saida_vazia");        
    }
}