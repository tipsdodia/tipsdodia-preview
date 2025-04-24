
const fs = require('fs');
const path = require('path');

// Simulação de dados para 2 jogos (pode ser expandido para 10)
const jogos = [
    {
        jogo: "Libertad x São Paulo - 21h30",
        segura: { aposta: "Mais de 1.5 gols", chance: "87%" },
        arriscada: { aposta: "São Paulo vence e ambas marcam", chance: "45%" }
    },
    {
        jogo: "Estudiantes x Botafogo - 21h30",
        segura: { aposta: "Botafogo ou empate", chance: "82%" },
        arriscada: { aposta: "Botafogo vence e over 2.5 gols", chance: "43%" }
    }
];

// Simulação de duplas
const duplas = {
    facil: "Real Madrid vence + Mais de 1.5 gols no jogo do Atlético-MG",
    moderada: "River Plate vence + Ambas marcam no jogo do Celta",
    dificil: "Vitória do Bucaramanga + Resultado exato 2x1 para Del Valle"
};

const gerarHTML = () => {
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

    jogos.forEach(j => {
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

    fs.writeFileSync(path.join(__dirname, 'index.html'), html);
};

gerarHTML();
