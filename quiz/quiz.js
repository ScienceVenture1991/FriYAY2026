/* 
   quiz.js
   This makes every <div class="quiz"> on the page work.
   You DON'T need to change anything in here. All your questions,
   answers and results go in the HTML file.

   If you're curious how it works, read the comments below!
    */

// find every quiz on the page and set each one up
document.querySelectorAll(".quiz").forEach(setUpQuiz);

function setUpQuiz(quiz) {
  // what kind of quiz is this? "trivia" or "personality"
  const type = quiz.dataset.type === "personality" ? "personality" : "trivia";

  // grab all the pieces of the quiz
  const questions = Array.from(quiz.querySelectorAll(".question"));
  const progress = quiz.querySelector(".progress");
  const end = quiz.querySelector(".quiz-end");
  const scoreText = quiz.querySelector(".score");
  const results = Array.from(quiz.querySelectorAll(".result"));
  const restartButtons = quiz.querySelectorAll(".restart");

  // variables that remember things while you play
  let current = 0; // which question we're on (0 = the first one)
  let score = 0; // trivia: how many you got right
  let tally = {}; // personality, counts how many times each result was picked

  // show one question and hide the rest
  function showQuestion(number) {
    questions.forEach(function (question, i) {
      question.hidden = i !== number;
    });
    if (end) end.hidden = true;
    if (progress) {
      progress.hidden = false;
      progress.textContent = "question " + (number + 1) + " of " + questions.length;
    }
  }

  // go to the next question, or finish if that was the last one
  function nextQuestion() {
    current = current + 1;
    if (current < questions.length) {
      showQuestion(current);
    } else {
      finishQuiz();
    }
  }

  // the quiz is over! show the score or the result
  function finishQuiz() {
    questions.forEach(function (question) { question.hidden = true; });
    if (progress) progress.hidden = true;

    if (type === "trivia") {
      if (scoreText) {
        scoreText.textContent = "You got " + score + " out of " + questions.length + "!";
      }
    } else {
      // find the result that was picked the most (if it's a tie, the one listed first wins)
      let winner = null;
      results.forEach(function (result) {
        const name = result.dataset.result;
        if (winner === null || (tally[name] || 0) > (tally[winner.dataset.result] || 0)) {
          winner = result;
        }
      });
      results.forEach(function (result) { result.hidden = result !== winner; });
    }

    if (end) end.hidden = false;
  }

  // set up the answer buttons on every question
  questions.forEach(function (question) {
    const answers = question.querySelectorAll(".answer");
    const feedback = question.querySelector(".feedback");

    answers.forEach(function (answer) {
      answer.addEventListener("click", function () {
        // stop people from clicking more than one answer
        answers.forEach(function (button) { button.disabled = true; });
        answer.classList.add("picked");

        if (type === "trivia") {
          const isRight = answer.hasAttribute("data-correct");
          if (isRight) score = score + 1;

          answer.classList.add(isRight ? "correct" : "wrong");
          // always show which one was right
          answers.forEach(function (button) {
            if (button.hasAttribute("data-correct")) button.classList.add("correct");
          });
          if (feedback) feedback.textContent = isRight ? "correct!" : "not quite!";

          setTimeout(nextQuestion, 1200); // wait 1.2 seconds so you can see if you were right
        } else {
          const name = answer.dataset.result;
          tally[name] = (tally[name] || 0) + 1;
          setTimeout(nextQuestion, 300);
        }
      });
    });
  });

  // reset everything and start over
  function restart() {
    current = 0;
    score = 0;
    tally = {};
    quiz.querySelectorAll(".answer").forEach(function (button) {
      button.disabled = false;
      button.classList.remove("picked", "correct", "wrong");
    });
    quiz.querySelectorAll(".feedback").forEach(function (f) { f.textContent = ""; });
    showQuestion(0);
  }

  restartButtons.forEach(function (button) { button.addEventListener("click", restart); });

  // start the quiz!
  showQuestion(0);
}