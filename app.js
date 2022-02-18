const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const helmet = require('helmet');
const compression = require('compression');

app.use(helmet());
app.use(express.static(__dirname + '/libs'));
app.use(compression()); //Compress all routes
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan('tiny'));

//Api vars
const api = process.env.API_URL;
const port = process.env.PORT;

//Routes
const categoriesRoutes = require('./routes/categories');
const projectsRoutes = require('./routes/projects');

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/projects`, projectsRoutes);


// index page
app.get(`/`, function(req, res) {
    res.sendFile(process.cwd() + '/index.html');
});

//Database
mongoose
    .connect(
  'mongodb+srv://ariel:ahjardines123...@cluster0.taubc.mongodb.net/cuban-api?retryWrites=true&w=majority'
        , {
        useNewUrlParser: true,
        useUnifiedTopology: true

    })
    .then(() => {
        console.log(`🌎 Successfully connected to the database: ${process.env.DB_NAME}`);
    })
    .catch((err) => {
        console.log('😞 Could not connect to the database. Exiting now...', err);
    });
//Server
app.listen(port, () => {
    console.log(`✌server is running  in http://localhost:${port}`);
});
