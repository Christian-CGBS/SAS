// instrução para gerar a tela de saída em PDF

const button = document.getElementById("download-pdf");
button.addEventListener("click", () => {
  const doc = new jsPDF("p", "pt", "a4");
  doc.addHTML(document.body, () => doc.save("html.pdf"));
});

// instrução para gerar uma planilha CSV com a ÍNTEGRA das SUGESTÕES contidas nos formulários
const buttonCsv = document.getElementById("download-csv");
buttonCsv.addEventListener("click", () => {
  console.log('gerando planilha com a íntegra das sugestões', sugestoes);
  const sampleData = sugestoes.map(s => ({ sugestoes: s}));
  const csv = Papa.unparse(sampleData);
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.ref = url;
  a.download = "sample_data.csv";
  a.textContent = "Download CSV";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

});