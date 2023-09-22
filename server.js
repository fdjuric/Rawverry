if(process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}

const dbService = require('./database.js');

const validHTMLPaths = ['index.html', 'about.html', 'abstract-art.html'];
const validFetchPaths = ['/getCategory'];

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

//app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 180 * 24 * 60 * 60 * 1000}
}));

app.use(passport.initialize())
app.use(passport.session());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

app.use((req, res, next) => {
    const urlPath = req.path;

    if (urlPath === '/index') {
        res.redirect('/');
    } else if (validHTMLPaths.includes(urlPath)) {
        res.sendFile(`${__dirname}/public${urlPath}.html`);
    } else if (validFetchPaths.includes(urlPath)) {
        next();
    } else if (urlPath.startsWith('/product/')) {
        next();
    } else {
        next({ status: 404, message: 'File not found' });
    }
});

/*app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const errorMessage = err.message ||'Internal Server Error';

    res. status(statusCode).render('error', { statusCode: statusCode, errorMessage: errorMessage});
}); */

app.get('/getCategory', (request, response) => {
    const db = dbService.getDbServiceInstance();
    try {
    const category = db.getCategories();
    category
        .then(data => response.json({data: data}))
        .catch(err => console.log(err));
    } catch (error){
        console.log(error);
        response.status(500).json({error: 'Internal Server Error'});
    }
});


app.listen('3001', () => {
    console.log('Server started on port 3001');
});
