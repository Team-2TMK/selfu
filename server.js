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

app.post('/', getUserData);

app.get('/quiz', getQuizData);

app.get('/results', getResultData);

app.get('/newresult', getNewResult);

// ============== CALLBACK FUNCTIONS =================
// Routes
function getHomePage(request, response) {
  response.render('pages/index.ejs');
}

function getUserData(request, response) {
  // get the user info from the login form
  let username = request.body.username;
  let city = request.body.city;

  // check the DB for existing user
  let SQL = 'SELECT * FROM users WHERE username=$1 AND city=$2;';
  let values = [username, city];

  client.query(SQL, values)
    .then( data => {
      if (data.rowCount) { // if there is a match in the DB...
        response.render('pages/index.ejs', { userInfo: data.rows[0] }); // send it to the home page
      } else { // if there isn't a match...
        // add the new user to the DB and...
        let addingSQL = 'INSERT INTO users (username, city) VALUES ($1, $2) RETURNING *;';
        let addingValues = [username, city];

        client.query(addingSQL,addingValues)
          .then( data => {
            response.render('pages/index.ejs', { userInfo: data.rows[0] }); // ... then send it back to the home page
          })
          .catch( e => { throw e; });
      }
    })
    .catch( e => { throw e; });
}

function getQuizData(request, response) {
  response.render('pages/quiz.ejs');
}

function getResultData(request, response) {
  let SQL = 'SELECT * FROM results;';

  client.query(SQL)
    .then( results => {
      response.render('pages/results.ejs', { results: results.rows[0] });
    })
    .catch( e => { throw e; });
}

function getNewResult(request, response) {
  console.log('hi from back');
  let quizValue = request.query.quizValue;
  console.log(quizValue);
  // let city = request.blah
  // let apiData = apiCall();
  // console.log('from inside getNewResult function: ', apiData);
  // let testObject = { cookie: 'samoas' };

  response.render('pages/newresult.ejs', { cookie: 'samoas' });
}

// =================== HELPER FUNCTIONS ===================

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

// apiCall();
// foodApiCall();

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

