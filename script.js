document.addEventListener("DOMContentLoaded", renderQuiz);

document.getElementById("submit-btn").addEventListener("click", submitQuiz);

function renderQuiz() {
    const container = document.getElementById("quiz-container");
    quizData.forEach((q, index) => {
        const questionElem = document.createElement("div");
        questionElem.className = "question";
        questionElem.setAttribute("data-type", q.type);
        questionElem.innerHTML = `<p>${q.question}</p>`;
        
        if (q.type === "single-answer" || q.type === "multiple-answer") {
            q.options.forEach((option) => {
                const inputType = q.type === "single-answer" ? "radio" : "checkbox";
                questionElem.innerHTML += `
                    <label>
                        <input type="${inputType}" name="question${index}" value="${option}" data-correct="${q.answer.includes(option)}">
                        ${option}
                    </label>
                `;
            });
        } else if (q.type === "free-form") {
            questionElem.innerHTML += `
                <input type="text" name="question${index}" data-correct="${q.answer}">
            `;
        }

        container.appendChild(questionElem);
    });
}

function submitQuiz() {
    let score = 0;
    let total = 0;

    document.querySelectorAll(".question").forEach((q, index) => {
        const type = q.getAttribute("data-type");
        const inputs = q.querySelectorAll("input");

        if (type === "single-answer") {
            inputs.forEach((input) => {
                if (input.checked && input.getAttribute("data-correct") === "true") {
                    score++;
                }
            });
        } else if (type === "multiple-answer") {
            let correctCount = 0;
            inputs.forEach((input) => {
                if (input.checked && input.getAttribute("data-correct") === "true") {
                    correctCount++;
                } else if (input.checked) {
                    correctCount = -1; // Incorrect answer invalidates question
                }
            });
            if (correctCount > 0) score++;
        } else if (type === "free-form") {
            const answer = inputs[0].value.trim().toLowerCase();
            const correctAnswers = inputs[0].getAttribute("data-correct").toLowerCase().split(",");
            if (correctAnswers.includes(answer)) score++;
        }

        total++;
    });

    const display = document.getElementById("score-display");
    display.textContent = `You scored ${score} out of ${total}.`;
}
