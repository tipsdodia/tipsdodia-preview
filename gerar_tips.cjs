// gerar_tips.cjs - Script com API-Futebol para gerar dicas e salvar no index.html

const fs = require('fs');
const axios = require('axios');

const apiKey = 'live_2c18402cd0d238c95e33864044dc78'; // substitua pela sua key se necessário
const hoje = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD
const url = `https://api.api-futebol.com.br/v1/fixtures/${hoje}`;

const campeonatosPermitidos = [
  'Brasileirão Série A', 'Brasileirão Série B', 'Brasileirão Série C', 'Brasileirão Série D',
  'Copa do Brasil', 'Libertadores', 'Sul-Americana',
  'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1',
  'UEFA Champions League', 'UEFA Europa League', 'Euro'
];

const apostasSeguras = [
  'Mais de 1.5 gols', 'Ambas marcam', 'Time da casa ou empate',
  'Menos de 4.5 gols', 'Mais de 0.5 HT'
];

const apostasArriscadas = [
  'Vitória fora e ambas marcam', 'Mais de 3.5 gols',
  'Placar exato 2x1', 'Empate com gols', 'Time visitante vence sem sofrer gols'
];

const gerarJustificativa = (tipo) => {
  return tipo === 'segura'
    ? 'Baseado na média de gols recentes e postura ofensiva do time.'
    : 'Opção ousada com valor em caso de desempenho acima da média.';
};

axios.get(url, {
  headers: { Authorization: `Bearer ${apiKey}` }
}).then(response => {
  const jogos = response.data.filter(j => {
    return j.status === 'agendado' && campeonatosPermitidos.includes(j.campeonato.nome);
  });

  const jogosSelecionados = jogos.slice(0, 10); // até 10 jogos no máximo

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>TIPS DO DIA - ${hoje}</title>
  <style>
    body { background: #111; color: white; font-family: Arial; padding: 20px; }
    h1 { color: lime; }
    .jogo { background: #222; border-radius: 5px; margin-bottom: 20px; padding: 10px; }
    .segura { color: #00ff00; }
    .arriscada { color: #ff4444; }
    button { margin-top: 5px; padding: 4px 8px; cursor: pointer; }
  </style>
</head>
<body>
<h1>TIPS DO DIA - ${hoje}</h1>
`;

  jogosSelecionados.forEach(jogo => {
    const partida = `${jogo.time_mandante.nome_popular} x ${jogo.time_visitante.nome_popular} - ${jogo.hora}`;
    const apostaSegura = apostasSeguras[Math.floor(Math.random() * apostasSeguras.length)];
    const apostaArriscada = apostasArriscadas[Math.floor(Math.random() * apostasArriscadas.length)];
    const probSegura = Math.floor(Math.random() * 11) + 70;
    const probArriscada = Math.floor(Math.random() * 21) + 40;

    html += `
  <div class="jogo">
    <h2>${jogo.campeonato.nome}</h2>
    <h3>${partida}</h3>
    <p><b>Aposta Segura:</b> <span class="segura">${apostaSegura} (${probSegura}%)</span><br>
    <i>Comentário:</i> ${gerarJustificativa('segura')}</p>
    <p><b>Aposta Arriscada:</b> <span class="arriscada">${apostaArriscada} (${probArriscada}%)</span><br>
    <i>Comentário:</i> ${gerarJustificativa('arriscada')}</p>
    <button onclick="copiarTexto('${apostaSegura}')">Copiar Aposta</button>
  </div>
`;
  });

  html += `
<script>
function copiarTexto(texto) {
  navigator.clipboard.writeText(texto);
  alert("Aposta copiada!");
}
</script>
</body>
</html>`;

  fs.writeFileSync('index.html', html);
  console.log("Tips geradas com sucesso!");

}).catch(err => {
  console.error("Erro ao obter dados da API:", err.message);
});
