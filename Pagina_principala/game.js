const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');


const categorySelect = document.getElementById('category-select');

let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let score = 0;
let finished = false;


let selectedCategory = categorySelect ? categorySelect.value : 9;

categorySelect.addEventListener('change', (e) => {
    selectedCategory = e.target.value;
    loadQuestions();
});


function loadQuestions() {
    fetch(`https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=easy&type=multiple`)
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

// Dacă nu se selectează o categorie, se folosește una implicită (General Knowledge)
if (selectedCategory) {
    loadQuestions();
}

const CORRECT_BONUS = 10;

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
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

    // Actualizează bara de progres
    progressText.innerText = `Question ${index + 1}/${questions.length}`;
    progressBarFull.style.width = `${((index + 1) / questions.length) * 100}%`;

    // Marchează răspunsul selectat anterior dacă există
    const prevSelected = selectedAnswers[index];
    if (prevSelected !== null) {
        const correctAnswer = questions[index].answer;
        const choice = choices[prevSelected - 1];
        const classToApply = prevSelected == correctAnswer ? 'correct' : 'incorrect';
        choice.parentElement.classList.add(classToApply);
    }
}

// Click pe opțiuni
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        const selected = e.target;
        const selectedNumber = selected.dataset['number'];

        // Salvează răspunsul
        selectedAnswers[currentQuestionIndex] = parseInt(selectedNumber);

        // Verifică dacă răspunsul este corect
        const correctAnswer = questions[currentQuestionIndex].answer;
        const classToApply = selectedNumber == correctAnswer ? 'correct' : 'incorrect';

        // Îndepărtează clasele de corect/greșit din toate opțiunile
        choices.forEach((c, i) => {
            c.parentElement.classList.remove('correct', 'incorrect');
        });

        // Aplică clasa corectă pentru opțiunea selectată
        selected.parentElement.classList.add(classToApply);

        // Afișează răspunsul corect
        choices.forEach((choice, i) => {
            if (parseInt(choice.dataset['number']) === correctAnswer) {
                choice.parentElement.classList.add('correct');
            }
        });

        // Actualizează scorul
        updateScore();
    });
});

function updateScore() {
    // Recalculează scorul
    score = 0; // Resetează scorul înainte de a-l calcula
    selectedAnswers.forEach((ans, idx) => {
        if (ans === questions[idx].answer) {
            score += CORRECT_BONUS; // Adaugă bonus pentru răspunsuri corecte
        }
    });
    scoreText.innerText = score; // Afișează scorul actualizat pe ecran
}

// Navigare
nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        // Termină jocul
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


// Schimbare fundal în funcție de categorie
const categoryBackgrounds = {
    9: 'images/general2.jpg',
    11: 'images/film2.jpg',
    12: 'images/music2.jpg',
    17: 'images/computers2.jpg',
    18: 'images/gadgets2.jpg'
};

function updateBackground(categoryId) {
    const bgUrl = categoryBackgrounds[categoryId];
    if (bgUrl) {
        document.body.style.backgroundImage = `url('${bgUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
    } else {
        document.body.style.backgroundImage = 'none';
    }
}

// Când se schimbă categoria
categorySelect.addEventListener('change', (e) => {
    selectedCategory = e.target.value;
    updateBackground(selectedCategory); // actualizează fundalul
    loadQuestions(); // reîncarcă întrebările
});

// Setează fundalul inițial la încărcare
window.addEventListener('DOMContentLoaded', () => {
    updateBackground(selectedCategory);
});



