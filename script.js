document.addEventListener('DOMContentLoaded', function () {
  const quizContainer = document.getElementById('quiz-container');
  renderQuiz(quizData, quizContainer);

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.addEventListener('click', submitQuiz);
});

function renderQuiz(quizData, container) {
  const quizList = document.createElement('ol');
  quizData.questions.forEach((q, index) => {
    const questionItem = document.createElement('li');
    questionItem.className = q.type + ' question';
    questionItem.innerHTML = `<p>${q.question}</p>`;
    if (q.type === 'single-answer' || q.type === 'multiple-answer') {
      q.options.forEach((option) => {
        const inputType = q.type === 'single-answer' ? 'radio' : 'checkbox';
        const input = `<label>
                         <input type="${inputType}" name="question${index}" value="${option}" data-correct="${q.answer === option}">
                         ${option}
                       </label>`;
        questionItem.innerHTML += input;
      });
    } else if (q.type === 'free-form') {
      questionItem.innerHTML += `<input type="text" name="question${index}" data-correct-answers="${q.answers.join(',')}">`;
    }
    quizList.appendChild(questionItem);
  });
  container.appendChild(quizList);
}

function areAllQuestionsAnswered() {
  const questions = document.querySelectorAll('.question');
  for (let question of questions) {
    const inputs = question.querySelectorAll('input');
    if (!Array.from(inputs).some(input => input.checked || input.value)) {
      return false;
    }
  }
  return true;
}

function submitQuiz() {
  if (!areAllQuestionsAnswered()) {
    alert('Please answer all questions!');
    return;
  }

  const questions = document.querySelectorAll('.question');
  let score = 0;

  questions.forEach((question) => {
    if (question.classList.contains('single-answer')) {
      score += isSingleAnswerCorrect(question) ? 1 : 0;
    } else if (question.classList.contains('multiple-answer')) {
      score += isMultipleAnswerCorrect(question) ? 1 : 0;
    } else if (question.classList.contains('free-form')) {
      score += isFreeFormAnswerCorrect(question) ? 1 : 0;
    }
  });

  alert(`Your score: ${score}/${questions.length}`);
}

function isSingleAnswerCorrect(question) {
  const selected = question.querySelector('input:checked');
  return selected && selected.dataset.correct === 'true';
}

function isMultipleAnswerCorrect(question) {
  const selected = question.querySelectorAll('input:checked');
  const correctAnswers = Array.from(question.querySelectorAll('input[data-correct="true"]'));
  return selected.length === correctAnswers.length && Array.from(selected).every(input => input.dataset.correct === 'true');
}

function isFreeFormAnswerCorrect(question) {
  const input = question.querySelector('input');
  const correctAnswers = input.dataset.correctAnswers.split(',');
  return correctAnswers.includes(input.value.trim().toLowerCase());
}
