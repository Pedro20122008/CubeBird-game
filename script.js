const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -8, // Valor reduzido para o pulo
    velocity: 0,
    color: localStorage.getItem('birdColor') || 'yellow' // Carrega a cor da skin do pássaro
};

let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let frame = 0;
let score = 0;
let coins = 0;
let gameOver = false;

const highScoreKey = 'highScore';
const totalCoinsKey = 'totalCoins';
const birdColorKey = 'birdColor';
let highScore = parseInt(localStorage.getItem(highScoreKey)) || 0;
let totalCoins = parseInt(localStorage.getItem(totalCoinsKey)) || 0;

function drawBird() {
    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }
}

function createPipe() {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 20)) + 10;
    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: pipeHeight
    });
    pipes.push({
        x: canvas.width,
        y: pipeHeight + pipeGap,
        width: pipeWidth,
        height: canvas.height - pipeHeight - pipeGap
    });
}

function drawPipes() {
    ctx.fillStyle = '#0f0';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            pipes.shift();
            score ++; //adiciona 1 ponto por bloco passado
            coins += 1; // Adiciona uma moeda a cada ponto
            if(score>10){
                 coins += 2;// A partir de de 10 voce ganhara 2 coins
            }
            if(score>100){
                coins += 10;// A partir de de 100 voce ganhara 10 coins
            }

        }
        

        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y
        ) {
            gameOver = true;
        }
    });
}

function drawInfo() {
    document.getElementById('score').textContent = `Pontuação: ${score}`;
    document.getElementById('coins').textContent = `Moedas: ${coins}`;
    document.getElementById('highScore').textContent = `Recorde: ${highScore}`;
    document.getElementById('totalCoins').textContent = `Total de Moedas: ${totalCoins}`;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(highScoreKey, highScore);
    }
}

function updateTotalCoins() {
    totalCoins += coins;
    localStorage.setItem(totalCoinsKey, totalCoins);
    document.getElementById('totalCoins').textContent = `Total de Moedas: ${totalCoins}`; // Atualiza o contador de moedas totais na fase
}

function showGameOverScreen() {
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalCoins').textContent = coins;
    document.getElementById('finalTotalScore').textContent = highScore; // Exibe o recorde
    document.getElementById('finalTotalCoins').textContent = totalCoins; // Exibe o total de moedas
    document.getElementById('gameContainer').style.display = 'none';
}


function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'flex';
    
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    coins = 0;
    gameOver = false;
    
    createPipe();
    draw();
}

function resetHighScore() {
    localStorage.removeItem(highScoreKey);
    highScore = 0;
    document.getElementById('highScore').textContent = `Recorde: ${highScore}`;
  }

function draw() {
    if (gameOver) {
        updateHighScore();
        updateTotalCoins();
        showGameOverScreen();
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateBird();
    drawBird();
    
    if (frame % 90 === 0) {
        createPipe();
    }
    
    updatePipes();
    drawPipes();
    drawInfo();
    
    frame++;
    requestAnimationFrame(draw);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp' && !gameOver) {
        bird.velocity = bird.lift;
    } else if (e.code === 'ArrowUp') {
        if (document.getElementById('startScreen').style.display === 'none' && gameOver) {
        } else if (document.getElementById('startScreen').style.display === 'flex') {
        }
    }
});
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) {
        bird.velocity = bird.lift;
    } else if (e.code === 'Space') {
        if (document.getElementById('startScreen').style.display === 'none' && gameOver) {
        } else if (document.getElementById('startScreen').style.display === 'flex') {
        }
    }
});
document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyW' && !gameOver) {
        bird.velocity = bird.lift;
    } else if (e.code === 'KeyW') {
        if (document.getElementById('startScreen').style.display === 'none' && gameOver) {
        } else if (document.getElementById('startScreen').style.display === 'flex') {
        }
    }
});

// Adiciona a lógica para selecionar a skin
function selectSkin(color) {
    bird.color = color;
    localStorage.setItem(birdColorKey, color);
}

function selectSkin(color) {
    bird.color = color;
    localStorage.setItem(birdColorKey, color);
}
// Carrega a skin escolhida quando a página é carregada
window.addEventListener('load', () => {
    bird.color = localStorage.getItem(birdColorKey) || 'yellow'; // Define a cor do pássaro
});
