'use strict';

// require
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const cors = require('cors');
const app = express();

//  EJS
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


app.get('/', (request,response) =>{
  response.render('pages/index.ejs');
});






app.listen(process.env.PORT, () => console.log(process.env.PORT));
