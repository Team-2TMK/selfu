'use strict';

// RESPONSE TRACKER
let x = 0;

// QUIZ CONSTRUCTOR
function Quiz(title) {
  this.title = title;
  this.questions = [];
}

// PUSH NEW QUESTIONS TO THE QUESTION ARRAY
Quiz.prototype.addQuestion = function(number, question, choice1, direction1, choice2, direction2) {
  this.questions.push([number, question, choice1, direction1, choice2, direction2]);
};

// MAKE A NEW QUIZ INSTANCE
let dateQuiz = new Quiz('dateQuiz');

// FILL IT WITH QUESTIONS
dateQuiz.addQuestion(1, 'how are you feeling?', 'good', 'x++', 'not so good', 'x--');
dateQuiz.addQuestion(2, 'how are you feeling?', 'good', 'x++', 'not so good', 'x--');
dateQuiz.addQuestion(3, 'how are you feeling?', 'good', 'x++', 'not so good', 'x--');
dateQuiz.addQuestion(4, 'how are you feeling?', 'good', 'x++', 'not so good', 'x--');
dateQuiz.addQuestion(5, 'how are you feeling?', 'good', 'x++', 'not so good', 'x--');

// write an event listener function (with jQuery, likely) for the choices, and apply the direction value with "chartResult"
// write a jQuery (maybe even handlebars) bit that renders quiz on page

// HELPER FUNCTIONS
function chartResult(response){
  if (response === 'x++'){
    x++;
  } else if (response === 'x--'){
    x--;
  }
  return x;
}

console.log('date quiz: ', dateQuiz);

