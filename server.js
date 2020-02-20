'use strict';
require('dotenv').config();
const express = require('express');
//const pg = require('pg');
const app = express();

app.get('/', (request,response) =>{
    response.send('Hello World!')
});






   app.listen(process.env.PORT, () => console.log(process.env.PORT)) 
 