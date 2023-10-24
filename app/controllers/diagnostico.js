const dbConnection = require('../../config/dbConnection');

"use strict"; // uso da biblioteca para para o índice de Spearman

const Spearman = require('spearman-rho'); // uso da biblioteca para para o índice de Spearman

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

    // apresentar os aspectos de maior criticidade em ordem crescente - os mais críticos são os de menor valor//
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

    // Análise da variável sugestoes
    // pegar o conteúdo do campo 'sugestões'
    sugestoes = analise[0].sugestoes;
    // contar as palavras
    contador = sugestoes.split(" ").length;
    // colocar as palavras numa matriz de substrings
    palavras = sugestoes.split(" ");
    // pegar as palavras repetidas
    repetidas = {};
    // retirar os caracteres especiais das palavras    
    const palavrasTratadas = palavras.map(palavras => palavras.replace(/[^\w\sáàâãéèêíïóôõöúçñ]/gi, ''));
    // pegar as frequências das palavras repetidas
    for (let i=0; i < contador; i++) {
        repetidas[palavrasTratadas[i].toLowerCase()] = sugestoes.match(new RegExp(palavrasTratadas[i],'gi'))?.length ?? 0; 
    }
    // considerar apenas as palavras com mais de 3 caracteres e colocá-las em ordem decrescente de frequência
    const resultado = Object.entries(repetidas).sort(([,a],[,b]) => b-a).filter(([a]) => a.length>3);
    // pegar as 10 primeiras palavras de maior frequência
    const final = resultado.slice(0, 10);
    
    // convertendo as datas de início e fim da pesquisa para o formato BR, apenas para fins de exibição na saída
    i = new Date(analise[0].dt_inicio);
    analise[0].dt_inicio = i.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
    f = new Date(analise[0].dt_fim);
    analise[0].dt_fim = f.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
        
    res.render("diagnostico/saida", {analise: analise[0], criticidade, final, sugestoes});
}

