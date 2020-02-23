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
// app.get('/result', foodHandler);

app.get('/', getHomePage);

app.get('/quiz', getQuizData);

app.get('/results', getResultData);

app.get('/newresult', getNewResult);

// ============== CALLBACK FUNCTIONS =================
// Routes
function getHomePage(request, response) {
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

}


// function foodHandler(request, response) {
// }

function apiCall() {
  let locationURL = 'https://developers.zomato.com/api/v2.1/locations?query=seattle';
  // let foodURL = 
  console.log('I am the apiCall function!');

  try {
    superagent.get(locationURL)
      .set('user-key', `${process.env.ZOMATO_API_KEY}`)
      .then(data => {
        let locationObj ={
          entity_type: data.body.location_suggestions[0].entity_type,
          entity_id: data.body.location_suggestions[0].entity_id
        };
        // console.log('locationObj: ', locationObj);
        return locationObj;
      })
    // superagent.get(foodURL)
    // .then()
  }
  catch(error) {
    errorHandler(error);
  }
}

function foodApiCall() {
  let foodURL = 'https://developers.zomato.com/api/v2.1/location_details?entity_id=279&entity_type=city';
  console.log('I am the foodApiCall function!');

  try {
    superagent.get(foodURL)
      .set('user-key', `${process.env.ZOMATO_API_KEY}`)
      .then(data => {
        console.log(data.body.best_rated_restaurant[0].restaurant.name);
        return data;
      });
  }
  catch(error) {
    errorHandler(error);
  }

}

apiCall();
foodApiCall();

function getNewResult(request, response) {
  // console.log('hi from back');
  let quizValue = request.query.quizValue;
  console.log(quizValue);
  // let city = request.blah
  // let apiData = apiCall();
  // console.log('from inside getNewResult function: ', apiData);
  // let testObject = { cookie: 'samoas' };

  response.render('pages/newresult.ejs', { cookie: 'samoas' });
}

// Error Handler

function errorHandler(error, request, response) {
  response.status(500).send(error);
}


// =============== LISTENER ===================
client.connect()
  .then(() =>{
    app.listen(process.env.PORT, () => console.log(`server up on ${process.env.PORT}`));
  })
  .catch(() => { console.log('error'); });

