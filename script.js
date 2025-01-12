// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
  // Retrieve the quiz container and render the quiz
  const quizContainer = document.getElementById('quiz-container');
  renderQuiz(quizData, quizContainer);

  // Attach the event listener to the Submit button
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.addEventListener('click', submitQuiz);
});

/**
 * Renders the quiz questions and options within the given container.
 * @param {Array} quizData - The data for the quiz including questions and answers.
 * @param {HTMLElement} container - The DOM element where the quiz will be rendered.
 */
function renderQuiz(quizData, container) {
  quizData.forEach((questionData, index) => {
    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = `<p>${questionData.question}</p>`;

    if (questionData.type === 'single-answer' || questionData.type === 'multiple-answer') {
      questionData.options.forEach(option => {
        const inputType = questionData.type === 'single-answer' ? 'radio' : 'checkbox';
        questionElement.innerHTML += `
          <label>
            <input type="${inputType}" name="question${index}" value="${option}" data-correct="${questionData.answer && questionData.answer.includes(option)}">
            ${option}
          </label>`;
      });
    } else if (questionData.type === 'free-form') {
      questionElement.innerHTML += `<input type="text" name="question${index}" data-correct="${questionData.answers}">`;
    }

    container.appendChild(questionElement);
  });
}

/**
 * Submits the quiz, checks all answers, calculates the score, and displays it.
 */
function submitQuiz() {
  if (!areAllQuestionsAnswered()) {
    alert('Please answer all questions before submitting the quiz.');
    return;
  }

  let score = 0;
  const questions = document.querySelectorAll('.question');

  questions.forEach((question, index) => {
    const inputs = question.querySelectorAll('input');
    const type = quizData[index].type;

    if (type === 'single-answer') {
      const selected = question.querySelector('input[type="radio"]:checked');
      if (selected && selected.getAttribute('data-correct') === 'true') score++;
    } else if (type === 'multiple-answer') {
      const correctAnswers = Array.from(inputs).filter(input => input.getAttribute('data-correct') === 'true');
      const selectedAnswers = Array.from(inputs).filter(input => input.checked);

      if (
        correctAnswers.length === selectedAnswers.length &&
        correctAnswers.every(answer => selectedAnswers.includes(answer))
      ) {
        score++;
      }
    } else if (type === 'free-form') {
      const input = question.querySelector('input[type="text"]');
      if (quizData[index].answers.includes(input.value.trim().toLowerCase())) score++;
    }
  });

  document.getElementById('score-display').textContent = `You scored ${score} out of ${questions.length}!`;
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
      return false; // A question is unanswered
    }
  }
  return true; // All questions are answered
}
