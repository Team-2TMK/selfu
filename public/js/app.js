'use strict';

let x = 0;

// $('#positive').on('click', function() {
//   console.log('clicked');
// });


// console.log('hello world');

// $('input[name="name_of_your_radiobutton"]:checked').val();

// ======= QUESTION 1 =======
$('#one .enter').on('click', function(event) {
  event.preventDefault();
  if ( $('input[name="questionOne"]:checked').val() === 'positive' ) {
    x++;
    console.log(x);
  } else if ( $('input[name="questionOne"]:checked').val() === 'negative' ) {
    x--;
    console.log(x);
  }
});

// ======= QUESTION 2 ========
$('#two .enter').on('click', function(event) {
  event.preventDefault();
  if ( $('input[name="questionTwo"]:checked').val() === 'positive' ) {
    x++;
    console.log(x);
  } else if ( $('input[name="questionTwo"]:checked').val() === 'negative' ) {
    x--;
    console.log(x);
  }
});

$('#finalSubmit').on('click', function() {
  let url = 'http://localhost:3000/newresult';
  console.log(url);
  $.ajax(url, {
    method: 'get',
    dataType: 'json',
    data: { quizValue : x }
  })
    .then(data => {
      console.log(data);
    });
});