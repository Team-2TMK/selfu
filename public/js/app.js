'use strict';

$('#positive').on('click', function() {
  console.log('clicked');
});

$('#submit').on('click', function() {
  let url = 'http://localhost:3000/newresult';
  console.log(url);
  console.log('submitted');
  $.ajax(url, {
    method: 'post',
    dataType: 'json'
  })
    .then(data => {
      console.log(data);
    });
});

console.log('hello world');

