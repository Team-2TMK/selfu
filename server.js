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
app.use(cors());

//  ==================== EJS ======================
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ================== GLOBAL ===================
let currentUser = {};

// ================== ROUTES ====================

app.get('/', getHomePage);

app.post('/', getUserData);

app.get('/quiz', getQuizData);

app.get('/results', getResultData);

app.get('/newresult', getNewResult);

app.get('/aboutus', getAboutUs);

app.post('/results', saveToMyDates);

// ============== CALLBACK FUNCTIONS =================
// Routes
function getHomePage(request, response) {
  response.render('pages/index.ejs');
}

function getAboutUs(request, response) {
  response.render('pages/aboutus.ejs');
}

function getUserData(request, response) {
  // get the user info from the login form
  let username = request.body.username;
  let city = request.body.city;

  // check the DB for existing user
  let SQL = 'SELECT * FROM users WHERE username=$1 AND city=$2;';
  let values = [username, city];

  client.query(SQL, values)
    .then(data => {
      if (data.rowCount) {
        currentUser = data.rows[0];
        console.log('if there: ', currentUser);
        response.render('pages/index.ejs', { userInfo: data.rows[0] });
      } else {
        let addingSQL = 'INSERT INTO users (username, city) VALUES ($1, $2) RETURNING *;';
        let addingValues = [username, city];

        client.query(addingSQL, addingValues)
          .then(data => {
            currentUser = data.rows[0];
            console.log('if not there: ', currentUser);
            response.render('pages/index.ejs', { userInfo: data.rows[0] });
          })
          .catch(e => { throw e; });
      }
    })
    .catch(e => { throw e; });
}

function getQuizData(request, response) {
  response.render('pages/quiz.ejs');
}

async function getResultData(request, response) {
  let SQL = 'SELECT * FROM results;';

  let results = await client.query(SQL);

  response.render('pages/results.ejs', { results: results.rows });

}

async function getNewResult(request, response) {
  let quizValue = request.query.quizValue;
  // console.log(quizValue);

  let zomatoResult = await foodApiCall();
  let eventResult = await eventApiCall(currentUser.city);

  // console.log(zomatoResult);
  // console.log(eventResult);

  // if (quizValue >= 0){
  // make certain api calls
  // } else if (quizValue < 0) {
  // make these api calls
  // }

  // RENDER ALL THE API CALL RESULTS HERE

  response.render('pages/newresult.ejs', { butt: zomatoResult, roundButt: eventResult });
}

function saveToMyDates(request, response) {
  let foodData = {
    photo: request.body.foodPhoto,
    name: request.body.foodName,
    cuisine: request.body.foodCuisine,
    timings: request.body.foodTimings
  };

  let eventData = {
    name: request.body.eventName,
    link: request.body.eventLink,
    date: request.body.eventDate,
    summary: request.body.eventSummary
  };

  let parsedFood = JSON.stringify(foodData);
  let parsedEvent = JSON.stringify(eventData);

  let SQL = 'INSERT INTO results (userid, dateitemone, dateitemtwo, dateitemthree, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  let values = [1, parsedFood, parsedEvent, '"placeholder"', 0];

  client.query(SQL, values)
    .then(data => { response.redirect('/results'); })
    .catch(e => { throw e; });
}


// =================== HELPER FUNCTIONS ===================

function randomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function locationZomatoApiCall(city) {
  try {
    console.log('from api: ', currentUser);

    // console.log(city);
    let locationURL = `https://developers.zomato.com/api/v2.1/locations?query=${city}`;
    // let locationURL = 'https://developers.zomato.com/api/v2.1/locations?query=seattle';
    let data = await superagent.get(locationURL).set('user-key', `${process.env.ZOMATO_API_KEY}`);

    let locationObj = {
      entity_type: data.body.location_suggestions[0].entity_type,
      entity_id: data.body.location_suggestions[0].entity_id
    };
    return locationObj;
  }
  catch (error) {
    errorHandler(error);
  }
}

async function foodApiCall() {
  try {
    let data = await locationZomatoApiCall(currentUser.city);

    let foodURL = `https://developers.zomato.com/api/v2.1/location_details?entity_id=${data.entity_id}&entity_type=${data.entity_type}`;

    data = await superagent.get(foodURL).set('user-key', `${process.env.ZOMATO_API_KEY}`);

    let newInstance = new Zomato(data.body.best_rated_restaurant[randomNumber(10)].restaurant);
    // console.log(newInstance);

    return newInstance;
  }
  catch (error) {
    errorHandler(error);
  }

}

async function eventApiCall(city) {
  try {
    let eventurl = `http://api.eventful.com/json/events/search?location=${city}&app_key=${process.env.EVENTFUL_API_KEY}&within=7&date=ThisWeek&page_size=1`;

    let data = await superagent.get(eventurl);

    let dataObj = JSON.parse(data.text).events.event;
    let eventsArray = dataObj.map(object => new Event(object));
    let eventsObject = eventsArray[0];

    // console.log(eventsObject);
    return eventsObject;

  }
  catch (error) {
    errorHandler(error);
  }
}



// ================= CONSTRUCTORS ================

function Zomato(data) {
  this.name = data.name || 'No Name Available';
  this.cuisine = data.cuisines || 'No Cuisine Information Available';
  this.timings = data.timings || 'No Hours Information Available';
  this.highlights = data.highlights || 'No Highlights Available';
  this.url = data.url || 'No Website Information Available';
  this.photo = data.photos ? data.photos[0].photo.thumb_url : 'No Photo Available';
}

function Event(eventData) {
  this.link = eventData.url || 'No Link Available';
  this.name = eventData.title || 'No Title Available';
  this.event_date = eventData.start_time || 'No Time and Date Available';
  this.summary = eventData.description || 'No Description Available';
}

// =============== ERROR HANDLER ===================
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

// =============== LISTENER ===================
client.connect()
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`server up on ${process.env.PORT}`));
  })
  .catch(() => { console.log('error'); });

