
const fs = require('fs');
const axios = require('axios');

const API_KEY = 'c9a2b31176848bfe12c010f059cd55fc';
const BASE_URL = 'https://v3.football.api-sports.io';

const headers = {
    'x-apisports-key': API_KEY
};

const apostasSeguras = [
    "Mais de 1.5 gols", "Ambas marcam", "Time da casa ou empate", "Menos de 4.5 gols", "Mais de 0.5 HT"
];

const apostasArriscadas = [
    "Vitória fora e ambas marcam", "Mais de 3.5 gols", "Placar exato 2x1", "Empate com gols", "Time visitante vence sem sofrer gols"
];

function gerarPorcentagem(segura = true) {
    const base = segura ? 70 : 40;
    const variacao = Math.floor(Math.random() * 21); // 0 a 20
    return segura ? base + variacao : base + variacao;
}

axios.get(`${BASE_URL}/fixtures?date=${new Date().toISOString().split('T')[0]}`, { headers })
    .then(res => {
        const jogos = res.data.response.slice(0, 10); // Pega os 10 primeiros jogos do dia
        let html = `
        <html><head><title>TIPS DO DIA - ${new Date().toLocaleDateString()}</title>
        <style>
        body { background: #111; color: #fff; font-family: Arial; padding: 20px; }
        .box { background: #222; padding: 10px; margin: 10px 0; border-left: 5px solid lime; }
        .btn { background: green; color: white; padding: 5px; border: none; cursor: pointer; }
        </style></head><body>
        <h1>TIPS DO DIA - ${new Date().toLocaleDateString()}</h1>
        `;

        jogos.forEach(jogo => {
            const apostaSegura = apostasSeguras[Math.floor(Math.random() * apostasSeguras.length)];
            const apostaArriscada = apostasArriscadas[Math.floor(Math.random() * apostasArriscadas.length)];
            const chanceSegura = gerarPorcentagem(true);
            const chanceArriscada = gerarPorcentagem(false);
            const partida = `${jogo.teams.home.name} x ${jogo.teams.away.name} - ${jogo.fixture.date.slice(11,16)}`;

            html += `
            <div class="box">
                <h2>${partida}</h2>
                <p><strong>Aposta Segura:</strong> ${apostaSegura} <span style="color:lime">${chanceSegura}%</span></p>
                <p><strong>Aposta Arriscada:</strong> ${apostaArriscada} <span style="color:orangered">${chanceArriscada}%</span></p>
                <button class="btn" onclick="copiarTexto('${apostaSegura}')">Copiar Aposta</button>
            </div>`;
        });

        html += `
        <script>
        function copiarTexto(texto) {
            navigator.clipboard.writeText(texto);
            alert("Aposta copiada!");
        }
        </script></body></html>`;

        fs.writeFileSync("index.html", html);
        console.log("Tips geradas com sucesso!");
    })
    .catch(err => {
        console.error("Erro ao processar os dados:", err.message);
    });
