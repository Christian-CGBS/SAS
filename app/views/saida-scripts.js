// instrução para gerar a tela de saída em PDF

const button = document.getElementById("download-pdf");
button.addEventListener("click", () => {
  const doc = new jsPDF("p", "pt", "a4");
  doc.addHTML(document.body, () => doc.save("html.pdf"));
});