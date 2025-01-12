document.addEventListener('DOMContentLoaded', function () {
  const quizContainer = document.getElementById('quiz-container');
  renderQuiz(quizData, quizContainer);

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.addEventListener('click', submitQuiz);
});

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

function submitQuiz() {
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
      if (JSON.stringify(correctAnswers) === JSON.stringify(selectedAnswers)) score++;
    } else if (type === 'free-form') {
      const input = question.querySelector('input[type="text"]');
      if (quizData[index].answers.includes(input.value.trim().toLowerCase())) score++;
    }
  });

  document.getElementById('score-display').textContent = `You scored ${score} out of ${questions.length}!`;
}
