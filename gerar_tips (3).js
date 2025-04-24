
const fs = require('fs');

const jogos = [
  { jogo: "Palmeiras x Santos - 18h00" },
  { jogo: "Barcelona x Atlético de Madrid - 16h30" },
  { jogo: "Juventus x Milan - 17h45" },
  { jogo: "Flamengo x Botafogo - 21h00" },
  { jogo: "Corinthians x São Paulo - 20h30" },
  { jogo: "Internacional x Grêmio - 19h00" },
  { jogo: "Chelsea x Arsenal - 14h00" },
  { jogo: "PSG x Lyon - 15h15" },
  { jogo: "River Plate x Boca Juniors - 22h00" },
  { jogo: "Cruzeiro x Atlético-MG - 20h00" }
];

const apostasSeguras = [
  "Mais de 1.5 gols", "Ambas marcam", "Time da casa ou empate", "Menos de 4.5 gols", "Mais de 0.5 HT"
];

const apostasArriscadas = [
  "Vitória fora e ambas marcam", "Mais de 3.5 gols", "Placar exato 2x1", "Empate com gols", "Time visitante vence sem sofrer gols"
];

const gerarPorcentagem = (segura = true) => {
  const valor = segura
    ? Math.floor(Math.random() * 16) + 75
    : Math.floor(Math.random() * 31) + 40;
  return `${valor}%`;
};

const gerarAposta = () => {
  return jogos.map(j => ({
    ...j,
    segura: {
      aposta: apostasSeguras[Math.floor(Math.random() * apostasSeguras.length)],
      chance: gerarPorcentagem(true)
    },
    arriscada: {
      aposta: apostasArriscadas[Math.floor(Math.random() * apostasArriscadas.length)],
      chance: gerarPorcentagem(false)
    }
  }));
};

const duplas = {
  facil: "Barcelona vence + Mais de 1.5 gols no jogo do River Plate",
  moderada: "Ambas marcam no jogo do PSG + Time da casa ou empate no Gre-Nal",
  dificil: "Vitória do Cruzeiro + Placar exato 2x2 para Juventus x Milan"
};

const gerarHTML = () => {
  const analises = gerarAposta();

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
    <h1>TIPS DO DIA - ${new Date().toLocaleDateString('pt-BR')}</h1>
  `;

  analises.forEach(j => {
    html += `
    <div class="tip-card">
      <h2>${j.jogo}</h2>
      <p><strong>Aposta Segura:</strong> ${j.segura.aposta} <span class="badge green">${j.segura.chance}</span></p>
      <p><strong>Aposta Arriscada:</strong> ${j.arriscada.aposta} <span class="badge red">${j.arriscada.chance}</span></p>
      <button onclick="copiarTexto('${j.segura.aposta} | ${j.arriscada.aposta}')">Copiar Aposta</button>
    </div>
    `;
  });

  html += `
    <h2>Duplas do Dia</h2>
    <ul>
      <li><strong>Dupla Fácil:</strong> ${duplas.facil}</li>
      <li><strong>Dupla Moderada:</strong> ${duplas.moderada}</li>
      <li><strong>Dupla Difícil:</strong> ${duplas.dificil}</li>
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
};

gerarHTML();
