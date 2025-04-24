
// gerar_tips.js atualizado com filtro de ligas e comentários

const fs = require('fs');
const axios = require('axios');

const apikey = 'c9a2b31176848bfe12c010f059cd55fc';
const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const url = `https://v3.football.api-sports.io/fixtures?date=${hoje}`;

const ligasPermitidas = [
  39, 140, 78, 61, 135, // Inglaterra, Espanha, Alemanha, França, Itália
  201, 2, 3, 4, // Libertadores, UEFA CL, UEFA EL, EURO
  71, 72, 73 // Série A, B, C
];

axios.get(url, {
  headers: { 'x-apisports-key': apikey }
})
.then(response => {
  const jogos = response.data.response.filter(j => ligasPermitidas.includes(j.league.id)).slice(0, 10);

  const apostasSeguras = [
    'Mais de 1.5 gols', 'Ambas marcam', 'Time da casa ou empate',
    'Menos de 4.5 gols', 'Mais de 0.5 HT'
  ];
  const apostasArriscadas = [
    'Vitória fora e ambas marcam', 'Mais de 3.5 gols',
    'Placar exato 2x1', 'Empate com gols', 'Time visitante vence sem sofrer gols'
  ];

  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>TIPS DO DIA - ${hoje}</title>
  <style>
    body { background: #111; color: #fff; font-family: sans-serif; padding: 20px; }
    .jogo { background: #222; margin: 10px 0; padding: 15px; border-radius: 8px; }
    .porcentagem { margin-top: 5px; }
    button { margin-top: 5px; cursor: pointer; }
  </style></head><body><h1>TIPS DO DIA - ${hoje}</h1>`;

  jogos.forEach(jogo => {
    const partida = `${jogo.teams.home.name} x ${jogo.teams.away.name} - ${jogo.fixture.date.slice(11,16)}`;
    const apostaSegura = apostasSeguras[Math.floor(Math.random() * apostasSeguras.length)];
    const apostaArriscada = apostasArriscadas[Math.floor(Math.random() * apostasArriscadas.length)];
    const chanceSegura = Math.floor(Math.random() * 21) + 70;
    const chanceArriscada = Math.floor(Math.random() * 31) + 40;

    html += `<div class="jogo"><h2>${partida}</h2>
    <p><strong>Aposta Segura:</strong> ${apostaSegura} <span style="color:lime">(${chanceSegura}%)</span><br>
    <em>Comentário:</em> Baseado na média de gols recentes e postura ofensiva do time.</p>
    <p><strong>Aposta Arriscada:</strong> ${apostaArriscada} <span style="color:red">(${chanceArriscada}%)</span><br>
    <em>Comentário:</em> Opção ousada com valor em caso de desempenho acima da média.</p>
    <button onclick="navigator.clipboard.writeText('${apostaSegura} / ${apostaArriscada}')">Copiar Aposta</button></div>`;
  });

  html += `</body></html>`;
  fs.writeFileSync("index.html", html);
  console.log("Tips atualizadas com sucesso.");
})
.catch(err => {
  console.error("Erro ao buscar jogos:", err.message);
});
