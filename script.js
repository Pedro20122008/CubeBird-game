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
    lift: -8,
    velocity: 0,
    color: localStorage.getItem('birdColor') || 'yellow'
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
    const minPipeHeight = 50;
    const maxPipeHeight = canvas.height - pipeGap - 50;

    let pipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;

    // Aleatoriamente decide se este par será móvel
    const isMoving = Math.random() < 0.33; // 33% de chance

    const topPipe = {
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: pipeHeight,
        dy: isMoving ? 1 : 0 // se moverá para baixo ou não
    };

    const bottomPipe = {
        x: canvas.width,
        y: pipeHeight + pipeGap,
        width: pipeWidth,
        height: canvas.height - (pipeHeight + pipeGap),
        dy: isMoving ? 1 : 0
    };

    pipes.push(topPipe, bottomPipe);
}


function drawPipes() {
    ctx.fillStyle = '#0f0';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });
}

function updatePipes() {
    let speed = 2 + Math.floor(score / 20); // dificuldade progressiva

    pipes.forEach(pipe => {
        pipe.x -= speed;

        // Movimento vertical se tiver 'dy'
        if (pipe.dy) {
            pipe.y += pipe.dy;

            // Limites verticais para o cano
            if (pipe.y <= 0 || pipe.y + pipe.height >= canvas.height) {
                pipe.dy *= -1; // Inverte direção
            }
        }

        // Colisão
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y
        ) {
            gameOver = true;
        }
    });

    // Remove canos fora da tela e calcula score
    const passed = pipes.filter(pipe => pipe.x + pipe.width < 1).length / 2;
    if (passed > 0) {
        score += 1;
        coins += 1;

        if (score > 10) coins += passed * 2;
        if (score > 100) coins += passed * 10;
    }

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
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
    document.getElementById('totalCoins').textContent = `Total de Moedas: ${totalCoins}`;
}

function showGameOverScreen() {
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalCoins').textContent = coins;
    document.getElementById('finalTotalScore').textContent = highScore;
    document.getElementById('finalTotalCoins').textContent = totalCoins;
    document.getElementById('gameContainer').style.display = 'none';
    setTimeout(() => {
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'flex';
        updateInitialStats();
    }, 3000);
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
        
    const startHeight = (canvas.height - pipeGap) / 2;
    pipes.push({ x: canvas.width, y: 0, width: pipeWidth, height: startHeight });
    pipes.push({ x: canvas.width, y: startHeight + pipeGap, width: pipeWidth, height: canvas.height - (startHeight + pipeGap) });

    frame = 1; 

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
    const jumpKeys = ['ArrowUp', 'Space', 'KeyW'];
    if (jumpKeys.includes(e.code)) {
        if (!gameOver) {
            bird.velocity = bird.lift;
        }
    }
});

document.addEventListener('click', () => {
    if (!gameOver) {
        bird.velocity = bird.lift;
    } else {
        startGame();
    }
});

function selectSkin(color) {
    bird.color = color;
    localStorage.setItem(birdColorKey, color);
}

window.addEventListener('load', () => {
    bird.color = localStorage.getItem(birdColorKey) || 'yellow';
});

