if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}

const dbService = require('./database.js');
const crypto = require('crypto');

const validHTMLPaths = ['/index', '/about', '/abstract-art', '/blog-entry', '/blog', '/cart', '/contact', '/favourites', '/figure-drawing', '/gallery', '/imprint', '/panel', '/privacy-policy', '/product-page', '/return-policy', '/terms-and-conditions'];
const validFetchPaths = ['/getCategory', '/insertNewsletter', '/test', '/sendEmail', , '/register', '/login'];

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 180 * 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize())
app.use(passport.session());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

app.use((req, res, next) => {
    const urlPath = req.path;

    if (urlPath.includes('/index')) {
        res.redirect('/');
    } else if (validHTMLPaths.includes(urlPath)) {
        res.sendFile(`${__dirname}/public${urlPath}.html`);
    } else if (validFetchPaths.includes(urlPath)) {
        next();
    } else if (urlPath.startsWith('/product/') || urlPath.startsWith('/confirm/') || urlPath.startsWith('/unsubscribe/')) {
        const newPath = validHTMLPaths.find(validPath => urlPath.includes(validPath));
        console.log(newPath);

        if (newPath) {
            // Redirect to the URL without the common prefixes and with the valid HTML path
            res.redirect(newPath);
        } else {
            next();
        }
    } else {
        res.render('404notfound');
    }
});

/*app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const errorMessage = err.message ||'Internal Server Error';

    res. status(statusCode).render('error', { statusCode: statusCode, errorMessage: errorMessage});
}); */


//Setting up credentials for the email

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASS,
    },
});




//Inserting the email to the database

app.post('/insertNewsletter', (request, response) => {
    const db = dbService.getDbServiceInstance();
    var email = request.body.emailData;
    console.log("Email from server" + email);

    if (email) {

        //create random token then send the link to the email
        const tokenLength = 128;
        const tokenValue = generateRandomToken(tokenLength);
        //on opening the link go into db.insertNewsletter with the email
        db.insertNewsletter(email, tokenValue)
            .then((emailExists) => {
                console.log(emailExists);
                if (emailExists) {
                    console.log('Email already exists!');
                    var newsletterStatus = request.body.newsletterStatusData;
                    console.log(newsletterStatus);
                    newsletterStatus = "Email already exists!";
                    console.log("New: " + newsletterStatus);
                    response.json({ success: false, message: newsletterStatus });
                } else {
                    const mailOptions = {
                        from: process.env.EMAIL_NAME,
                        to: email,
                        subject: 'Confirm Your Subscription',
                        text: `Click on the following link to confirm your subscription: http://localhost:3001/confirm/${tokenValue},
                    else if you want to unsubscribe click on the following link: http://localhost:3001/unsubscribe/${tokenValue}`,
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.status(500).send('Failed to send confirmation email.');
                        } else {
                            console.log('Email sent: ' + info.response);
                            res.send('Check your email for a confirmation link.');
                        }
                    });
                    response.json({ success: true, message: newsletterStatus });
                }
            })
            .catch((error) => {
                console.error(error);
                response.json({ success: false });
            });
    } else {
        response.status(400).json({ success: false, message: "Invalid request" });
    }
});

//Confirming the email for the newsletter

app.get('/confirm/:token', (request, response) => {

    const db = dbService.getDbServiceInstance();
    const token = request.params.token;

    if (token) {
        db.confirmNewsletter(token)
            .then(() => {
                response.render('confirm');
                console.log('Subscribed successfully!')
            })
            .catch((error) => {
                console.error(error);
                response.json({ success: false });
            })
    }
})


//Unsubscribing from the newsletter
app.get('/unsubscribe/:token', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const token = request.params.token;
    console.log(token);
    if (token) {
        db.unsubscribeNewsletter(token)
            .then(() => {
                response.render('unsubscribe');
            })
            .catch((error) => {
                console.error(error);
                response.json({ success: false });
            })
    }
})


app.use(bodyParser.urlencoded({ extended: true }));

app.post('/sendEmail', (request, response) => {
    const { name, email, message } = request.body;

    const mailOptions = {
        from: `${email}`,
        to: `${process.env.Email_NAME}`,
        subject: `New message from ${name}`,
        text: `From: ${name} (${email})\n\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            response.status(500).send("Error sending email");
        } else {
            console.log(info);
            response.status(200).send("Email sent successfully");
        }
    });

});


app.post('/register', async (request, response) => {

    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        const db = dbService.getDbServiceInstance();
        if (request.body.username && hashedPassword && request.body.email != null) {

            let isEmail = validateEmail(request.body.email);

            if (isEmail) {
                const tokenLength = 128;
                const tokenValue = generateRandomToken(tokenLength);

                db.registerUser(request.body.username, hashedPassword, request.body.email, tokenValue)
                    .then(() => {
                        response.redirect('/login');
                    })
                    .catch((error) => {
                        console.log(error);
                        response.json({ success: false });
                    })
            }else {
                console.log("Wrong email!");
            }
        } else {
            response.status(400).json({ success: false, message: "Invalid request" });
        }
    } catch {
        response.redirect('/register')
    }
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})


//Opens the server on the port 3001

app.listen('3001', () => {
    console.log('Server started on port 3001');
});

//Generates an unique token

function generateRandomToken(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(charset.length);
        token += charset.charAt(randomIndex);
    }

    return token;
}


//Checking if the email format is correct
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}
