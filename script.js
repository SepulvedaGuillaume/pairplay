window.onload = () => {
  document.querySelector("#player-name").focus();
};

// DOM elements
const playerNameInput = document.querySelector("#player-name");
const startGameButton = document.querySelector("#start-game");
const modalStart = document.querySelector("#modal-start");
const playerNameError = document.querySelector("#player-name-error");
const gameContainer = document.querySelector("#game-container");
const modalEnd = document.querySelector("#modal-end");
const playAgainButton = document.querySelector("#play-again");
const scoreBoard = document.getElementById("scoreboard");
const playerScore = document.getElementById("player-score");
const topicSelected = document.querySelector("#topics-select");

// game variables
let playerMoves = 0;
let playerMatches = 0;
let firstCard = null;
let secondCard = null;
let score = 0;
let consecutiveMatches = 0;

// Unsplash const for API
const clientId = "bfdH9o6tt3oLJSqx04FZILvH3vS0WJQKCmIqJXbxdgo";
const UNSPLASH_ROOT = "https://api.unsplash.com";
const countCards = 8;

// Get the player name and the topic from local storage
const playerName = localStorage.getItem("playerName");
if (playerName) {
  playerNameInput.value = playerName;
}
const topic = localStorage.getItem("topicSelected");
if (topic) {
  topicSelected.value = topic;
}

startGameButton.addEventListener("click", () => {
  createCardElements();
  startGame();
});

function isEnterPressed(e) {
  if (e.key === "Enter") {
    createCardElements();
    startGame();
  }
}

playerNameInput.addEventListener("keyup", (e) => {
  isEnterPressed(e);
});

topicSelected.addEventListener("keyup", (e) => {
  isEnterPressed(e);
});

function startGame() {
  const playerName = playerNameInput.value.trim();
  const topic = topicSelected.value;

  if (playerName) {
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("topicSelected", topic);
    updateScoreBoard();
    modalStart.style.display = "none";
    playerNameError.style.display = "none";
    gameContainer.style.display = "flex";
    scoreboard.style.display = "block";
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

async function createCardElements() {
  try {
    const unsplashResults = await fetchResults(topicSelected.value);
    const randomImages = unsplashResults.slice(0, countCards * 2);

    const combinedCards = [...randomImages, ...randomImages];
    combinedCards.sort(() => Math.random() - 0.5);

    const container = document.createElement("div");
    container.classList.add("container");

    combinedCards.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");

      const image = document.createElement("img");
      image.src = card;

      cardElement.appendChild(image);
      container.appendChild(cardElement);
    });

    gameContainer.appendChild(container);
    flipAllCards();
    addCardClickListeners();
  } catch (err) {
    console.log(err);
    alert("Failed to search Unsplash");
  }
}

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

function addCardClickListeners() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });
}

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
      playerMoves = 0;
      cardsSelected.forEach((card) => {
        card.style.pointerEvents = "auto";
      });
      firstCard = null;
      secondCard = null;
      gameContainer.style.display = "none";
      scoreBoard.style.display = "none";
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

async function searchUnsplash(searchQuery) {
  let endpoint;
  searchQuery === 'random' ? endpoint = `${UNSPLASH_ROOT}/photos/random?query='${searchQuery}&client_id=${clientId}&count=${countCards}` : endpoint = `${UNSPLASH_ROOT}/photos/random?query='${searchQuery}&client_id=${clientId}&count=${countCards}`;
  
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw Error(response.statusText);
  }

  const json = await response.json();
  return json;
}

async function fetchResults(searchQuery) {
  try {
    const results = await searchUnsplash(searchQuery);
    return results.map((result) => result.urls.regular);
  } catch (err) {
    console.log(err);
    alert("Failed to search Unsplash");
  }
}
