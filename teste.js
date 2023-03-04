// teste rotina extrair palavras e contar frequência

var sugestao = '  apenas um teste   ';
var resultado = '';

sugestao = sugestao.trim();

for (var i=0; i < sugestao.length ; i++) {
  palavra = sugestao.slice(i, sugestao.indexOf(' '));
  console.log('iteração: ',i);
  if (palavra.length > 3) {  // considera palavra acima de três caracteres
    resultado += palavra;
    console.log('palavra selecionada:', palavra);
  } else {
    console.log('palavra descartada:', palavra);
  }

  parteSugestao = sugestao.slice(palavra.length, sugestao.length).trim();
  
  console.log('texto restante:', parteSugestao, '/ pos ini =', palavra.length, '/ pos fim =', sugestao.length);

  sugestao = parteSugestao;
  
  console.log('/ texto atual modificado:', sugestao);
  
}
console.log('palavras selecionadas:', resultado);

// teste ordenar aspectos críticos

normatividade = 15;
compreensao = 5;
exatidao = 33;
utilidade = 21;
confiabilidade = 1;
atualidade = 50;
rapidez = 16;
completude = 43;
satisfacao = 10;
facilidade_uso = 10;
facilidade_aprendizagem = 100;

const criticidade = [
  {type:"normatividade", valor:normatividade},
  {type:"compreensao", valor:compreensao},
  {type:"exatidao", valor:exatidao},
  {type:"utilidade", valor:utilidade},
  {type:"confiabilidade", valor:confiabilidade},
  {type:"atualidade", valor:atualidade},
  {type:"rapidez", valor:rapidez},
  {type:"completude", valor:completude},
  {type:"satisfacao", valor:satisfacao},
  {type:"facilidade_uso", valor:facilidade_uso},
  {type:"facilidade_aprendizagem", valor:facilidade_aprendizagem}
]

criticidade.sort(function(a, b){return a.valor - b.valor});

console.log(criticidade);
