let intervalID;
var currentlySelected;
let numCorrect = 0;
(function () {
  // Functions
  function writeQuiz() {
    // variable to store the HTML output
    const output = [];
    output.push(
      `<div class="slide">
        <button id=startBtn >Start Quiz</button>
      </div>`
    );

    // for each question...
    Questions.forEach((currentQuestion, questionNumber) => {
      console.log(questionNumber);
      // variable to store the list of possible answers
      const answers = [];
      var i = 0;
      // and for each available answer...
      for (var letter in currentQuestion.answers) {
        i++;
        // ...add an HTML radio button
        // make sure that this is the correct order, answer
        answers.push(
          `<label>
              <input type="radio" name=question${questionNumber} class="answer" data-name="${letter}" />
              ${letter} :
              ${currentQuestion.answers[letter]}
            </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class="slide">
            <div class="question"> ${currentQuestion.question} </div>
            <div class="answers"> ${answers.join("")} </div>
          </div>`
      );
    });
    output.push(
      `<div class="slide" id="resultSlide">
        <form>
          <label for="name">Initials:</label>
          <input type="text" id="name">
        </form>
      </div>`
    );
    quizContainer.innerHTML = output.join("");
  }

  const startTime = 5;
  let time = startTime * 60;

  const countDown = document.getElementById("timer");

  function nextTime() {
    let min = Math.floor(time / 60);
    let sec = time % 60;

    sec = sec < 10 ? "0" + sec : sec;
    countDown.innerHTML = `${min}:${sec}`;

    if (sec == 0) {
      if (min == 0) {
        alert("Times up!");
        let resultSlide = document.getElementById("resultSlide");
        resultSlide.innerHTML += `<br\>${numCorrect} out of ${Questions.length}`;
        showSlide(Questions.length + 1);
        clearInterval(intervalID);
        return;
      }
    }
    time--;
  }

  function onSubmit() {
    //score out of 12 will display with an input form that asks for the usser innitials
    let name = document.getElementById("name").value;
    console.log(name);
    var scorelist = JSON.parse(localStorage.getItem("highScore")) || [];
    var scoreEntry = {
      name: name,
      score: numCorrect,
    };
    scorelist.push(scoreEntry);
    localStorage.setItem("highScore", JSON.stringify(scorelist));
    // document.cookie = `name=user; usernm=${name}; score=${numCorrect}`;
    // console.log(document.cookie);
    // let cookieValue = document.cookie.replace(
    //   /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
    //   "$1"
    // );
    // console.log(cookieValue);
    // table = `
    // <div id="slide">
    //   <table>
    //     <thead>
    //       <tr>
    //         <th>Name</th>
    //         <th>Score</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       <tr>
    //         <td>${name}</td>
    //         <td>${numCorrect}</td>
    //       </tr>
    //     </tbody>
    //   </table>
    // </div>
    // `;
    //quizContainer.innerHTML += table;

    showNextSlide();

    // resultsContainer.appendChild(input);
    // show number of correct answers out of total
    //resultsContainer.innerHTML += `<br \>${numCorrect} out of ${Questions.length}`;

    //todo this is where the initials form becomes visable
    //document.getElementById("initials").style = block;
  }
  //showing all scores to the screen
  let allScores = document.getElementById("scores");
  function showScore() {
    var scoreall = JSON.parse(localStorage.getItem("highScore")) || [];
    scoreall.sort((a, b) => b.score - a.score);
    scoreall.forEach((element) => {
      let list = document.createElement("li");
      list.textContent = element.name + " " + element.score;
      allScores.appendChild(list);
    });
  }
  function showSlide(n) {
    // was the question right or wrong
    var question = Questions[n];
    var answersInputs = document.querySelectorAll(".answer");
    var selectedAnswer;
    for (var i = 0; i < answersInputs.length; i++) {
      if (answersInputs[i].checked) {
        selectedAnswer = answersInputs[i].dataset.name;
      }
    }

    slides[currentSlide].classList.remove("active-slide");
    slides[n].classList.add("active-slide");
    currentSlide = n;
    // if (currentSlide === 0) {
    //   previousButton.style.display = "none";
    // } else {
    //   previousButton.style.display = "inline-block";
    // }
    if (currentSlide === slides.length - 1) {
      nextButton.style.display = "none";
      submitButton.style.display = "inline-block";
    } else {
      nextButton.style.display = "inline-block";
      submitButton.style.display = "none";
    }
  }

  function showNextSlide() {
    showSlide(currentSlide + 1);
  }

  function onNextQuestion() {
    let questionNumber = currentSlide - 1;
    let currentQuestion = Questions[questionNumber];
    const answerContainers = quizContainer.querySelectorAll(".answers");

    //asnwere is saved into "var answere" and moves on to the next question

    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    let userAnswer = answerContainer.querySelector(selector);
    if (userAnswer == null) {
      alert("Please select an answer!");
      return;
    }
    userAnswer = userAnswer.getAttribute("data-name");
    // if answer is correct
    if (userAnswer === currentQuestion.correctAnswer) {
      // add to the number of correct answers
      numCorrect++;
      // color the answers green
      answerContainers[questionNumber].style.color = "lightgreen";
    }
    // if answer is wrong or blank
    else {
      // color the answers red
      answerContainers[questionNumber].style.color = "red";
      if ((time -= 5) < 0) {
        time = 0;
      }
      let min = Math.floor(time / 60);
      let sec = time % 60;

      sec = sec < 10 ? "0" + sec : sec;
      countDown.innerHTML = `${min}:${sec}`;
    }
    if (questionNumber == Questions.length - 1) {
      let resultSlide = document.getElementById("resultSlide");
      resultSlide.innerHTML += `<br\>${numCorrect} out of ${Questions.length}`;
      clearInterval(intervalID);
    }
    // if questionNumber == length of Questions - 1, then append score to HTML element with id=resultSlide
    showNextSlide();
  }

  function onStartQuiz() {
    intervalID = setInterval(nextTime, 1000);
    showNextSlide();
  }

  // Variables
  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
  const Questions = [
    {
      question:
        "Every valid web page can be represented as a tree. This tree is referred to as the",
      answers: {
        a: "JavaScript",
        b: "DOM",
        c: "API",
        d: "HTML",
      },
      correctAnswer: "b",
    },
    {
      question:
        "JavaScript uses what kind of interface to access the DOM structure?",
      answers: {
        a: "Node.js",
        b: "HTML5",
        c: "API",
        d: "CSS3",
      },
      correctAnswer: "c",
    },
    // {
    //   question:
    //     "Which of the following is not a valid method for generating output to the screen?",
    //   answers: {
    //     a: "prompt",
    //     b: "document.write",
    //     c: "alert",
    //     d: "print",
    //   },
    //   correctAnswer: "d",
    // },
    // {
    //   question:
    //     "Which of these options does NOT require the use of parentheses?",
    //   answers: {
    //     a: "innerHTML",
    //     b: "document.write",
    //     c: "alert",
    //     d: "console.log",
    //   },
    //   correctAnswer: "A",
    // },
    // {
    //   question:
    //     "Which of the following does not generate output directly to the screen?",
    //   answers: {
    //     a: "document.write(message);",
    //     b: "console.log(message);",
    //     c: "alert",
    //     d: "element.innerHTML = message;t",
    //   },
    //   correctAnswer: "b",
    // },
    // {
    //   question: "How does prompt differ from alert?",
    //   answers: {
    //     a: "Only alert uses parentheses.",
    //     b: "Only prompt uses parentheses.",
    //     c: "The alert will return a value, prompt does not.",
    //     d: "The prompt will return a value, alert does not.",
    //   },
    //   correctAnswer: "d",
    // },
    // {
    //   question: "Which of the following is not a valid variable name?",
    //   answers: {
    //     a: "variable1",
    //     b: "variableOne",
    //     c: "1variable",
    //     d: "oneVariable",
    //   },
    //   correctAnswer: "c",
    // },
    // {
    //   question: "Which of the following is not a valid variable name?",
    //   answers: {
    //     a: "variable-2",
    //     b: "variable_2",
    //     c: "variable$2",
    //     d: "variable_1",
    //   },
    //   correctAnswer: "a",
    // },
    // {
    //   question: "When a function returns a node from the DOM, it is of type",
    //   answers: {
    //     a: "Number",
    //     b: "String",
    //     c: "Object",
    //     d: "Boolean",
    //   },
    //   correctAnswer: "c",
    // },
    // {
    //   question:
    //     "A function that wants to return multiple values at once (such as document.getElementsByTagName) will return a/an",
    //   answers: {
    //     a: "Number",
    //     b: "String",
    //     c: "alert",
    //     d: "Array",
    //   },
    //   correctAnswer: "d",
    // },
    // {
    //   question: "Which of the following is not a valid operator?",
    //   answers: {
    //     a: " =+",
    //     b: "++",
    //     c: "==",
    //     d: "+=",
    //   },
    //   correctAnswer: "a",
    // },
    // {
    //   question:
    //     "Which tag is used to let the browser know that it is about to see JavaScript code?",
    //   answers: {
    //     a: "js",
    //     b: "script",
    //     c: "stylesheet",
    //     d: "head",
    //   },
    //   correctAnswer: "b",
    // },
  ];

  // Kick things off
  writeQuiz();

  // Pagination
  //const previousButton = document.getElementById("previousQuestion");
  const nextButton = document.getElementById("nextQuestion");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  // Show the first slide
  showSlide(currentSlide);

  // Event listeners
  startBtn.addEventListener("click", onStartQuiz);
  submitButton.addEventListener("click", onSubmit);
  nextButton.addEventListener("click", onNextQuestion);
})();

// //todo this is where the cokie is being baked
// document.cookie = "resultsContainer; expires=Wed, 05 Aug 2023 23:00:00 UTC";

let scorebutton = document.getElementById("highScores");
scorebutton.addEventListener("click", showScore);
