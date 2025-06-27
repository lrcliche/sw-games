export function setupMathGame(element, player1Name) {
  let score = 0;
  let question;
  let difficulty = "facil"; // Default difficulty

  function generateQuestion() {
    let num1, num2, answer;
    const operation = ["+", "-", "*"][Math.floor(Math.random() * 3)];

    switch (difficulty) {
      case "facil":
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case "basico":
        num1 = Math.floor(Math.random() * 20) + 5;
        num2 = Math.floor(Math.random() * 20) + 5;
        break;
      case "dificil":
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 10;
        break;
    }

    switch (operation) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
    }

    question = {
      questionText: `${num1} ${operation} ${num2} = ?`,
      correctAnswer: answer,
    };
    return question;
  }

  function displayQuestion() {
    const questionObj = generateQuestion();
    element.querySelector("#math-question").textContent = questionObj.questionText;
  }

  function checkAnswer() {
    const userAnswer = parseInt(element.querySelector("#math-answer").value);
    if (userAnswer === question.correctAnswer) {
      score++;
      element.querySelector("#math-message").textContent = "¡Correcto!";
    } else {
      element.querySelector("#math-message").textContent = `Incorrecto. La respuesta correcta es ${question.correctAnswer}.`;
    }
    element.querySelector("#math-answer").value = "";
    displayQuestion();
  }

  function restartGame() {
    score = 0;
    element.querySelector("#math-message").textContent = "";
    displayQuestion();
  }

  function setDifficulty(newDifficulty) {
    difficulty = newDifficulty;
    restartGame();
  }

  element.querySelector("#submitBtnMath").addEventListener("click", checkAnswer);
  element.querySelector("#restartBtnMath").addEventListener("click", restartGame);

  // Difficulty selection buttons
  element.querySelector("#facilBtn").addEventListener("click", () => setDifficulty("facil"));
  element.querySelector("#basicoBtn").addEventListener("click", () => setDifficulty("basico"));
  element.querySelector("#dificilBtn").addEventListener("click", () => setDifficulty("dificil"));

  displayQuestion();
}
