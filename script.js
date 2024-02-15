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
const endGameButton = document.querySelector("#end-game");

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
}

endGameButton.addEventListener("click", () => {
  gameContainer.style.display = "none";
  modalEnd.style.display = "flex";
});

playAgainButton.addEventListener("click", () => {
  modalEnd.style.display = "none";
  modalStart.style.display = "flex";
  document.querySelector("#player-name").focus();
});
