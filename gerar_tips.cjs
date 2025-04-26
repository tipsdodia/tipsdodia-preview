const fs = require('fs');

const jogosDoDia = [
  { campeonato: 'LIBERTADORES', casa: 'Fluminense', fora: 'River Plate', hora: '21:00' },
  { campeonato: 'PREMIER LEAGUE', casa: 'Manchester City', fora: 'Liverpool', hora: '13:30' },
  { campeonato: 'BRASILEIRÃO SÉRIE A', casa: 'Palmeiras', fora: 'Atlético-MG', hora: '18:30' },
  { campeonato: 'UEFA EURO', casa: 'França', fora: 'Alemanha', hora: '16:00' },
  { campeonato: 'COPA DO BRASIL', casa: 'Cruzeiro', fora: 'Bahia', hora: '20:00' },
  { campeonato: 'LA LIGA', casa: 'Barcelona', fora: 'Real Madrid', hora: '17:00' },
  { campeonato: 'SUL-AMERICANA', casa: 'Corinthians', fora: 'Estudiantes', hora: '19:00' },
  { campeonato: 'BRASILEIRÃO SÉRIE B', casa: 'Sport Recife', fora: 'Ceará', hora: '11:00' }
];

const gerarHtml = () => {
  const hoje = new Date().toISOString().split('T')[0];
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>TIPS DO DIA - ${hoje}</title>
  <style>
    body { background: #111; color: white; font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: lime; }
    .jogo, .bilhete { background: #222; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
    .liga { font-size: 0.9em; color: #999; }
    .segura { color: #0f0; }
    .arriscada { color: #f55; }
    .odds { color: #ccc; }
    .comentario { font-style: italic; color: #aaa; }
    .tipo-bilhete { color: cyan; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>TIPS DO DIA - ${hoje}</h1>
`;

  jogosDoDia.forEach(jogo => {
    const oddS = (1.40 + Math.random() * 0.4).toFixed(2);
    const oddA = (2.20 + Math.random() * 1.5).toFixed(2);
    const probS = Math.floor(Math.random() * 11) + 80;
    const probA = Math.floor(Math.random() * 16) + 55;

    html += `
    <div class="jogo">
      <div class="liga"><strong>${jogo.campeonato}</strong></div>
      <h2>${jogo.casa} x ${jogo.fora} - ${jogo.hora}</h2>
      <p class="segura"><strong>Aposta Segura:</strong> Mais de 1.5 gols</p>
      <p class="odds">Odd: ${oddS} | Chance: ${probS}%</p>
      <p class="comentario">Expectativa de jogo aberto com boa produção ofensiva.</p>
      <p class="arriscada"><strong>Aposta Arriscada:</strong> Ambas marcam</p>
      <p class="odds">Odd: ${oddA} | Chance: ${probA}%</p>
      <p class="comentario">Risco moderado baseado no histórico de gols sofridos.</p>
    </div>
    `;
  });

  const gerarBilhete = (tipo, cor, jogos) => {
    html += `<div class="tipo-bilhete">${tipo.toUpperCase()}</div>`;
    jogos.forEach((jogo, i) => {
      const aposta = ['Mais de 1.5 gols', 'Ambas marcam', 'Casa vence', 'Visitante +1.5 gols'][i % 4];
      const odd = (tipo === 'fácil' ? 1.30 + i * 0.2 : tipo === 'moderado' ? 1.80 + i * 0.3 : 2.50 + i * 0.5).toFixed(2);
      html += `
      <div class="bilhete">
        <p><strong>${jogo.casa} x ${jogo.fora}</strong></p>
        <p><span style="color:${cor};"><strong>Palpite:</strong> ${aposta}</span></p>
        <p class="odds">Odd estimada: ${odd}</p>
      </div>`;
    });
  };

  const embaralhados = [...jogosDoDia].sort(() => 0.5 - Math.random());
  gerarBilhete('fácil', '#0f0', embaralhados.slice(0, 2));
  gerarBilhete('moderado', '#ff0', embaralhados.slice(2, 4));
  gerarBilhete('difícil', '#f55', embaralhados.slice(4, 6));

  html += '</body></html>';
  fs.writeFileSync('index.html', html);
  console.log("Tips geradas com sucesso!");
};

gerarHtml();
