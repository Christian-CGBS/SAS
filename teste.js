// teste rotina extrair palavras //

var sugestao = '  apenas um teste   ';
var resultado = '';

sugestao = sugestao.trim();

for (var i=0; i < sugestao.length ; i++) {
  palavra = sugestao.slice(i, sugestao.indexOf(' '));
  console.log('iteração: ',i);
  if (palavra.length > 3) {
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

// teste ordenar aspectos críticos //
//

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

aspectos = [normatividade, compreensao, exatidao, utilidade, confiabilidade, atualidade, rapidez, completude, satisfacao, facilidade_uso, facilidade_aprendizagem];

console.log('aspectos: ', aspectos);

aspectos.sort();

console.log('aspectos mais críticos:', aspectos);