var sugestao = '  isso apenas um teste isso apenas mais isso um teste  ';

sugestao = sugestao.trim(); // tirando espaços em branco das extremidades da cadeia de caracteres
contador = sugestao.split(" ").length; // conta as palavras na string
palavras = sugestao.split(" "); // pega as palavras e joga num array de substrings

console.log('em "',sugestao,'" há ', contador, ' palavras');
console.log(palavras);

repetidas = {};
for (let i=0; i < contador; i++) {
    repetidas[palavras[i]] = sugestao.match(new RegExp(palavras[i],'gi')).length; 
}
const resultado = Object.entries(repetidas).sort(([,a],[,b]) => b-a);
console.log(resultado);