module.exports.entrada_salvar = async function(app, req, res) {
    // verifica os dados de entrada ANALISE

    var analise = req.body;    
    req.assert('sistema', 'É necessário informar o sistema').notEmpty();
    req.assert('dt_inicio', 'A data de início é obrigatória').isDate();
    req.assert('dt_fim', 'A data de fim é obrigatória').isDate();
    req.assert('qt_usu_int', 'A quantidade de usuários internos é obrigatória').notEmpty();    
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
    analise.qt_usu_int = Number(analise.qt_usu_int);       // quantidade de usuários internos
    analise.qt_usu_ext = Number(analise.qt_usu_ext);       // quantidade de usuários externos
    
    // inicialização de variáveis

    var sugestoes = "";

    var qt_resp_int = 0;       // (a) quantidade de usuários internos que responderam
    var soma_resp_int = 0;     // (b) soma dos valores das questões dos respondentes internos
                               //     MÉDIA = b / a

    var qt_resp_ext = 0;       // (c) quantidade de usuários externos que responderam    
    var soma_resp_ext = 0;     // (d) soma dos valores das questões dos respondentes externos
                               //     MÉDIA = d / c

    // variáveis para o cálculo do grau de congruência da amostra
    // técnica da correlação de postos de Spearman

    /*var calc_r1 = 0;  
    var calc_r2 = 0;
    var calc_r3 = 0;  
    var calc_r41 = 0;
    var calc_r42 = 0;
    var calc_r43 = 0;
    var calc_r5 = 0;
    var calc_r6 = 0;
    var calc_r7 = 0;*/

    // criação dos vetores a serem usados no cálculo de correlação de Spearman

    r1x = [];
    r1y = [];
    r2x = [];
    r2y = [];
    r3x = [];
    r3y = [];
    r4x = [];
    r4y = [];
    r5x = [];
    r5y = [];
    r6x = [];
    r6y = [];
    r7x = [];
    r7y = [];
    r8x = [];
    r8y = [];
    r9x = [];
    r9y = [];
    
    var grau_congruencia = 0;

    // variáveis de criticidade = acumulam valores de certas tipos de questões correlacionadas

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
            
    // ALGORITMO
    // pesquisa cada documento da collection QUESTÕES situado dentro do intervalo de tempo informado na entrada da ANÁLISE

    for (var i=0; i < questoes.length; i++) {

        // pegando a data do documento (registro)        
        data_registro = questoes[i].dt_registro;
        
        // verificando o nome do sistema e se o documento se situa no intervalo de tempo informado   
        dt_reg = new Date(data_registro).getTime();
        dt_in = new Date(analise.dt_inicio).getTime();
        dt_fm = new Date(analise.dt_fim).getTime();
        // acrescentando 24h (em milissegundos) à data de fim, para incluir os formulários enviados nessa data
        dt_fm += 86400000;

        console.log('data do formulário: ', data_registro, dt_reg);
        console.log('data de início: ;', analise.dt_inicio, dt_in);
        console.log('data de fim: ', analise.dt_fim, dt_fm);

        if ((questoes[i].sistema == analise.sistema) && (dt_reg >= dt_in && dt_reg <= dt_fm)) {
                             
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
            
            /*calc_r1 += (questoes[i].questao_06 - questoes[i].questao_09)**2;
            calc_r2 += (questoes[i].questao_11 - questoes[i].questao_12)**2;
            calc_r3 += (questoes[i].questao_15 - questoes[i].questao_20)**2;
            calc_r41 += (questoes[i].questao_16 - questoes[i].questao_17)**2;
            calc_r42 += (questoes[i].questao_16 - questoes[i].questao_19)**2;
            calc_r43 += (questoes[i].questao_17 - questoes[i].questao_19)**2;
            calc_r5 += (questoes[i].questao_16 - questoes[i].identificacao_02)**2;
            calc_r6 += (questoes[i].questao_20 - questoes[i].identificacao_03)**2;
            calc_r7 += (questoes[i].questao_18 - questoes[i].identificacao_04)**2;*/

            // colocação do conteúdo das variáveis em vetores X e Y para cálculo de Spearman

            r1x.push(questoes[i].questao_06);
            r1y.push(questoes[i].questao_09);
            r2x.push(questoes[i].questao_11);
            r2y.push(questoes[i].questao_12);
            r3x.push(questoes[i].questao_15);
            r3y.push(questoes[i].questao_20);
            r4x.push(questoes[i].questao_16);
            r4y.push(questoes[i].questao_17);
            r5x.push(questoes[i].questao_16);
            r5y.push(questoes[i].questao_19);
            r6x.push(questoes[i].questao_17);
            r6y.push(questoes[i].questao_19);
            r7x.push(questoes[i].questao_16);
            r7y.push(questoes[i].identificacao_02);
            r8x.push(questoes[i].questao_20);
            r8y.push(questoes[i].identificacao_03);
            r9x.push(questoes[i].questao_18);
            r9y.push(questoes[i].identificacao_04);
                        
            if (questoes[i].identificacao_01 == 0) { 
                soma_resp_int += soma_questao; // somas dos respondentes internos
                qt_resp_int++;                 // contagem dos respondentes internos

            } else {
                soma_resp_ext += soma_questao; // somas dos respondentes externos
                qt_resp_ext++;                 // contagem dos respondentes externos
            }
            sugestoes = sugestoes + " " + questoes[i].questao_22; // acumulação das sugestoes (texto)
            
        } else {
            console.log('registro ',i, ' não pertence aos parâmetros de pesquisa informados');
        }
    }  // fim da estrutura (laço - "for") que examina as questões de um formulário

    sugestoes = sugestoes.trim(); // retira espaços em branco das extremidades do string
    
    qt_resp = qt_resp_int + qt_resp_ext;  // total de respondentes
        
    if (qt_resp > 0) { // só analisa se houver documentos selecionados

        // ADVERTE se a quantidade de RESPONDENTES INTERNOS ou EXTERNOS for maior que a de USUÁRIOS INTERNOS ou EXTERNOS, respectivamente, informadas na entrada da análise
        
        if (qt_resp_ext > analise.qt_usu_ext) {
            analise.advertencia = '/ ATENÇÃO: número de respondentes externos maior que o de usuários externos informado ! ';
        } else {
            analise.advertencia = '';
        }

        if (qt_resp_int > analise.qt_usu_int) {
            analise.advertencia = '/ ATENÇÃO: número de respondentes internos maior que o de usuários internos informado ! ';
        } else {
            analise.advertencia = '';
        }
        
        // cálculo do tamanho das amostras mínimas baseado na quantidade de usuários informada na entrada da análise
        // analise.qt_usu_int > 0 (quantidade de usuários internos é sempre positiva)

        amostra_int = (analise.qt_usu_int * 0.25 * 1.96**2) / ((0.25 * 1.96**2) + (analise.qt_usu_int-1) * 0.05**2);

        // a amostra para usuários externos só é calculada se analise.qt_usu_ext > 0

        if (analise.qt_usu_ext > 0) {
            amostra_ext = (analise.qt_usu_ext * 0.25 * 1.96**2) / ((0.25 * 1.96**2) + (analise.qt_usu_ext-1) * 0.05**2);
        } else {
            amostra_ext = 0;
        }
        
        // a amostra é significativa se a quantidade de respondentes é superior à mínima calculada com base nos usuários

        if (qt_resp_int >= amostra_int && qt_resp_ext >= amostra_ext) {
            analise.amostra_significativa = "S";
        } else {
            analise.amostra_significativa = "N";
        }
        
        // cálculo da admissão da amostra = aferição de congruência    
        // variáveis de congruência: r1, r2, r3, r41, r42, r43, r5, r6 e r7
        // cálculo da correlação de postos de Spearman

        /*r1 = 1 - ( (6 * calc_r1) / (qt_resp - (qt_resp**2 - 1)) );
        r2 = 1 - ( (6 * calc_r2) / (qt_resp - (qt_resp**2 - 1)) );
        r3 = 1 - ( (6 * calc_r3) / (qt_resp - (qt_resp**2 - 1)) );
        r41 = 1 - ( (6 * calc_r41) / (qt_resp - (qt_resp**2 - 1)) );
        r42 = 1 - ( (6 * calc_r42) / (qt_resp - (qt_resp**2 - 1)) );
        r43 = 1 - ( (6 * calc_r43) / (qt_resp - (qt_resp**2 - 1)) );
        r5 = 1 - ( (6 * calc_r5) / (qt_resp - (qt_resp**2 - 1)) );
        r6 = 1 - ( (6 * calc_r6) / (qt_resp - (qt_resp**2 - 1)) );
        r7 = 1 - ( (6 * calc_r7) / (qt_resp - (qt_resp**2 - 1)) );

        // cálculo de z para o teste de hipótese da correlação //

        z1 = r1 * Math.sqrt(qt_resp-1);
        z2 = r2 * Math.sqrt(qt_resp-1);
        z3 = r3 * Math.sqrt(qt_resp-1);
        z41 = r41 * Math.sqrt(qt_resp-1);
        z42 = r42 * Math.sqrt(qt_resp-1);
        z43 = r43 * Math.sqrt(qt_resp-1);
        z5 = r5 * Math.sqrt(qt_resp-1);
        z6 = r6 * Math.sqrt(qt_resp-1);
        z7 = r7 * Math.sqrt(qt_resp-1); */

        // utilização dos vetores para a chamada da função para o cálculo de Spearman

        const spearman1 = new Spearman(r1x, r1y);
        spearman1.calc()
            .then(value => console.log("value z1 -->", value))
            .catch(err => console.error(err));

        const spearman2 = new Spearman(r2x, r2y);
        spearman2.calc()
            .then(value => console.log("value z2 -->", value))
            .catch(err => console.error(err));

        const spearman3 = new Spearman(r3x, r3y);
        spearman3.calc()
            .then(value => console.log("value z3 -->", value))
            .catch(err => console.error(err));

        const spearman4 = new Spearman(r4x, r4y);
        spearman4.calc()
            .then(value => console.log("value z4 -->", value))
            .catch(err => console.error(err));

        const spearman5 = new Spearman(r5x, r5y);
        spearman5.calc()
            .then(value => console.log("value z5 -->", value))
            .catch(err => console.error(err));

        const spearman6 = new Spearman(r6x, r6y);
        spearman6.calc()
            .then(value => console.log("value z6 -->", value))
            .catch(err => console.error(err));

        const spearman7 = new Spearman(r7x, r7y);
        spearman7.calc()
            .then(value => console.log("value z7 -->", value))
            .catch(err => console.error(err));

        const spearman8 = new Spearman(r8x, r8y);
        spearman8.calc()
            .then(value => console.log("value z8 -->", value))
            .catch(err => console.error(err));

        const spearman9 = new Spearman(r9x, r9y);
        spearman9.calc()
            .then(value => console.log("value z9 -->", value))
            .catch(err => console.error(err));

        // os resultados das comparações dos vetores x e y vão para z

        const [z1, z2, z3, z4, z5, z6, z7, z8, z9] = await Promise.all([
            spearman1.calc(), spearman2.calc(), spearman3.calc(),
            spearman4.calc(), spearman5.calc(), spearman6.calc(),
            spearman7.calc(), spearman8.calc(), spearman9.calc()]);
        
        // Há correlação quando zn é diferente de zero, adicionando 1 a grau_congruencia //

        if (z1 != 0) {
            grau_congruencia++;
        }
        if (z2 != 0) {
            grau_congruencia++;
        }    
        if (z3 != 0) {
            grau_congruencia++;
        }    
        if (z4 != 0) {
            grau_congruencia++;
        }    
        if (z5 != 0) {
            grau_congruencia++;
        }    
        if (z6 != 0) {
            grau_congruencia++;
        }    
        if (z7 != 0) {
            grau_congruencia++;
        }    
        if (z8 != 0) {
            grau_congruencia++;
        }    
        if (z9 != 0) {
            grau_congruencia++;
        }

        // ADVERTE se a quantidade de respondentes for inferior a 20, significando que a avaliação do grau de congruência requer um tamanho amostral superior

        if (qt_resp < 20) {
            analise.advertencia += '/ ATENÇÃO: avaliação do grau de admissão da amostra requer um mínimo de 20 (vinte) respondentes! ';
        }
    
        // resultados das variáveis de análise //

        analise.qt_resp = qt_resp;
        analise.qt_resp_int = qt_resp_int;
        analise.qt_resp_ext = qt_resp_ext;
        analise.sugestoes = sugestoes;
        analise.media_resp_int = soma_resp_int / qt_resp_int;

        if (qt_resp_ext > 0) {
            analise.media_resp_ext = soma_resp_ext / qt_resp_ext;
            analise.media_final = (analise.media_resp_int * 7 + analise.media_resp_ext * 3) / 10;
        } else {
            analise.media_resp_ext = 0;
            analise.media_final = analise.media_resp_int;
        }

        analise.grau_congruencia = grau_congruencia;

        // resultado usuários internos e externos //

        if (analise.media_resp_int < 42 ) {
            analise.resultado_int = "sistema deve ser substituído";
        } else if (analise.media_resp_int < 63) {
            analise.resultado_int = "sistema precisa de ajustes";
        } else {
            analise.resultado_int = "sistema não necessita de alterações";
        }
        
        if (qt_resp_ext > 0) {
            if (analise.media_resp_ext < 42 ) {
                analise.resultado_ext = "sistema deve ser substituído";
            } else if (analise.media_resp_ext < 63) {
                analise.resultado_ext = "sistema precisa de ajustes";
            } else {
                analise.resultado_ext = "sistema não necessita de alterações";
            }
        } else {
            analise.resultado_ext = "não há respondentes externos";
        }
            
        // resultado geral //
        
        if (analise.media_final < 42 ) {
            analise.resultado_final = "sistema deve ser substituído";
        } else if (analise.media_final < 63) {
            analise.resultado_final = "sistema precisa de ajustes";
        } else {
            analise.resultado_final = "sistema não necessita de alterações";               
        }
        
        // arrendondando para duas casas decimais as notas obtidas
        
        analise.media_resp_int = analise.media_resp_int.toFixed(2);
        analise.media_resp_ext = analise.media_resp_ext.toFixed(2);
        analise.media_final = analise.media_final.toFixed(2);

        // salvar as variáveis de criticidade //
        
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