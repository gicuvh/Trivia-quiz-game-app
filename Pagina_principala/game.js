const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const categorySelect = document.getElementById('categorySelect');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let score = 0;
let canAnswer = true;

const CORRECT_BONUS = 10;

categorySelect.addEventListener('change', () => {
  const selectedCategory = categorySelect.value;
  if (selectedCategory) {
    fetchQuestions(selectedCategory);
  }
});

function fetchQuestions(categoryId) {
  loader.classList.remove('hidden');
  game.classList.add('hidden');

  fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=easy&type=multiple`)
    .then(res => res.json())
    .then(loaded => {
      questions = loaded.results.map((q) => {
        const formatted = { question: q.question };
        const answers = [...q.incorrect_answers];
        formatted.answer = Math.floor(Math.random() * 4) + 1;
        answers.splice(formatted.answer - 1, 0, q.correct_answer);

        answers.forEach((ans, i) => {
          formatted['choice' + (i + 1)] = ans;
        });

        return formatted;
      });

      selectedAnswers = new Array(questions.length).fill(null);
      startGame();
    });
}

function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  scoreText.innerText = score;
  game.classList.remove('hidden');
  loader.classList.add('hidden');
  showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
  const q = questions[index];
  question.innerHTML = q.question;
  choices.forEach((choice, i) => {
    choice.innerHTML = q['choice' + (i + 1)];
    choice.parentElement.classList.remove('correct', 'incorrect');
  });

  progressText.innerText = `Question ${index + 1}/${questions.length}`;
  progressBarFull.style.width = `${((index + 1) / questions.length) * 100}%`;

  const prevSelected = selectedAnswers[index];
  canAnswer = prevSelected === null;

  if (!canAnswer) {
    const correctAnswer = questions[index].answer;
    choices.forEach((choice, i) => {
      const choiceNumber = i + 1;
      if (choiceNumber === prevSelected) {
        const classToApply = prevSelected === correctAnswer ? 'correct' : 'incorrect';
        choice.parentElement.classList.add(classToApply);
      }
      if (choiceNumber === correctAnswer) {
        choice.parentElement.classList.add('correct');
      }
    });
  }
}

choices.forEach(choice => {
  choice.addEventListener('click', e => {
    if (!canAnswer) return;

    canAnswer = false;
    const selected = e.target;
    const selectedNumber = parseInt(selected.dataset['number']);

    selectedAnswers[currentQuestionIndex] = selectedNumber;

    const correctAnswer = questions[currentQuestionIndex].answer;
    const classToApply = selectedNumber === correctAnswer ? 'correct' : 'incorrect';

    choices.forEach((c) => {
      c.parentElement.classList.remove('correct', 'incorrect');
    });

    selected.parentElement.classList.add(classToApply);

    choices.forEach((choice, i) => {
      if (parseInt(choice.dataset['number']) === correctAnswer) {
        choice.parentElement.classList.add('correct');
      }
    });

    updateScore();
  });
});

function updateScore() {
  score = 0;
  selectedAnswers.forEach((ans, idx) => {
    if (ans && ans === questions[idx].answer) {
      score += CORRECT_BONUS;
    }
  });
  scoreText.innerText = score;
}

nextBtn.addEventListener('click', () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  } else {
    localStorage.setItem('mostRecentScore', score);
    window.location.assign("../terminarea_jocului/end.html");
  }
});

prevBtn.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  }
});
