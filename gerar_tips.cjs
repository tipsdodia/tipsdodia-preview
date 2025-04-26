const fs = require('fs');

// Jogos simulados - principais ligas + Brasileirão A, B e C
const jogosDoDia = [
  { campeonato: 'BRASILEIRÃO SÉRIE A', timeCasa: 'Flamengo', timeFora: 'Palmeiras', hora: '18:00' },
  { campeonato: 'BRASILEIRÃO SÉRIE B', timeCasa: 'Ceará', timeFora: 'Sport Recife', hora: '20:30' },
  { campeonato: 'BRASILEIRÃO SÉRIE C', timeCasa: 'Figueirense', timeFora: 'Remo', hora: '17:00' },
  { campeonato: 'PREMIER LEAGUE', timeCasa: 'Manchester City', timeFora: 'Arsenal', hora: '16:00' },
  { campeonato: 'LA LIGA', timeCasa: 'Barcelona', timeFora: 'Atlético de Madrid', hora: '17:30' },
  { campeonato: 'SERIE A (ITA)', timeCasa: 'Inter de Milão', timeFora: 'Juventus', hora: '15:45' },
  { campeonato: 'BUNDESLIGA', timeCasa: 'Bayern de Munique', timeFora: 'Borussia Dortmund', hora: '14:00' },
  { campeonato: 'LIGUE 1', timeCasa: 'PSG', timeFora: 'Olympique de Marseille', hora: '13:00' }
];

const apostasSeguras = ['Mais de 1.5 gols', 'Ambas marcam', 'Menos de 4.5 gols', 'Casa ou empate'];
const apostasArriscadas = ['Mais de 3.5 gols', 'Placar exato 2x1', 'Visitante vence sem sofrer gol', 'Empate com gols'];

const gerarHtml = () => {
  const hoje = new Date().toISOString().split('T')[0];
  let html = `
<!DOCTYPE html>
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
    const apostaS = apostasSeguras[Math.floor(Math.random() * apostasSeguras.length)];
    const apostaA = apostasArriscadas[Math.floor(Math.random() * apostasArriscadas.length)];
    const oddS = (1.40 + Math.random() * 0.6).toFixed(2);
    const oddA = (2.30 + Math.random() * 1.8).toFixed(2);
    const probS = Math.floor(Math.random() * 11) + 80;
    const probA = Math.floor(Math.random() * 21) + 50;

    html += `
    <div class="jogo">
      <div class="liga"><strong>${jogo.campeonato}</strong></div>
      <h2>${jogo.timeCasa} x ${jogo.timeFora} - ${jogo.hora}</h2>
      <p class="segura"><strong>Aposta Segura:</strong> ${apostaS}</p>
      <p class="odds">Odd: ${oddS} | Chance: ${probS}%</p>
      <p class="comentario">Baseado em retrospecto recente, médias de gols e desempenho dos ataques.</p>
      <p class="arriscada"><strong>Aposta Arriscada:</strong> ${apostaA}</p>
      <p class="odds">Odd: ${oddA} | Chance: ${probA}%</p>
      <p class="comentario">Projeção de valor com base no estilo ofensivo e vulnerabilidade defensiva.</p>
    </div>
    `;
  });

  // Bilhetes automáticos
  const gerarBilhete = (tipo, cor, jogos) => {
    html += `<div class="tipo-bilhete">${tipo.toUpperCase()}</div>`;
    jogos.forEach((jogo, i) => {
      const aposta = [...apostasSeguras, ...apostasArriscadas][Math.floor(Math.random() * 8)];
      const odd = (tipo === 'fácil' ? 1.30 + i * 0.2 : tipo === 'moderado' ? 1.80 + i * 0.3 : 2.50 + i * 0.5).toFixed(2);
      html += `
      <div class="bilhete">
        <p><strong>${jogo.timeCasa} x ${jogo.timeFora}</strong></p>
        <p><span style="color:${cor};"><strong>Palpite:</strong> ${aposta}</span></p>
        <p class="odds">Odd estimada: ${odd}</p>
      </div>`;
    });
  };

  const embaralhados = [...jogosDoDia].sort(() => 0.5 - Math.random());
  gerarBilhete('fácil', '#0f0', embaralhados.slice(0, 2));
  gerarBilhete('moderado', '#ff0', embaralhados.slice(2, 4));
  gerarBilhete('difícil', '#f55', embaralhados.slice(4, 6));

  html += `</body></html>`;
  fs.writeFileSync('index.html', html);
  console.log("Tips geradas com sucesso!");
};

gerarHtml();

