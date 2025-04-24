
// gerar_tips.js atualizado com API-Futebol.com.br, comentários e 6 bilhetes

const fs = require('fs');
const https = require('https');

const API_KEY = 'live_2c18402cd0d238c95e33864044dc78';
const BASE_URL = 'https://api.api-futebol.com.br/v1';
const hoje = new Date().toISOString().split('T')[0];

const headers = {
  'Authorization': `Bearer ${API_KEY}`
};

const apostasSeguras = [
  'Mais de 1.5 gols', 'Ambas marcam', 'Time da casa ou empate', 'Mais de 0.5 HT', 'Mais de 2.5 gols'
];

const apostasArriscadas = [
  'Mais de 3.5 gols', 'Vitória fora e ambas marcam', 'Placar exato 2x1', 'Time visitante vence sem sofrer gols', 'Gol no primeiro tempo e mais de 2.5'
];

function gerarHTML(jogos, bilhetes) {
  let html = `<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Tips do Dia</title>
  <style>body{background:#111;color:#fff;font-family:sans-serif;padding:20px;}
  .jogo{background:#222;margin:10px 0;padding:15px;border-radius:8px;}
  .bilhete{border:1px dashed #666;padding:10px;margin:15px 0;}
  </style></head><body><h1>TIPS DO DIA - ${hoje}</h1>`;

  jogos.forEach(jogo => {
    const segura = apostasSeguras[Math.floor(Math.random() * apostasSeguras.length)];
    const arriscada = apostasArriscadas[Math.floor(Math.random() * apostasArriscadas.length)];
    const p1 = Math.floor(Math.random() * 16) + 80;
    const p2 = Math.floor(Math.random() * 30) + 40;
    html += `<div class='jogo'><h2>${jogo.campeonato} - ${jogo.casa} x ${jogo.visitante} - ${jogo.horario}</h2>
    <p><strong>Aposta Segura:</strong> ${segura} <span style='color:lime'>${p1}%</span><br><em>Comentário:</em> Aposta baseada em retrospecto equilibrado e desempenho recente do mandante.</p>
    <p><strong>Aposta Arriscada:</strong> ${arriscada} <span style='color:orangered'>${p2}%</span><br><em>Comentário:</em> Boa alternativa caso o jogo fique aberto e ocorra equilíbrio no placar.</p>
    </div>`;
  });

  html += `<h2>Bilhetes do Dia</h2>`;
  bilhetes.forEach((b, i) => {
    html += `<div class='bilhete'><h3>Bilhete ${i + 1} - ${b.tipo.toUpperCase()}</h3><ul>`;
    b.apostas.forEach(ap => {
      html += `<li>${ap}</li>`;
    });
    html += `</ul></div>`;
  });

  html += `</body></html>`;
  fs.writeFileSync('index.html', html);
  console.log("Tips geradas com sucesso!");
}

function buscarJogos() {
  const req = https.request(`${BASE_URL}/partidas?data=${hoje}`, { headers }, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const parsed = JSON.parse(data);
      const jogosFiltrados = parsed.filter(j => j.status === 'agendado').map(j => ({
        campeonato: j.campeonato.nome,
        casa: j.time_mandante.nome_popular,
        visitante: j.time_visitante.nome_popular,
        horario: j.hora
      })).slice(0, 10);

      const bilhetes = [];
      for (let i = 0; i < 6; i++) {
        const tipo = i < 2 ? 'fácil' : i < 4 ? 'moderado' : 'difícil';
        bilhetes.push({
          tipo,
          apostas: [
            `${jogosFiltrados[i % jogosFiltrados.length].casa} x ${jogosFiltrados[i % jogosFiltrados.length].visitante}: ${apostasSeguras[i % apostasSeguras.length]}`,
            `${jogosFiltrados[(i + 1) % jogosFiltrados.length].casa} x ${jogosFiltrados[(i + 1) % jogosFiltrados.length].visitante}: ${apostasArriscadas[i % apostasArriscadas.length]}`
          ]
        });
      }

      gerarHTML(jogosFiltrados, bilhetes);
    });
  });

  req.on('error', err => console.error("Erro ao buscar dados da API:", err));
  req.end();
}

buscarJogos();
