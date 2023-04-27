(function(){
  // Functions
  function wirteQuiz(){
    // variable to store the HTML output
    const output = [];

    // for each question...
    Questions.forEach(
      (currentQuestion, questionNumber) => {

        // variable to store the list of possible answers
        const answers = [];

        // and for each available answer...
        for(letter in currentQuestion.answers){

          // ...add an HTML radio button
          answers.push(
            `<label>
              <input type="radio" name="question${questionNumber}" value="${letter}">
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
      }
    );

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join('');
  }

  function showResults(){

    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll('.answers');

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    Questions.forEach( (currentQuestion, questionNumber) => {

      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if(userAnswer === currentQuestion.correctAnswer){
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        answerContainers[questionNumber].style.color = 'lightgreen';
      }
      // if answer is wrong or blank
      else{
        // color the answers red
        answerContainers[questionNumber].style.color = 'red';
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${Questions.length}`;
  }

  function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    currentSlide = n;
    if(currentSlide === 0){
      previousButton.style.display = 'none';
    }
    else{
      previousButton.style.display = 'inline-block';
    }
    if(currentSlide === slides.length-1){
      nextButton.style.display = 'none';
      submitButton.style.display = 'inline-block';
    }
    else{
      nextButton.style.display = 'inline-block';
      submitButton.style.display = 'none';
    }
  }

  function showNextSlide() {
    showSlide(currentSlide + 1);
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  // Variables
  const quizContainer = document.getElementById('quiz');
  const resultsContainer = document.getElementById('results');
  const submitButton = document.getElementById('submit');
  const Questions = [
    {
      question: "Every valid web page can be represented as a tree. This tree is referred to as the",
      answers: {
        a: "JavaScript",
        b: "DOM",
        c: "API",
        d: "HTML"
      },
      correctAnswer: "b"
    },
    {
      question: "JavaScript uses what kind of interface to access the DOM structure?",
      answers: {
        a: "Node.js",
        b: "HTML5",
        c: "API",
        d: "CSS3"
      },
      correctAnswer: "c"
    },
    {
      question: "Which of the following is not a valid method for generating output to the screen?",
      answers: {
        a: "prompt",
        b: "document.write",
        c: "alert",
        d: "print"
      },
      correctAnswer: "d"
    },
    {
        question: "Which of these options does NOT require the use of parentheses?",
        answers: {
          a: "innerHTML",
          b: "document.write",
          c: "alert",
          d: "console.log"
        },
        correctAnswer: "A"
    },
    {
        question: "Which of the following does not generate output directly to the screen?",
        answers: {
          a: "document.write(message);",
          b: "console.log(message);",
          c: "alert",
          d: "element.innerHTML = message;t"
        },
        correctAnswer: "b"
    },
    {
        question: "How does prompt differ from alert?",
        answers: {
          a: "Only alert uses parentheses.",
          b: "Only prompt uses parentheses.",
          c: "The alert will return a value, prompt does not.",
          d: "The prompt will return a value, alert does not."
        },
        correctAnswer: "d"
    },
    {
        question: "Which of the following is not a valid variable name?",
        answers: {
          a: "variable1",
          b: "variableOne",
          c: "1variable",
          d: "oneVariable"
        },
        correctAnswer: "c"
    },
    {
        question: "Which of the following is not a valid variable name?",
        answers: {
          a: "variable-2",
          b: "variable_2",
          c: "variable$2",
          d: "variable_1"
        },
        correctAnswer: "a"
    },
    {
        question: "When a function returns a node from the DOM, it is of type",
        answers: {
          a: "Number",
          b: "String",
          c: "Object",
          d: "Boolean"
        },
        correctAnswer: "c"
    },
    {
        question: "A function that wants to return multiple values at once (such as document.getElementsByTagName) will return a/an",
        answers: {
          a: "Number",
          b: "String",
          c: "alert",
          d: "Array"
        },
        correctAnswer: "d"
    },
    {
        question: "Which of the following is not a valid operator?",
        answers: {
          a: " =+",
          b: "++",
          c: "==",
          d: "+="
        },
        correctAnswer: "a"
    },
    {
        question: "Which tag is used to let the browser know that it is about to see JavaScript code?",
        answers: {
          a: "js",
          b: "script",
          c: "stylesheet",
          d: "head"
        },
        correctAnswer: "b"
    }
];

  // Kick things off
  wirteQuiz();

  // Pagination
  const previousButton = document.getElementById("previousQuestion");
  const nextButton = document.getElementById("nextQuestion");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  // Show the first slide
  showSlide(currentSlide);

  // Event listeners
  submitButton.addEventListener('click', showResults);
  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);
})();


const startTime = 10;
let time = startTime * 60; 

const countDown = document.getElementById("timer");

setInterval(nextTime, 1000);

function nextTime() {
    const min = Math.floor(time / 60);
    let sec = time % 60;

    sec = sec < 10 ? "0" + sec : sec;

    countDown.innerHTML = `${min}:${sec}`;
    time--;

//when a question is wrong the time - 5 secs
  //   document.getElementById('incorrect').addEventListener('click', function() {
  //     sec -= 5;
  //     document.getElementById('timerDisplay').innerHTML='00:'+sec;
  // });
}//();
