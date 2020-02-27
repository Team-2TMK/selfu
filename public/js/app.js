'use strict';

// ============== INDEX PAGE ==============

$('#login').on('click', function showHideLogin() {
  $('#welcomeMessage').show();
  $('#login').hide();
});

// ============== QUIZ PAGE ===============
let x = 0;

// ======= QUESTION 1 =======
$('#one .enter').on('click', function (event) {
  event.preventDefault();
  if ($('input[name="questionOne"]:checked').val() === 'positive') {
    x++;
  } else if ($('input[name="questionOne"]:checked').val() === 'negative') {
    x--;
  }
});

// ======= QUESTION 2 ========
$('#two .enter').on('click', function (event) {
  event.preventDefault();
  if ($('input[name="questionTwo"]:checked').val() === 'positive') {
    x++;
  } else if ($('input[name="questionTwo"]:checked').val() === 'negative') {
    x--;
  }
});

// ======= QUESTION 3 =======
$('#three .enter').on('click', function (event) {
  event.preventDefault();
  if ($('input[name="questionThree"]:checked').val() === 'positive') {
    x++;
  } else if ($('input[name="questionThree"]:checked').val() === 'negative') {
    x--;
  }
});

// ======= QUESTION 4 =======
$('#four .enter').on('click', function (event) {
  event.preventDefault();
  if ($('input[name="questionFour"]:checked').val() === 'positive') {
    x++;
  } else if ($('input[name="questionFour"]:checked').val() === 'negative') {
    x--;
  }
});

// ======= QUESTION 5 =======
$('#five .enter').on('click', function (event) {
  event.preventDefault();
  if ($('input[name="questionFive"]:checked').val() === 'positive') {
    x++;
  } else if ($('input[name="questionFive"]:checked').val() === 'negative') {
    x--;
  }
});

// ======= SUBMIT THE QUIZ AND SEND TO BACK =======
$('#finalSubmit').on('click', function () {
  let url = 'http://localhost:3000/newresult';
  $.ajax(url, {
    method: 'get',
    dataType: 'json',
    data: { quizValue: x }
  })
    .then(data => {
      console.log(data.name);
    });
});
