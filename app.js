const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const path = require('path');
const errorHandler = require('./helpers/error-handler');

app.use(express.static(__dirname + '/libs'));


app.use(cors());
app.options('*', cors());

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(errorHandler);

//Routes
const categoriesRoutes = require('./routes/categories');
const projectsRoutes = require('./routes/projects');

const api = process.env.API_URL;
const port = process.env.PORT;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get(`${api}`, function(req, res) {
    res.render('pages/index');
});


// about page
app.get(`${api}/about`, function(req, res) {
    res.render('pages/about');
});






app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/projects`, projectsRoutes);

//Database
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME
    })
    .then(() => {
        console.log('we are using ' + process.env.DB_NAME);
        console.log("🌎 Successfully connected to the database");
    })
    .catch((err) => {
        console.log('😞 Could not connect to the database. Exiting now...', err);
    });
const PORT = process.env.PORT || 3000;

//Server
app.listen(PORT, () => {
    console.log(`✌server is running http://localhost:${port}`);
});
