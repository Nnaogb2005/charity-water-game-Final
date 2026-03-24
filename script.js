document.addEventListener("DOMContentLoaded", () => {

  const board = document.getElementById("board");
  const scoreDisplay = document.getElementById("score");
  const starsDisplay = document.getElementById("stars");
  const resetBtn = document.getElementById("resetBtn");
  const difficultySelect = document.getElementById("difficulty");

  const popup = document.getElementById("instructionPopup");
  const startGameBtn = document.getElementById("startGameBtn");

  const winScreen = document.getElementById("winScreen");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const finalScore = document.getElementById("finalScore");

  let score = 0;
  let stars = 0;
  let selectedPipe = null;
  let gameStarted = false;
  let enemyInterval;

  const settings = {
    easy: {starsToWin: 3, enemySpeed: 5000},
    normal: {starsToWin: 5, enemySpeed: 4000},
    hard: {starsToWin: 8, enemySpeed: 2500}
  };

  let difficulty = "normal";

  /* ================= START GAME ================= */
  startGameBtn.onclick = () => {
    popup.style.display = "none";
    gameStarted = true;

    difficulty = difficultySelect.value;

    placeStars();
    enemyInterval = setInterval(spawnEnemy, settings[difficulty].enemySpeed);
  };

  /* ================= CREATE GRID ================= */
  for (let i = 0; i < 64; i++) {
    let cell = document.createElement("div");
    cell.className = "cell";

    cell.onclick = () => {
      if (!gameStarted) return;

      if (selectedPipe) {
        cell.textContent = selectedPipe;
        cell.classList.add("placed");
        score += 10;
        scoreDisplay.textContent = score;

        checkPipeWin();
      }
    };

    board.appendChild(cell);
  }

  /* ================= PIPE SELECTION ================= */
  document.querySelectorAll(".pipe").forEach(pipe => {
    pipe.onclick = () => {
      if (!gameStarted) return;

      selectedPipe = pipe.textContent;
      document.querySelectorAll(".pipe").forEach(p => p.classList.remove("selected"));
      pipe.classList.add("selected");
    };
  });

  /* ================= STARS ================= */
  function placeStars() {
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < 5; i++) {
      let rand = Math.floor(Math.random() * cells.length);
      const star = document.createElement("div");
      star.className = "star";
      star.textContent = "⭐";

      star.onclick = (e) => {
        e.stopPropagation();
        stars++;
        score += 100;
        starsDisplay.textContent = stars;
        scoreDisplay.textContent = score;
        star.remove();
      };

      cells[rand].appendChild(star);
    }
  }

  /* ================= ENEMY (MOUSE) ================= */
  function spawnEnemy() {
    const cells = document.querySelectorAll(".cell");
    let rand = Math.floor(Math.random() * cells.length);
    let cell = cells[rand];

    if (!cell.querySelector(".enemy")) {
      const enemy = document.createElement("div");
      enemy.className = "enemy";
      enemy.textContent = "🐀";

      /* DESTROY PIPE ONLY */
      const pipes = ["═", "╚", "╬", "║", "╗", "╔"];
      if (pipes.includes(cell.textContent)) {
        cell.innerHTML = "💥";
        setTimeout(() => {
          cell.textContent = "";
          cell.classList.remove("placed");
        }, 300);
      }

      /* CLICK MOUSE */
      enemy.onclick = () => {
        score += 20;
        scoreDisplay.textContent = score;
        enemy.remove();
      };

      /* ESCAPE */
      setTimeout(() => {
        if (enemy.parentNode) {
          enemy.remove();
          score -= 10;
          scoreDisplay.textContent = score;
        }
      }, 3000);

      cell.appendChild(enemy);
    }
  }

  /* ================= WIN CONDITION ================= */
  function checkPipeWin() {
    const cells = document.querySelectorAll(".cell");
    const houseIndex = 59; 
    if (cells[houseIndex].textContent !== "") {
      confetti({particleCount: 200, spread: 120});
      finalScore.textContent = score;
      winScreen.style.display = "flex";
      clearInterval(enemyInterval);
    }
  }

  /* ================= RESET & PLAY AGAIN ================= */
  resetBtn.onclick = () => location.reload();
  playAgainBtn.onclick = () => location.reload();

});