window.onload = () => {
  document.querySelector("#player-name").focus();
};

const playerNameInput = document.querySelector("#player-name");
const startGameButton = document.querySelector("#start-game");
const modalStart = document.querySelector("#modal-start");
const playerNameError = document.querySelector("#player-name-error");
const gameContainer = document.querySelector("#game-container");
const modalEnd = document.querySelector("#modal-end");
const playAgainButton = document.querySelector("#play-again");
const scoreBoard = document.getElementById('scoreboard')
let playerMoves = 0;
let playerMatches = 0;
let firstCard = null;
let secondCard = null;
let score = 0;
let consecutiveMatches = 0;

const playerName = localStorage.getItem("playerName");
if (playerName) {
  playerNameInput.value = playerName;
}

startGameButton.addEventListener("click", startGame);

playerNameInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    startGame();
  }
});

function startGame() {
  const playerName = playerNameInput.value.trim();

  if (playerName) {
    localStorage.setItem("playerName", playerName);
    modalStart.style.display = "none";
    playerNameError.style.display = "none";
    gameContainer.style.display = "flex";
  } else {
    playerNameError.style.display = "block";
  }

  playerMoves = 0;
  playerMatches = 0;
  firstCard = null;
  secondCard = null;
  updateScoreBoard();
}

playAgainButton.addEventListener("click", () => {
  modalEnd.style.display = "none";
  modalStart.style.display = "flex";
  document.querySelector("#player-name").focus();
});

// Array to store the card images
const cards = ['card1.jpeg', 'card2.jpeg', 'card3.jpeg', 'card4.jpeg', 'card5.jpeg', 'card6.jpeg', 'card7.jpeg', 'card8.jpeg'];

// Duplicate the cards array
const combinedCards = [...cards, ...cards];

// Shuffle the combinedCards array
combinedCards.sort(() => Math.random() - 0.5);

// Get the container element
const container = document.createElement('div');
container.classList.add('container');

// Loop through the combinedCards array and create card elements
combinedCards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    
    const image = document.createElement('img');
    image.src = `cards/${card}`;
    
    cardElement.appendChild(image);
    container.appendChild(cardElement);
});

// Append the container to game-container
gameContainer.appendChild(container);


// Function to flip all the cards after 3 seconds
function flipAllCards() {
    const cards = document.querySelectorAll('.card');
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.toggle('flipped');
        });
    }, 2000); // 2000ms = 2 seconds
}

// Call the flipAllCards function after the DOM content has loaded
document.addEventListener('DOMContentLoaded', function() {
    flipAllCards();
    
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            card.classList.toggle('flipped');
        });
    });
});

console.log(cards);

function checkMatch() {
    if (firstCard.textContent === secondCard.textContent){
        playerMatches++
        score += 10;
        consecutiveMatches++
        firstCard = null
        secondCard = null

    }if (consecutiveMatches >= 2){
        score += 5;

    }if (!firstCard.textContent === !secondCard.textContent){
      consecutiveMatches = 0;

    }if (playerMatches === 8) {
        endgame("a faire") 

    } else {
        firstCard.textContent = '';
        secondCard.textContent='';
        firstCard = null
        secondCard = null
    }


}

function endgame() {
    scoreBoard.innerHTML += `<p>Bravo ${playerName}! Vous avez gagné. </p>`
}


function updateScoreBoard() {
    scoreBoard.innerHTML = `</br><p>Mouvement: ${playerMoves}</p>
    <p>Correspondances: ${playerMatches}</p>
    <p>Score: ${playerMatches}</p>`
}


