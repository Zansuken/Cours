let move = 1;

const goal = [4, 4];

const mapLimits = [0, 4];

const startingPathHistory = [{ id: 0, move: 0, location: [1, 1], score: 0 }];

const pathHistory = [{ id: 0, move: 0, location: [1, 1], score: 0 }];

const keydownListener = (e) => {
  switch (e.key) {
    case "ArrowDown":
      moveBottom();
      break;

    case "ArrowUp":
      moveTop();
      break;

    case "ArrowLeft":
      moveLeft();
      break;

    case "ArrowRight":
      moveRight();
      break;

    default:
      break;
  }
};

const renderPlayer = () => {
  const playerElement = document.createElement("div");
  playerElement.classList.add("player");

  return playerElement;
};

const goalLocation = document.createElement("div");

goalLocation.classList.add("goal");

const updateLocation = (step, axe, direction) => {
  const player = document.querySelector(".player");

  const index = axe === "x" ? 0 : 1;

  const lastPosition = pathHistory.slice(-1)[0];

  const newId = lastPosition.id + 1;

  const newPosition = lastPosition.location[index] + step;

  if (newPosition < 1 || newPosition > 4) {
    return;
  }

  player.remove();

  const newPath =
    index === 0
      ? [newPosition, lastPosition.location[1]]
      : [lastPosition.location[0], newPosition];

  const stringifiedLocations = pathHistory.map(({ location }) =>
    JSON.stringify(location)
  );

  const stringifiedNewPath = JSON.stringify(newPath);

  const isStartingPosition = stringifiedNewPath === "[1,1]";

  const alreadyUsedPath = stringifiedLocations.some(
    (location) => location === stringifiedNewPath
  );

  const getNewScore = () => {
    if (alreadyUsedPath) {
      return lastPosition.score - 25;
    }

    switch (direction) {
      case "left":
        return lastPosition.score + 50;

      case "right":
        return lastPosition.score + 70;

      case "top":
        return lastPosition.score + 25;

      case "bottom":
        return lastPosition.score + 90;

      default:
        return lastPosition.score;
    }
  };

  const newScore = isStartingPosition ? 0 : getNewScore();

  const newMovesCount = lastPosition.move + 1;

  const newLocation = {
    id: newId,
    move: newMovesCount,
    location: newPath,
    score: newScore,
  };

  const scorePanel = document.querySelector(".score_panel");
  const scoreValue = document.querySelector(".score_value");
  const movesValue = document.querySelector(".moves_value");

  scoreValue.textContent = newScore;
  movesValue.textContent = newMovesCount;

  pathHistory.push(newLocation);

  const formattedHistory = pathHistory.map((item) => ({
    ...item,
    location: JSON.stringify(item.location),
  }));
  console.table(formattedHistory);

  const cells = document.querySelectorAll(".map_cell");

  cells.forEach((cell) => {
    const cellPosition = cell.getAttribute("data-position");
    if (cellPosition === stringifiedNewPath) {
      cell.appendChild(renderPlayer());
    }
  });
  if (stringifiedNewPath === "[4,4]") {
    const winElement = document.createElement("span");
    winElement.classList.add("win");
    scorePanel.appendChild(winElement).textContent = "You win!";

    document.removeEventListener("keydown", keydownListener);

    const resetButton = document.createElement("button");
    resetButton.classList.add("reset_button");

    resetButton.textContent = "RESTART";

    scorePanel.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      pathHistory.splice(0, pathHistory.length);
      pathHistory.push(startingPathHistory[0]);
      scoreValue.textContent = 0;
      movesValue.textContent = 0;
      winElement.remove();
      resetButton.remove();

      const oldPlayer = document.querySelector(".player");
      oldPlayer.remove();

      cells.forEach((cell) => {
        const cellPosition = cell.getAttribute("data-position");
        if (cellPosition === "[1,1]") {
          cell.appendChild(renderPlayer());
        }
      });
      document.addEventListener("keydown", keydownListener);
    });
  }
};

const moveLeft = () => {
  updateLocation(-1, "x", "left");
};

const moveRight = () => {
  updateLocation(1, "x", "right");
};

const moveTop = () => {
  updateLocation(1, "y", "top");
};

const moveBottom = () => {
  updateLocation(-1, "y", "bottom");
};

const createMap = () => {
  const container = document.createElement("div");

  container.classList.add("map_container");

  Array.apply(null, Array(16))
    .map(function (x, i) {
      return i + 1;
    })
    .forEach((index) => {
      const cell = document.createElement("div");
      cell.classList.add("map_cell");

      if (index === 13) {
        cell.appendChild(renderPlayer());
      }

      let positions = [];

      for (let y = 4; y >= 1; y--) {
        for (let x = 1; x <= 4; x++) {
          positions.push([x, y]);
        }
      }

      const getPosition = () => {
        if (index < 1 || index > 16) {
          return;
        }

        return JSON.stringify(positions[index - 1]);
      };
      cell.setAttribute("data-position", getPosition());
      container.appendChild(cell);
    });

  return container;
};

document.body.appendChild(createMap());

document.addEventListener("keydown", keydownListener);

const scorePanel = document.createElement("div");

const scoreContainer = document.createElement("div");
const scoreLabel = document.createElement("span");
const scoreValue = document.createElement("span");

const movesContainer = document.createElement("div");
const movesLabel = document.createElement("span");
const movesValue = document.createElement("span");

scorePanel.classList.add("score_panel");

scoreContainer.classList.add("score_container");
scoreLabel.classList.add("score_label");
scoreValue.classList.add("score_value");

movesContainer.classList.add("moves_container");
movesLabel.classList.add("moves_label");
movesValue.classList.add("moves_value");

scoreLabel.textContent = "Score: ";
movesLabel.textContent = "Moves: ";
scoreValue.textContent = pathHistory[0].score;
movesValue.textContent = pathHistory[0].move;

scoreContainer.append(scoreLabel, scoreValue);
movesContainer.append(movesLabel, movesValue);

const leftSection = document.createElement("div");

leftSection.classList.add("left_section");

leftSection.append(scoreContainer, movesContainer);
scorePanel.append(leftSection);

document.body.appendChild(scorePanel);
