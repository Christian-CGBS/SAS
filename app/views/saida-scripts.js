// instrução para gerar a tela de saída em PDF

const button = document.getElementById("download-pdf");
button.addEventListener("click", () => {
  const doc = new jsPDF("p", "pt", "a4");
  doc.addHTML(document.body, () => doc.save("resultado_analise.pdf"));
});

// instrução para gerar um PDF contendo as SUGESTÕES contidas nos formulários

const buttonDownloadSugestoes = document.getElementById("download-sugestoes-pdf");
buttonDownloadSugestoes.addEventListener("click", async() => {
  const doc = new jsPDF("p", "pt", "a4");
  // await doc.text(sugestoes, 10, 10);
  const maxWidth = 500; // Largura máxima da linha
  const lines = doc.splitTextToSize(sugestoes, maxWidth);
  doc.text(lines, 10, 10);
  await doc.save("resultado_sugestoes.pdf");  
});