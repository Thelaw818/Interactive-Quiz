document.addEventListener("DOMContentLoaded", () => {
    fetch('quizData.json')
        .then(response => response.json())
        .then(data => {
            quizData = data.questions; // Assign JSON data to quizData
            renderQuiz();
        })
        .catch(error => console.error("Error loading quiz data:", error));
});

document.getElementById("submit-btn").addEventListener("click", submitQuiz);
