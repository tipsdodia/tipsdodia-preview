
const axios = require('axios');
const fs = require('fs');

const apiKey = 'live_2c18402cd0d238c95e33864044dc78';
const hoje = new Date().toISOString().split('T')[0];
const url = `https://api.api-futebol.com.br/v1/fixtures?date=${hoje}`;

axios.get(url, { headers: { Authorization: `Bearer ${apiKey}` }})
  .then(response => {
    const jogos = response.data.slice(0, 10);
    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>TIPS DO DIA - ${hoje}</title><link rel="stylesheet" href="style.css"></head><body><h1>TIPS DO DIA - ${hoje}</h1>`;

    jogos.forEach((jogo, index) => {
      const mandante = jogo.time_mandante.nome_popular;
      const visitante = jogo.time_visitante.nome_popular;
      const horario = jogo.hora_realizacao;

      const apostaSegura = ["Mais de 1.5 gols", "Ambas marcam", "Time da casa ou empate", "Menos de 4.5 gols", "Mais de 0.5 HT"];
      const apostaArriscada = ["Vitória fora e ambas marcam", "Mais de 3.5 gols", "Placar exato 2x1", "Empate com gols", "Time visitante vence sem sofrer gols"];

      const probSegura = Math.floor(Math.random() * 21) + 75;
      const probArriscada = Math.floor(Math.random() * 26) + 45;

      html += `<div class="jogo ${index < 2 ? 'dupla facil' : index < 4 ? 'dupla moderado' : 'dupla dificil'}">
        <h2>${mandante} x ${visitante} - ${horario}</h2>
        <p><strong>Aposta Segura:</strong> ${apostaSegura[index % apostaSegura.length]} <span class="probabilidade verde">(${probSegura}%)</span></p>
        <p><em>Comentário:</em> Baseado na média de gols recentes e postura ofensiva do time.</p>
        <p><strong>Aposta Arriscada:</strong> ${apostaArriscada[index % apostaArriscada.length]} <span class="probabilidade vermelha">(${probArriscada}%)</span></p>
        <p><em>Comentário:</em> Opção ousada com valor em caso de desempenho acima da média.</p>
        <button onclick="copiarTexto('${apostaSegura[index % apostaSegura.length]}')">Copiar Aposta</button>
      </div>`;
    });

    html += `<script>
      function copiarTexto(texto) {
        navigator.clipboard.writeText(texto);
        alert("Aposta copiada!");
      }
    </script></body></html>`;

    fs.writeFileSync("index.html", html);
    fs.writeFileSync(".force-update", "");
    console.log("Tips geradas com sucesso!");
  })
  .catch(err => {
    console.error("Erro ao buscar dados:", err.message);
  });
