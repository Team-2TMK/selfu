'use strict';

// ================ REQUIREMENTS =======================
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const cors = require('cors');
const app = express();
const methodOverride = require('method-override');

const client = new pg.Client(process.env.DATABASE_URL);

//  ==================== EJS ======================
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ================== ROUTES ====================
app.get('/', getHomePage);

app.get('/quiz', getQuizData);

app.get('/results', getResultData);

// ============== CALLBACK FUNCTIONS =================
function getHomePage(request, response){
  response.render('pages/index.ejs');
}

function getQuizData(request, response) {
  response.render('pages/quiz.ejs');
}

function getResultData(request, response) {
  let SQL = 'SELECT * FROM results;';
  // console.log('hello!');

  client.query(SQL)
    .then( results => {
      // console.log(results.rows[0]);
      response.render('pages/results.ejs', { results: results.rows[0] });
    })
    .catch( e => { throw e; });

  response.send('results page');
}


// =============== LISTENER ===================
client.connect()
  .then(() =>{
    app.listen(process.env.PORT, () => console.log(`server up on ${process.env.PORT}`));
  })
  .catch(() => { console.log('error'); });

