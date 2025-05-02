// highscores.js

const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Afișează scorurile salvate
if (highScores.length === 0) {
  highScoresList.innerHTML = "<li class='high-score'>Niciun scor salvat.</li>";
} else {
  highScoresList.innerHTML = highScores
    .map(score => {
      return `<li class="high-score">${score.name} - ${score.score}</li>`;
    })
    .join("");
}

// Funcție pentru resetarea scorurilor
function resetHighScores() {
  if (confirm("Ești sigur că vrei să ștergi toate scorurile?")) {
    localStorage.removeItem("highScores");
    highScoresList.innerHTML = "<li class='high-score'>Niciun scor salvat.</li>";
  }
}

