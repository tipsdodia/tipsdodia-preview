
const fs = require('fs');
const https = require('https');

const dataHoje = new Date().toISOString().split('T')[0];
const url = `https://www.thesportsdb.com/api/v1/json/1/eventsday.php?d=${dataHoje}&s=Soccer`;

https.get(url, (resp) => {
  let data = "";

  resp.on("data", (chunk) => {
    data += chunk;
  });

  resp.on("end", () => {
    try {
      const json = JSON.parse(data);
      const eventos = json.events || [];

      const apostasSeguras = ["Mais de 1.5 gols", "Ambas marcam", "Time da casa ou empate"];
      const apostasArriscadas = ["Vitória fora e ambas marcam", "Mais de 3.5 gols", "Placar exato 2x1"];

      let html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Tips do Dia</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="dark">
  <div class="container">
    <h1>TIPS DO DIA - ${dataHoje.split('-').reverse().join('/')}</h1>
`;

      const jogosExibidos = eventos.slice(0, 10);

      jogosExibidos.forEach(evento => {
        const timeCasa = evento.strHomeTeam;
        const timeFora = evento.strAwayTeam;
        const horario = evento.strTime;

        const apostaSegura = apostasSeguras[Math.floor(Math.random() * apostasSeguras.length)];
        const apostaArriscada = apostasArriscadas[Math.floor(Math.random() * apostasArriscadas.length)];
        const chanceSegura = Math.floor(Math.random() * 15 + 80);
        const chanceArriscada = Math.floor(Math.random() * 30 + 40);

        html += `
    <div class="tip-card">
      <h2>${timeCasa} x ${timeFora} - ${horario}</h2>
      <p><strong>Aposta Segura:</strong> ${apostaSegura} <span class="badge green">${chanceSegura}%</span></p>
      <p><strong>Aposta Arriscada:</strong> ${apostaArriscada} <span class="badge red">${chanceArriscada}%</span></p>
      <button onclick="copiarTexto('${apostaSegura} | ${apostaArriscada}')">Copiar Aposta</button>
    </div>
`;
      });

      html += `
    <h2>Duplas do Dia</h2>
    <ul>
      <li><strong>Dupla Fácil:</strong> Time 1 + Time 2 mais de 1.5 gols</li>
      <li><strong>Dupla Moderada:</strong> Time 3 vence + Ambas marcam no Jogo 4</li>
      <li><strong>Dupla Difícil:</strong> Time 5 + Placar exato 2x1 no Jogo 6</li>
    </ul>
  </div>

  <script>
    function copiarTexto(texto) {
      navigator.clipboard.writeText(texto);
      alert("Aposta copiada!");
    }
  </script>
</body>
</html>
`;

      fs.writeFileSync("index.html", html);
      console.log("Tips geradas com sucesso!");
    } catch (err) {
      console.error("Erro ao processar os dados:", err.message);
    }
  });
}).on("error", (err) => {
  console.error("Erro na requisição da API:", err.message);
});
