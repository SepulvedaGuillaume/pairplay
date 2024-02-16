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
const scoreBoard = document.getElementById("scoreboard");
const playerScore = document.getElementById("player-score");
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
    updateScoreBoard();
    modalStart.style.display = "none";
    playerNameError.style.display = "none";
    gameContainer.style.display = "flex";
    flipAllCards();
  } else {
    playerNameError.style.display = "block";
  }
}

playAgainButton.addEventListener("click", () => {
  modalEnd.style.display = "none";
  modalStart.style.display = "flex";
  document.querySelector("#player-name").focus();
});

// Array to store the card images
const cards = [
  "card1.jpeg",
  "card2.jpeg",
  "card3.jpeg",
  "card4.jpeg",
  "card5.jpeg",
  "card6.jpeg",
  "card7.jpeg",
  "card8.jpeg",
];

// Duplicate the cards array
const combinedCards = [...cards, ...cards];

// Shuffle the combinedCards array
combinedCards.sort(() => Math.random() - 0.5);

// Get the container element
const container = document.createElement("div");
container.classList.add("container");

// Loop through the combinedCards array and create card elements
combinedCards.forEach((card, index) => {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  const image = document.createElement("img");
  image.src = `cards/${card}`;

  cardElement.appendChild(image);
  container.appendChild(cardElement);
});

// Append the container to game-container
gameContainer.appendChild(container);

// Function to flip all the cards after 3 seconds
function flipAllCards() {
  const cards = document.querySelectorAll(".card");
  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.toggle("flipped");
      card.addEventListener("click", function () {
        if (!secondCard && firstCard) {
          secondCard = card;
        }
        if (!firstCard) {
          firstCard = card;
        }
        if (firstCard && secondCard) {
          checkMatch();
          playerMoves++;
          updateScoreBoard();
        }
      });
    });
  }, 2000); // 2000ms = 2 seconds
}

const cardsSelected = document.querySelectorAll(".card");

cardsSelected.forEach((card) => {
  card.addEventListener("click", function () {
    card.classList.toggle("flipped");
  });
});

function checkMatch() {
  if (
    firstCard?.querySelector("img")?.src ===
    secondCard?.querySelector("img")?.src
  ) {
    playerMatches++;
    score += 10;
    consecutiveMatches++;
    firstCard.style.pointerEvents = "none";
    secondCard.style.pointerEvents = "none";
    firstCard = null;
    secondCard = null;
  }
  if (consecutiveMatches >= 2) {
    score += 5;
  }
  if (
    firstCard?.querySelector("img")?.src !==
    secondCard?.querySelector("img")?.src
  ) {
    consecutiveMatches = 0;
    setTimeout(() => {
      firstCard.classList.toggle("flipped");
      secondCard.classList.toggle("flipped");
      firstCard = null;
      secondCard = null;
    }, 500);
  }
  if (playerMatches === 8) {
    setTimeout(() => {
      playerScore.innerHTML = `Score: ${score}`;
      playerMatches = 0;
      score = 0;
      consecutiveMatches = 0;
      cardsSelected.forEach((card) => {
        card.style.pointerEvents = "auto";
      });
      firstCard = null;
      secondCard = null;
      gameContainer.style.display = "none";
      modalEnd.style.display = "flex";
    }, 500);
  }
}

function updateScoreBoard() {
  let bestPlayer =
    localStorage.getItem("bestPlayerName") || "No best player yet";
  let bestPlayerScore = parseInt(localStorage.getItem("bestPlayerScore")) || 0;
  const playerName = localStorage.getItem("playerName");

  if (score > bestPlayerScore) {
    localStorage.setItem("bestPlayerName", playerName);
    localStorage.setItem("bestPlayerScore", score);
  }

  scoreBoard.innerHTML = `<br><p>Mouvement: ${playerMoves}</p> 
    <p>Correspondances: ${playerMatches}</p>
    <p>Score: ${score}</p>`;

  if (bestPlayer && bestPlayerScore) {
    scoreBoard.innerHTML += `<p>Meilleur score: <br>Par : ${bestPlayer} <br> Score : ${bestPlayerScore}</p>`;
  }
}
