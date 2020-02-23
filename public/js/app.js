'use strict';

// ============== INDEX PAGE ==============

$('#login').on('click', function showHideLogin(){
  $('#welcomeMessage').show();
  $('#login').hide();
});

// ============== QUIZ PAGE ===============

$('#positive').on('click', function() {
  console.log('clicked');
});

$('#submit').on('click', function() {
  let url = 'http://localhost:3000/newresult';
  console.log(url);
  $.ajax(url, {
    method: 'get',
    dataType: 'json'
  })
    .then(data => {
      console.log(data);
    });
});

console.log('hello world');

