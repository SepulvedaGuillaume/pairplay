window.onload = initializeGame;

const elements = {
  playerNameInput: document.querySelector("#player-name"),
  startGameButton: document.querySelector("#start-game"),
  modalStart: document.querySelector("#modal-start"),
  playerNameError: document.querySelector("#player-name-error"),
  gameContainer: document.querySelector("#game-container"),
  modalEnd: document.querySelector("#modal-end"),
  playAgainButton: document.querySelector("#play-again"),
  topicSelected: document.querySelector("#topics-select"),
};

const localStorageKey = "playerName";
const clientId = "bfdH9o6tt3oLJSqx04FZILvH3vS0WJQKCmIqJXbxdgo";
const UNSPLASH_ROOT = "https://api.unsplash.com";
const countCards = 8;

function initializeGame() {
  elements.playerNameInput.focus();
  elements.startGameButton.addEventListener("click", handleStartButtonClick);
  elements.playerNameInput.addEventListener(
    "keyup",
    handlePlayerNameInputKeyup
  );
  elements.topicSelected.addEventListener("keyup", handlePlayerNameInputKeyup);

  const playerName = localStorage.getItem(localStorageKey);
  if (playerName) {
    elements.playerNameInput.value = playerName;
  }

  elements.playAgainButton.addEventListener(
    "click",
    handlePlayAgainButtonClick
  );
}

function handleStartButtonClick() {
  startGame();
  createCardElements();
}

function handlePlayerNameInputKeyup(e) {
  if (e.key === "Enter") {
    startGame();
    createCardElements();
  }
}

function startGame() {
  const playerName = elements.playerNameInput.value.trim();

  if (playerName) {
    localStorage.setItem(localStorageKey, playerName);
    elements.modalStart.style.display = "none";
    elements.playerNameError.style.display = "none";
    elements.gameContainer.style.display = "flex";
  } else {
    elements.playerNameError.style.display = "block";
  }
}

function handlePlayAgainButtonClick() {
  elements.modalEnd.style.display = "none";
  elements.modalStart.style.display = "flex";
  elements.playerNameInput.focus();
}

async function createCardElements() {
  try {
    const unsplashResults = await fetchResults(elements.topicSelected.value);
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

    elements.gameContainer.appendChild(container);
    flipAllCards();
    addCardClickListeners();
  } catch (err) {
    console.log(err);
    alert("Failed to search Unsplash");
  }
}

const flipAllCards = () => {
  setTimeout(() => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.classList.toggle("flipped");
    });
  }, 2000); // 2000ms = 2 seconds
};

function addCardClickListeners() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });
}

async function searchUnsplash(searchQuery) {
  const endpoint = `${UNSPLASH_ROOT}/photos/random?query='${searchQuery}&client_id=${clientId}&count=${countCards}`;
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
