/**
 * Initializes the quiz when the DOM content is fully loaded. It sets up the quiz container and the submit button functionality.
 */
document.addEventListener('DOMContentLoaded', function() {
  const quizContainer = document.getElementById('quiz-container');
  renderQuiz(quizData, quizContainer);

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.addEventListener('click', submitQuiz);
});

/**
 * Renders the quiz questions and options within the given container.
 * @param {Object} quizData - The data for the quiz including questions and answers.
 * @param {HTMLElement} container - The DOM element where the quiz will be rendered.
 */
function renderQuiz(quizData, container) {
  quizData.forEach((questionData, index) => {
    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.setAttribute('data-type', questionData.type);

    // Add the question text
    questionElement.innerHTML = `<p>${questionData.question}</p>`;

    if (questionData.type === 'single-answer' || questionData.type === 'multiple-answer') {
      questionData.options.forEach(option => {
        const inputType = questionData.type === 'single-answer' ? 'radio' : 'checkbox';
        questionElement.innerHTML += `
          <label>
            <input type="${inputType}" name="question${index}" value="${option}" data-correct="${questionData.answer.includes(option)}">
            ${option}
          </label>
        `;
      });
    } else if (questionData.type === 'free-form') {
      questionElement.innerHTML += `
        <input type="text" name="question${index}" data-correct="${questionData.answers}">
      `;
    }

    container.appendChild(questionElement);
  });
}

/**
 * Checks if all quiz questions have been answered.
 * @return {Boolean} True if all questions are answered, false otherwise.
 */
function areAllQuestionsAnswered() {
  const questions = document.querySelectorAll('.question');
  for (const question of questions) {
    const inputs = question.querySelectorAll('input');
    if (Array.from(inputs).every(input => !input.checked && input.type !== 'text' && input.value.trim() === '')) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if the answer provided for a single-answer question is correct.
 * @param {HTMLElement} question - The DOM element representing the question.
 * @return {Boolean} True if the answer is correct, false otherwise.
 */
function isSingleAnswerCorrect(question) {
  const selected = question.querySelector('input[type="radio"]:checked');
  return selected && selected.getAttribute('data-correct') === 'true';
}

/**
 * Checks if the answers provided for a multiple-answer question are correct.
 * @param {HTMLElement} question - The DOM element representing the question.
 * @return {Boolean} True if all correct answers are selected, false otherwise.
 */
function isMultipleAnswerCorrect(question) {
  const inputs = question.querySelectorAll('input[type="checkbox"]');
  const correctAnswers = Array.from(inputs).filter(input => input.getAttribute('data-correct') === 'true');
  const selectedAnswers = Array.from(inputs).filter(input => input.checked);

  if (selectedAnswers.length !== correctAnswers.length) {
    return false;
  }

  return selectedAnswers.every(answer => correctAnswers.includes(answer));
}

/**
 * Checks if the answer provided for a free-form question is correct.
 * @param {HTMLElement} question - The DOM element representing the question.
 * @return {Boolean} True if the free-form answer is correct, false otherwise.
 */
function isFreeFormAnswerCorrect(question) {
  const input = question.querySelector('input[type="text"]');
  const correctAnswers = input.getAttribute('data-correct').split(',');
  return correctAnswers.includes(input.value.trim().toLowerCase());
}

/**
 * Submits the quiz, checks all answers, calculates the score, and displays it.
 * Alerts the user if not all questions have been answered.
 */
function submitQuiz() {
  if (!areAllQuestionsAnswered()) {
    alert('Please answer all questions before submitting the quiz.');
    return;
  }

  let score = 0;
  const questions = document.querySelectorAll('.question');

  questions.forEach(question => {
    const type = question.getAttribute('data-type');
    if (type === 'single-answer') {
      if (isSingleAnswerCorrect(question)) score++;
    } else if (type === 'multiple-answer') {
      if (isMultipleAnswerCorrect(question)) score++;
    } else if (type === 'free-form') {
      if (isFreeFormAnswerCorrect(question)) score++;
    }
  });

  const scoreDisplay = document.getElementById('score-display');
  scoreDisplay.textContent = `You scored ${score} out of ${questions.length}!`;
}

/**
 * Creates and returns a new score display element.
 * @return {HTMLElement} The created score display element.
 */
function createScoreDisplay() {
  const display = document.createElement('div');
  display.id = 'score-display';
  return display;
}
