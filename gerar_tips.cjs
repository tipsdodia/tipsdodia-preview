
const fs = require('fs');
const axios = require('axios');

const apiKey = 'live_2c18402cd0d238c95e33864044dc78';
const url = 'https://api.api-futebol.com.br/v1/fixtures';

axios.get(url, {
  headers: { Authorization: `Bearer ${apiKey}` }
})
.then(response => {
  const jogos = Array.isArray(response.data) ? response.data.filter(j => j.status === 'agendado') : [];
  
  const apostasSeguras = [
    'Mais de 1.5 gols', 'Ambas marcam', 'Time da casa ou empate',
    'Menos de 4.5 gols', 'Mais de 0.5 HT'
  ];

  const apostasArriscadas = [
    'Vitória fora e ambas marcam', 'Mais de 3.5 gols',
    'Placar exato 2x1', 'Empate com gols', 'Time visitante vence sem sofrer gols'
  ];

  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Dicas de Apostas</title></head><body>`;

  jogos.slice(0, 10).forEach(jogo => {
    const apostaSegura = apostasSeguras[Math.floor(Math.random() * apostasSeguras.length)];
    const apostaArriscada = apostasArriscadas[Math.floor(Math.random() * apostasArriscadas.length)];

    html += `
    <div>
      <h2>${jogo.time_mandante.nome} vs ${jogo.time_visitante.nome} - ${jogo.data_realizacao}</h2>
      <p><strong>Aposta Segura:</strong> ${apostaSegura}</p>
      <p><strong>Aposta Arriscada:</strong> ${apostaArriscada}</p>
    </div>`;
  });

  html += `</body></html>`;

  fs.writeFileSync('index.html', html);
  console.log('Arquivo index.html atualizado com sucesso.');
})
.catch(error => {
  console.error('Erro ao buscar os dados da API:', error.message);
});
