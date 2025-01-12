document.addEventListener("DOMContentLoaded", renderQuiz);

function renderQuiz() {
    const container = document.getElementById("quiz-container");
    quizData.forEach((q, index) => {
        const questionElem = document.createElement("div");
        questionElem.classList.add("question");

        // Add question text
        questionElem.innerHTML = `<p>${q.question}</p>`;

        // Add options for single and multiple-answer questions
        if (q.type === "single-answer" || q.type === "multiple-answer") {
            q.options.forEach(option => {
                const inputType = q.type === "single-answer" ? "radio" : "checkbox";
                questionElem.innerHTML += `
                    <label>
                        <input type="${inputType}" name="question${index}" value="${option}">
                        ${option}
                    </label>
                `;
            });
        } else if (q.type === "free-form") {
            // Add input for free-form questions
            questionElem.innerHTML += `
                <input type="text" name="question${index}">
            `;
        }

        container.appendChild(questionElem);
    });
}

document.getElementById("submit-btn").addEventListener("click", submitQuiz);

function submitQuiz() {
    let score = 0;

    quizData.forEach((q, index) => {
        const questionElem = document.querySelectorAll(".question")[index];
        if (q.type === "single-answer") {
            const selected = questionElem.querySelector("input:checked");
            if (selected && selected.value === q.answer) {
                score++;
            }
        } else if (q.type === "multiple-answer") {
            const selected = Array.from(questionElem.querySelectorAll("input:checked"))
                .map(input => input.value);
            if (JSON.stringify(selected.sort()) === JSON.stringify(q.answers.sort())) {
                score++;
            }
        } else if (q.type === "free-form") {
            const input = questionElem.querySelector("input").value.trim().toLowerCase();
            if (q.answers.includes(input)) {
                score++;
            }
        }
    });

    const scoreDisplay = document.getElementById("score-display");
    scoreDisplay.textContent = `You scored ${score} out of ${quizData.length}!`;
}
