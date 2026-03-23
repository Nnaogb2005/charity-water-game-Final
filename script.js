document.addEventListener("DOMContentLoaded", () => {

const board = document.getElementById("board")
const scoreDisplay = document.getElementById("score")
const starsDisplay = document.getElementById("stars")
const resetBtn = document.getElementById("resetBtn")

/* POP-UPS */

const popup = document.getElementById("instructionPopup")
const startGameBtn = document.getElementById("startGameBtn")

const winScreen = document.getElementById("winScreen")
const playAgainBtn = document.getElementById("playAgainBtn")
const finalScore = document.getElementById("finalScore")

let score = 0
let stars = 0
let selectedPipe = null
let gameStarted = false
let enemyInterval

/* START GAME */

startGameBtn.addEventListener("click", () => {

popup.style.display = "none"

gameStarted = true

placeStars()

enemyInterval = setInterval(spawnEnemy, 4000)

})

/* CREATE GRID */

for (let i = 0; i < 64; i++) {

let cell = document.createElement("div")
cell.classList.add("cell")

cell.addEventListener("click", () => {

if (!gameStarted) return

if (selectedPipe) {

cell.textContent = selectedPipe

cell.classList.add("placed")

setTimeout(() => cell.classList.remove("placed"), 300)

score += 10
scoreDisplay.textContent = score

}

})

board.appendChild(cell)

}

/* PIPE SELECTION */

document.querySelectorAll(".pipe").forEach(pipe => {

pipe.addEventListener("click", () => {

if (!gameStarted) return

selectedPipe = pipe.textContent

document.querySelectorAll(".pipe").forEach(p => p.classList.remove("selected"))

pipe.classList.add("selected")

})

})

/* PLACE STARS */

function placeStars() {

let cells = document.querySelectorAll(".cell")

for (let i = 0; i < 5; i++) {

let rand = Math.floor(Math.random() * cells.length)

let star = document.createElement("div")

star.classList.add("star")

star.textContent = "⭐"

cells[rand].appendChild(star)

}

}

/* STAR COLLECTION */

board.addEventListener("click", (e) => {

if (!gameStarted) return

if (e.target.classList.contains("star")) {

stars++
starsDisplay.textContent = stars

score += 100
scoreDisplay.textContent = score

e.target.classList.add("animate")

setTimeout(() => e.target.remove(), 400)

checkWin()

}

})

/* ENEMY SPAWN */

function spawnEnemy() {

let cells = document.querySelectorAll(".cell")

let rand = Math.floor(Math.random() * cells.length)

let enemyCell = cells[rand]

if (!enemyCell.querySelector(".enemy")) {

let enemy = document.createElement("div")
enemy.classList.add("enemy")
enemy.textContent = "🐀"

/* DESTROY PIPE ONLY */

let pipePieces = ["═", "╚", "╬", "║", "╗", "╔"]

if (pipePieces.includes(enemyCell.textContent)) {

enemyCell.classList.add("broken")

setTimeout(() => {

enemyCell.textContent = ""

enemyCell.classList.remove("placed", "broken")

}, 300)

}

/* CLICK MOUSE */

enemy.addEventListener("click", () => {

score += 20
scoreDisplay.textContent = score

enemy.remove()

})

enemyCell.appendChild(enemy)

/* MOUSE ESCAPE */

setTimeout(() => {

if (enemy.parentNode) {

enemy.remove()

score -= 10
scoreDisplay.textContent = score

}

}, 3000)

}

}

/* WIN CONDITION */

function checkWin() {

if (stars >= 5) {

confetti({
particleCount: 200,
spread: 120
})

finalScore.textContent = score

winScreen.style.display = "flex"

clearInterval(enemyInterval)

}

}

/* PLAY AGAIN */

playAgainBtn.addEventListener("click", () => {

location.reload()

})

/* RESET BUTTON */

resetBtn.addEventListener("click", () => {

location.reload()

})

})