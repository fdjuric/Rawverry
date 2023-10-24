if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}

const dbService = require('./database.js');
const crypto = require('crypto');

const validHTMLPaths = ['/index', '/about', '/abstract-art', '/blog-entry', '/blog', '/cart', '/contact', '/favourites', '/figure-drawing', '/gallery', '/imprint', '/privacy-policy', '/product-page', '/return-policy', '/terms-and-conditions', '/test'];
const validFetchPaths = ['/getCategory', '/insertNewsletter', '/test', '/sendEmail', '/register', '/login', '/panel', '/forgot-password', '/sessionCount'];

const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const path = require('path');

const sessionIdsFilePath = path.join(__dirname, 'session-count.json');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());
app.use(session({
    //store: new redisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, //set true on production so it goes trough https
        httpOnly: true, //if true prevents client side JS from reading the cookie
        maxAge: 180 * 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize())
app.use(passport.session());

const initializePassport = require('./passport-config')
initializePassport(passport, getUserByUsername)

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

app.use((req, res, next) => {
    const urlPath = req.path;

    if (urlPath === '/' || urlPath === '') {
        // For the root path, proceed to the next middleware/route handler
        return next();
    }else if (urlPath.includes('/index')) {
        res.redirect('/');
    } else if (validHTMLPaths.includes(urlPath)) {
        res.sendFile(`${__dirname}/public${urlPath}.html`);
    } else if (validFetchPaths.includes(urlPath)) {
        next();
    } else if (urlPath.startsWith('/product/') || urlPath.startsWith('/confirm/') || urlPath.startsWith('/unsubscribe/') || urlPath.startsWith('/password-reset/')) {
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

    /*fs.readFile(`./sessions/sess-${req.sessionID}`, 'utf8', (err, data) => {
         if (err) {
           console.error(err);
         } else {
           try {
             const sessionData = JSON.parse(data);
             req.session.visited = sessionData.visited || false;
             req.session.visitorCount = sessionData.visitorCount || 0;
           } catch (error) {
             console.error(error);
           }
         }
         next();
       }); */

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


app.get('/sessionCount', (req, res) => {
    const sessionIds = loadSessionIds();

  // Check if the current session ID exists in the session IDs file
  if (!sessionIds[req.sessionID]) {
    // If it doesn't exist, add it to the session IDs object
    sessionIds[req.sessionID] = true;

    // Save session IDs to the JSON file
    saveSessionIds(sessionIds);
    console.log('Session ID added and saved.');
  } else {
    console.log('Session ID already exists.');

  }


  // Rest of your route logic
  res.send('Hello World');

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
            } else {
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

app.post('/login', passport.authenticate('local', {
    successRedirect: '/panel',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/panel', checkAuthenticated, (req, res) => {
    res.render('panel.ejs')
})

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password.ejs');
})


app.post('/forgot-password', (request, response) => {
    const { email } = request.body;

    const db = dbService.getDbServiceInstance();

    const checkEmail = db.getAccountEmail(email);
    checkEmail
        .then(data => {

            const tokenLength = 128;
            const tokenValue = generateRandomToken(tokenLength);

            db.changeAccountToken(tokenValue, data.user_email)
                .then(() => {

                    const mailOptions = {
                        from: process.env.EMAIL_NAME,
                        to: data.user_email,
                        subject: 'Reset Your Password',
                        text: `Click on the following link to reset your password: http://25.48.211.38:3001/password-reset/${tokenValue},
                    NOTE: If you did not request a password reset ignore this email.`,
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

                })

        })
        .catch(err => console.log(err));

});

app.get('/password-reset/:token', (request, response) => {

    const token = request.params.token;

    response.render('password-reset', { token });

})

app.post('/password-reset/:token', async (request, response) => {

    // try {

    if (request.body.password != null) {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const db = dbService.getDbServiceInstance();
        if (hashedPassword && request.params.token != null) {

            db.changePassword(request.params.token, hashedPassword)
                .then(() => {
                    console.log("Password changed successfully!");
                })
                .catch((error) => {
                    console.log(error);
                    response.json({ success: false });
                })
        } else {
            response.status(400).json({ success: false, message: "Invalid request" });
        }
    }
    //  } catch(error) {
    //     console.log(error);

    // }

});



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else
        res.redirect('/login');

}

function getUserByUsername(username) {
    const db = dbService.getDbServiceInstance()
    console.log(db.getUser(username))
    return db.getUser(username)
}

/*function getUserById(username){
    const db = dbService.getDbServiceInstance()
    console.log(db.getUser(username))
    const ide = db.getUser(username).admin_id
    console.log(ide)
    return ide
} */


function loadSessionIds() {
  try {
    const data = fs.readFileSync(sessionIdsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return an empty object if the file does not exist or there's an error reading it
    return {};
  }
}

function saveSessionIds(sessionIds) {
  fs.writeFileSync(sessionIdsFilePath, JSON.stringify(sessionIds, null, 2));
}




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
