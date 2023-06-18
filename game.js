const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const player1 = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    color: 'blue',
    direction: 'right',
    alive: true,
    health: 100
};

const player2 = {
    x: 700,
    y: 500,
    width: 50,
    height: 50,
    color: 'red',
    direction: 'left',
    alive: true,
    health: 100
};


let keys = {};

document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

function updatePosition() {
    if (keys['ArrowUp'] && player1.y > 5) player1.y -= 5;
    if (keys['ArrowDown'] && player1.y < canvas.height - player1.height - 5) player1.y += 5;
    if (keys['ArrowLeft'] && player1.x > 5) player1.x -= 5;
    if (keys['ArrowRight'] && player1.x < canvas.width / 2 - player1.width - 5) player1.x += 5;

    if (keys['w'] && player2.y > 5) player2.y -= 5;
    if (keys['s'] && player2.y < canvas.height - player2.height - 5) player2.y += 5;
    if (keys['a'] && player2.x > canvas.width / 2 + 5) player2.x -= 5;
    if (keys['d'] && player2.x < canvas.width - player2.width - 5) player2.x += 5;
}

function drawDivider() {
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.strokeStyle = 'black';
    context.stroke();
}


let playButton = document.createElement('button');
playButton.style.backgroundImage = 'url("play-button-icon-design-illustration-vector.jpg")'; // Dodajemy tło do przycisku
playButton.style.backgroundSize = 'cover';
playButton.style.width = '300px';
playButton.style.height = '300px';
playButton.style.border = 'none';
playButton.style.backgroundColor = 'transparent'; // Dodajemy tę linijkę, aby ustawić tło na przezroczyste
playButton.addEventListener('click', startGame);
document.body.insertBefore(playButton, canvas);  // Dodajemy przycisk przed elementem canvas

let gameStarted = false;

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameLoop();
    }
}

function checkCollision(bullet, tank) {
    let distanceX = bullet.x - (tank.x + tank.width/2);
    let distanceY = bullet.y - (tank.y + tank.height/2);
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < bullet.radius + Math.min(tank.width, tank.height)/2) {
        return true; // Kolizja
    }

    return false; // Brak kolizji
}



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let rocks = []; // Tablica do przechowywania wszystkich spadających skał
let rockFallSpeed = 3; // Szybkość spadania skał

function createRock() {
    let newRock = {
        x: getRandomInt(0, canvas.width - 20),
        y: 0,
        width: 20,
        height: 20,
        image: Math.random() < 0.5 ? rockImage1 : rockImage2 // Losowo wybieramy obraz dla skały
    };
    rocks.push(newRock);
}

function drawRock(rock) {
    context.drawImage(rock.image, rock.x, rock.y, rock.width, rock.height);
}


function updateRocks() {
    for (let i = 0; i < rocks.length; i++) {
        let rock = rocks[i];
        rock.y += rockFallSpeed;

        if (checkCollision(rock, player1) || checkCollision(rock, player2)) {
            endGame(rock);
            return;
        }

        drawRock(rock); // Rysujemy skałę z jej obrazem
    }
}


function checkCollision(rock, tank) {
    return (
        rock.x < tank.x + tank.width &&
        rock.x + rock.width > tank.x &&
        rock.y < tank.y + tank.height &&
        rock.y + rock.height > tank.y
    );
}


let gameRunning = true;

function drawWinner(player) {
    context.fillStyle = 'black';
    context.font = '40px Arial';
    context.fillText(`Wygrał gracz ${player.color}`, canvas.width / 2 - 100, canvas.height / 2);
}

function endGame(rock) {
    if (checkCollision(rock, player1)) {
        drawWinner(player2);
    } else {
        drawWinner(player1);
    }

    gameRunning = false;
}

function restartGame() {
    rocks = []; // Usuń wszystkie skały
    player1.x = 100; // Przywróć pozycje startowe dla czołgów
    player2.x = 700;
    gameRunning = true;
    gameLoop(); // Uruchom pętlę gry ponownie
}
const rockImage1 = new Image();
rockImage1.src = 'vecteezy_rock-stones-and-boulders-in-cartoon-style_8853343_37.png';

const rockImage2 = new Image();
rockImage2.src = 'vecteezy_rock-stones-and-boulders-in-cartoon-style_8503140_814.png';
// Dodaj przycisk restartu
let restartButton = document.createElement('button');
restartButton.style.backgroundImage = 'url("pngwing.com.png")'; // Dodajemy tło do przycisku
restartButton.style.backgroundSize = 'cover';
restartButton.style.width = '300px';
restartButton.style.height = '300px';
restartButton.style.border = 'none';
restartButton.style.backgroundColor = 'transparent'; // Dodajemy tę linijkę, aby ustawić tło na przezroczyste
restartButton.addEventListener('click', restartGame);
document.body.appendChild(restartButton);
function drawPlayer(player) {
    context.drawImage(player.image, player.x, player.y, player.width, player.height);
}
const playerImage1 = new Image();
playerImage1.src = 'vecteezy_rock-climbing-png-graphic-clipart-design_24045541_756.png';

const playerImage2 = new Image();
playerImage2.src = 'vecteezy_rock-climbing-png-graphic-clipart-design_24045706_459.png';
let rockCreationChance = 0.01; // 1% szans na początek

player1.image = playerImage1; // Dodajemy obraz gracza do struktury danych gracza
player2.image = playerImage2; // Dodajemy obraz gracza do struktury danych gracza
setInterval(function() {
    if (rockCreationChance < 0.5) { // Tylko zwiększamy szansę, jeśli jest mniejsza niż 50%
        rockCreationChance += 0.01;
    }
}, 5000);

function gameLoop() {
    if (!gameRunning || !gameStarted) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    updatePosition();
    updatePosition();
    updateRocks();
    drawPlayer(player1);
    drawPlayer(player2);
    drawDivider();

    // Losowo generujemy skały
    if (Math.random() < rockCreationChance) {
        createRock();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();