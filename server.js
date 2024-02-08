if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

const dbService = require('./database.js');
const crypto = require('crypto');

const validHTMLPaths = ['/index', '/about', '/abstract-art', '/blog-entry', '/blog', '/cart', '/contact', '/favourites', '/figure-drawing', '/gallery', '/imprint', '/privacy-policy', '/product-page', '/return-policy', '/terms-and-conditions', '/test'];
const validFetchPaths = ['/getCategory', '/insertNewsletter', '/test', '/sendEmail', '/register', '/login', '/panel', '/forgot-password', '/sessionCount', '/products', '/sendTest', '/panel/products', '/panel/orders', '/panel/transactions', '/panel/blog', '/panel/newsletter', '/panel/manage-accounts', '/change-profile-pic', '/panel/products/getProductSizes', '/panel/products/addProductSizes', '/panel/products/getProductCategory', '/panel/products/addProductCategory', '/panel/products/addProduct', '/panel/products/getProducts', '/panel/blog/createBlog', '/panel/blog/editBlog', '/logout'];

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

const multer = require('multer');

const { checkPermission } = require('./middlewares.js')

var user;

const path = require('path');


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
  } else if (urlPath.includes('/index')) {
    res.redirect('/');
  } else if (validHTMLPaths.includes(urlPath)) {
    res.sendFile(`${__dirname}/public${urlPath}.html`);
  } else if (validFetchPaths.includes(urlPath)) {
    next();
  } else if (urlPath.startsWith('/product/') || urlPath.startsWith('/confirm/') || urlPath.startsWith('/unsubscribe/') || urlPath.startsWith('/password-reset/' || urlPath.startsWith('/panel/products/removeProduct/'))) {
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

const profilePicDir = 'public/images/profile';
const blogPicDir = 'public/images/blog';

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (req, file, cb) => {
  // Extract the file extension from the originalname
  const fileExtension = file.originalname.split('.').pop().toLowerCase();

  // Check if the uploaded file's MIME type or extension is in the allowedTypes array
  if (allowedTypes.includes(file.mimetype) || allowedTypes.includes(`image/${fileExtension}`)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, or GIF allowed.'), false); // Reject the file
  }
};


// Define storage location and filename for profile picture
const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profilePicDir); // Save files to the 'images/profile' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save file with its original name
  }
});

// Define storage location and filename for profile picture
const blogPicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, blogPicDir); // Save files to the 'images/profile' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save file with its original name
  }
});

// Define storage location and filename for product pictures
const productPicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      const productTitle = req.body.title; // Assuming 'title' is the product title field in the form
      const productFolderPath = path.join(__dirname, 'public', 'images', 'products', productTitle);

      // Create the directory if it doesn't exist
      fs.mkdirSync(productFolderPath, { recursive: true });

      cb(null, productFolderPath); // Save files to the 'public/images/products/{productTitle}' folder
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname); // Save file with its original name
  }
});



const upload = multer({ storage: profilePicStorage, fileFilter: fileFilter });
const blogUpload = multer({ storage: blogPicStorage, fileFilter: fileFilter });
const productUpload = multer({ storage: productPicStorage, fileFilter: fileFilter});

const db = dbService.getDbServiceInstance();
db.createBackup();
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


app.get('/sendTest', (request, response) => {
  // const { name, email, message } = request.body;

  const mailOptions = {
    from: `${process.env.Email_NAME}`,
    to: `${process.env.Email_NAME}`,
    subject: `New message from Chupi`,
    //text: `From: ${name} (${email})\n\nMessage: ${message}`
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und">
         <head>
          <meta charset="UTF-8">
          <meta content="width=device-width, initial-scale=1" name="viewport">
          <meta name="x-apple-disable-message-reformatting">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta content="telephone=no" name="format-detection">
          <title>New email template 2023-11-15</title><!--[if (mso 16)]>
            <style type="text/css">
            a {text-decoration: none;}
            </style>
            <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG></o:AllowPNG>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]--><!--[if !mso]><!-- -->
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet"><!--<![endif]-->
          <style type="text/css">
        #outlook a {
            padding:0;
        }
        .es-button {
            mso-style-priority:100!important;
            text-decoration:none!important;
        }
        a[x-apple-data-detectors] {
            color:inherit!important;
            text-decoration:none!important;
            font-size:inherit!important;
            font-family:inherit!important;
            font-weight:inherit!important;
            line-height:inherit!important;
        }
        .es-desk-hidden {
            display:none;
            float:left;
            overflow:hidden;
            width:0;
            max-height:0;
            line-height:0;
            mso-hide:all;
        }
        @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:center } h2 { font-size:24px!important; text-align:center } h3 { font-size:20px!important; text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:center } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:center } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:center } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
        </style>
         </head>
         <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
          <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:#281A3E"><!--[if gte mso 9]>
                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                        <v:fill type="tile" color="#281a3e"></v:fill>
                    </v:background>
                <![endif]-->
           <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#281A3E">
             <tr>
              <td valign="top" style="padding:0;Margin:0">
               <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                 <tr>
                  <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                     <tr>
                      <td align="left" style="padding:20px;Margin:0"><!--[if mso]><table style="width:560px" cellpadding="0"
                                    cellspacing="0"><tr><td style="width:115px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                         <tr>
                          <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:115px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:12px"><img src="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/group_202.png" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="115" title="Logo"></a></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td><td style="width:20px"></td><td style="width:425px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="left" style="padding:0;Margin:0;width:425px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="right" class="es-m-txt-c" style="padding:0;Margin:0"><!--[if mso]><a href="https://viewstripo.email" target="_blank" hidden>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://viewstripo.email" 
                        style="height:41px; v-text-anchor:middle; width:202px" arcsize="0%" strokecolor="#fb5607" strokeweight="1px" fillcolor="#281a3e">
                <w:anchorlock></w:anchorlock>
                <center style='color:#fb5607; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:15px; font-weight:400; line-height:15px;  mso-text-raise:1px'>MY ACCOUNT</center>
            </v:roundrect></a>
        <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#fb5607;background:#281a3e;border-width:1px;display:inline-block;border-radius:0px;width:auto;mso-hide:all"><a href="https://viewstripo.email" class="es-button es-button-1665051675918" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#fb5607;font-size:18px;padding:10px 40px;display:inline-block;background:#281a3e;border-radius:0px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid  #281a3e">MY ACCOUNT</a></span><!--<![endif]--></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td></tr></table><![endif]--></td>
                     </tr>
                   </table></td>
                 </tr>
               </table>
               <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                 <tr>
                  <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#8338EC;border-radius:50px 50px 0 0;width:600px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:30px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img class="adapt-img" src="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/group.png" alt="Cyber Monday" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="400" title="Cyber Monday"></a></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-top:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">The elusive Cyber Monday sale<br>can only be spotted for one&nbsp;days a year!</p></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                     <tr>
                      <td align="left" background="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/group_3uo.png" style="Margin:0;padding-bottom:20px;padding-top:40px;padding-left:40px;padding-right:40px;background-image:url(https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/group_3uo.png);background-repeat:no-repeat;background-position:480px top"><!--[if mso]><table style="width:520px" cellpadding="0" cellspacing="0"><tr><td style="width:238px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                         <tr>
                          <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:238px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-left:3px solid #ffbe0b;border-right:3px solid #ffbe0b;border-top:3px solid #ffbe0b;border-bottom:3px solid #ffbe0b">
                             <tr>
                              <td align="center" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:15px;padding-right:15px"><h1 style="Margin:0;line-height:84px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:70px;font-style:normal;font-weight:normal;color:#ffffff"><strong>15%</strong></h1><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#ffffff"><strong></strong>OFF</h1><strong><span style="color:#FFFFFF">site wide</span></strong></td>
                             </tr>
                           </table></td>
                         </tr>
                         <tr class="es-mobile-hidden">
                          <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:238px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" height="40" style="padding:0;Margin:0"></td>
                             </tr>
                           </table></td>
                         </tr>
                         <tr>
                          <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:238px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-left:3px solid #ffbe0b;border-right:3px solid #ffbe0b;border-top:3px solid #ffbe0b;border-bottom:3px solid #ffbe0b">
                             <tr>
                              <td align="center" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:15px;padding-right:15px"><h1 style="Margin:0;line-height:86px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:72px;font-style:normal;font-weight:normal;color:#ffffff"><strong>45%</strong></h1><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#ffffff"><strong></strong>OFF</h1><strong><span style="color:#FFFFFF">orders over $100</span></strong></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td><td style="width:40px"></td><td style="width:242px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                         <tr class="es-mobile-hidden">
                          <td align="left" style="padding:0;Margin:0;width:242px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" height="100" style="padding:0;Margin:0"></td>
                             </tr>
                           </table></td>
                         </tr>
                         <tr>
                          <td align="left" style="padding:0;Margin:0;width:242px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-left:3px solid #ffbe0b;border-right:3px solid #ffbe0b;border-top:3px solid #ffbe0b;border-bottom:3px solid #ffbe0b">
                             <tr>
                              <td align="center" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:15px;padding-right:15px"><h1 style="Margin:0;line-height:86px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:72px;font-style:normal;font-weight:normal;color:#ffffff"><strong>25%</strong></h1><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#ffffff"><strong></strong>OFF</h1><strong><span style="color:#FFFFFF">orders over $50</span></strong></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td></tr></table><![endif]--></td>
                     </tr>
                     <tr>
                      <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:580px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="right" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/group_203.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="265"></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                     <tr>
                      <td align="left" style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:20px;padding-right:20px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img class="adapt-img" alt src="https://cdt-timer.stripocdn.email/api/v1/images/_NYdxTzSmHMw20m8aswhyXoTRe8MNJ3BMZDm7TZnRgs?l=1700069200319" width="493" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                     <tr>
                      <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:20px;padding-right:20px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:580px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/group_203_dOk.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="265"></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                     <tr>
                      <td align="left" style="Margin:0;padding-top:10px;padding-left:20px;padding-right:20px;padding-bottom:30px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><!--[if mso]><a href="https://viewstripo.email" target="_blank" hidden>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://viewstripo.email" 
                        style="height:51px; v-text-anchor:middle; width:180px" arcsize="0%" stroke="f"  fillcolor="#fb5607">
                <w:anchorlock></w:anchorlock>
                <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:18px; font-weight:400; line-height:18px;  mso-text-raise:1px'>SHOP NOW</center>
            </v:roundrect></a>
        <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#fb5607;border-width:0px;display:inline-block;border-radius:0px;width:auto;mso-hide:all"><a href="https://viewstripo.email" class="es-button es-button-1665060087841" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:15px 40px;display:inline-block;background:#FB5607;border-radius:0px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #FB5607">SHOP NOW</a></span><!--<![endif]--></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table>
               <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                 <tr>
                  <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#8338ec" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#8338ec;width:600px">
                     <tr>
                      <td align="left" bgcolor="#ffffff" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;background-color:#ffffff;border-radius:50px 50px 0px 0px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#381474">Top picks for you</h1></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table>
               <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                 <tr>
                  <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px">
                     <tr>
                      <td align="left" style="padding:20px;Margin:0"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" align="left" class="es-left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                         <tr>
                          <td class="es-m-p20b" align="center" valign="top" style="padding:0;Margin:0;width:270px">
                           <table cellpadding="0" cellspacing="0" width="100%" background="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/ellipse_60.png" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-image:url(https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/ellipse_60.png);background-repeat:no-repeat;background-position:center top">
                             <tr>
                              <td align="center" style="padding:5px;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img src="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/group_206.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" class="p_image" width="260"></a></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                         <tr>
                          <td align="left" style="padding:0;Margin:0;width:270px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:30px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#381474" class="p_name">Apple iPad Pro 11" 128GB M1 Wi-Fi Silver</h3></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#381474;font-size:14px" class="p_description">Enim sit amet venenatis urn. Aliquet nec ullamcorper sit amet risus nullam.</p></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#381474"><strong class="p_price">$ 980.00 </strong><span style="color:#A9A9A9"><s style="text-decoration:line-through"><sup style="font-size:75%;line-height:0;vertical-align:0.4em" class="p_old_price">$ 1080.00</sup></s></span></h3></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><!--[if mso]><a href="https://viewstripo.email" target="_blank" hidden>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://viewstripo.email" 
                        style="height:41px; v-text-anchor:middle; width:180px" arcsize="0%" stroke="f"  fillcolor="#fb5607">
                <w:anchorlock></w:anchorlock>
                <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:15px; font-weight:400; line-height:15px;  mso-text-raise:1px'>SHOP NOW</center>
            </v:roundrect></a>
        <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#fb5607;border-width:0px;display:inline-block;border-radius:0px;width:auto;mso-hide:all"><a href="https://viewstripo.email" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 40px 10px 40px;display:inline-block;background:#FB5607;border-radius:0px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #FB5607">SHOP NOW</a></span><!--<![endif]--></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td></tr></table><![endif]--></td>
                     </tr>
                     <tr>
                      <td align="left" style="padding:20px;Margin:0"><!--[if mso]><table dir="ltr" cellpadding="0" cellspacing="0"><tr><td><table dir="rtl" style="width:560px" cellpadding="0" cellspacing="0"><tr><td dir="ltr" style="width:270px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                         <tr>
                          <td class="es-m-p20b" align="center" valign="top" style="padding:0;Margin:0;width:270px">
                           <table cellpadding="0" cellspacing="0" width="100%" background="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/ellipse_60.png" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-image:url(https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/ellipse_60.png);background-repeat:no-repeat;background-position:center top">
                             <tr>
                              <td align="center" style="padding:10px;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img src="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/group_205.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" class="p_image" width="250"></a></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td><td dir="ltr" style="width:20px"></td><td dir="ltr" style="width:270px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" align="left" class="es-left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                         <tr>
                          <td align="left" style="padding:0;Margin:0;width:270px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:30px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#381474" class="p_name">Apple Watch SE NEW 40mm Starlight</h3></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#381474;font-size:14px" class="p_description">Enim sit amet venenatis urn. Aliquet nec ullamcorper sit amet risus nullam.</p></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#381474"><strong class="p_price">$ 410.00 </strong><span style="color:#A9A9A9"><sup style="font-size:15px;line-height:0;vertical-align:0.4em"><s class="p_old_price" style="text-decoration:line-through">$ 1080.00</s></sup></span></h3></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><!--[if mso]><a href="https://viewstripo.email" target="_blank" hidden>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://viewstripo.email" 
                        style="height:41px; v-text-anchor:middle; width:180px" arcsize="0%" stroke="f"  fillcolor="#fb5607">
                <w:anchorlock></w:anchorlock>
                <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:15px; font-weight:400; line-height:15px;  mso-text-raise:1px'>SHOP NOW</center>
            </v:roundrect></a>
        <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#fb5607;border-width:0px;display:inline-block;border-radius:0px;width:auto;mso-hide:all"><a href="https://viewstripo.email" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 40px 10px 40px;display:inline-block;background:#FB5607;border-radius:0px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #FB5607">SHOP NOW</a></span><!--<![endif]--></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td></tr></table></td></tr></table><![endif]--></td>
                     </tr>
                     <tr>
                      <td align="left" style="padding:20px;Margin:0"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" align="left" class="es-left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                         <tr>
                          <td class="es-m-p20b" align="center" valign="top" style="padding:0;Margin:0;width:270px">
                           <table cellpadding="0" cellspacing="0" width="100%" background="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/ellipse_60.png" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-image:url(https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/ellipse_60.png);background-repeat:no-repeat;background-position:center top">
                             <tr>
                              <td align="center" style="padding:5px;Margin:0;font-size:0px"><img src="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/group_207.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="260" class="p_image"></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                         <tr>
                          <td align="left" style="padding:0;Margin:0;width:270px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:30px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#381474" class="p_name">Apple iPhone 14 Pro <br>128GB Silver</h3></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#381474;font-size:14px" class="p_description">Enim sit amet venenatis urn. Aliquet nec ullamcorper sit amet risus nullam.</p></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#381474"><strong class="p_price">$ 1380.00 </strong><span style="color:#A9A9A9"><sup style="font-size:15px;line-height:0;vertical-align:0.4em"><s class="p_old_price" style="text-decoration:line-through">$ 1080.00</s></sup></span></h3></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><!--[if mso]><a href="https://viewstripo.email" target="_blank" hidden>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://viewstripo.email" 
                        style="height:41px; v-text-anchor:middle; width:180px" arcsize="0%" stroke="f"  fillcolor="#fb5607">
                <w:anchorlock></w:anchorlock>
                <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:15px; font-weight:400; line-height:15px;  mso-text-raise:1px'>SHOP NOW</center>
            </v:roundrect></a>
        <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#fb5607;border-width:0px;display:inline-block;border-radius:0px;width:auto;mso-hide:all"><a href="https://viewstripo.email" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 40px 10px 40px;display:inline-block;background:#FB5607;border-radius:0px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #FB5607">SHOP NOW</a></span><!--<![endif]--></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td></tr></table><![endif]--></td>
                     </tr>
                     <tr>
                      <td align="left" style="Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:40px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><!--[if mso]><a href="https://viewstripo.email" target="_blank" hidden>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://viewstripo.email" 
                        style="height:41px; v-text-anchor:middle; width:230px" arcsize="0%" stroke="f"  fillcolor="#fb5607">
                <w:anchorlock></w:anchorlock>
                <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:15px; font-weight:400; line-height:15px;  mso-text-raise:1px'>SEE ALL OFFERS</center>
            </v:roundrect></a>
        <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#FB5607;border-width:0px;display:inline-block;border-radius:0px;width:auto;mso-hide:all"><a href="https://viewstripo.email" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 40px 10px 40px;display:inline-block;background:#FB5607;border-radius:0px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #FB5607">SEE ALL OFFERS</a></span><!--<![endif]--></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table>
               <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                 <tr>
                  <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                     <tr>
                      <td align="left" style="Margin:0;padding-bottom:10px;padding-top:20px;padding-left:20px;padding-right:20px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#381474">Shop with confidence<br></h1></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                     <tr>
                      <td align="left" bgcolor="#ff006e" style="Margin:0;padding-bottom:30px;padding-top:40px;padding-left:40px;padding-right:40px;background-color:#ff006e;border-radius:50px 50px 0px 0px"><!--[if mso]><table style="width:520px" cellpadding="0" cellspacing="0"><tr><td style="width:187px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                         <tr>
                          <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:147px">
                           <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#ffffff;border-radius:40px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:10px;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px"><img src="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/sticker.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="50"></a></td>
                             </tr>
                             <tr>
                              <td align="center" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px"><h4 style="Margin:0;line-height:120%;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;color:#381474">1-YEAR WARRANTY</h4></td>
                             </tr>
                           </table></td>
                          <td class="es-hidden" style="padding:0;Margin:0;width:40px"></td>
                         </tr>
                       </table><!--[if mso]></td><td style="width:147px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                         <tr>
                          <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:147px">
                           <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#ffffff;border-radius:40px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:10px;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px"><img src="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/truck.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="50"></a></td>
                             </tr>
                             <tr>
                              <td align="center" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px"><h4 style="Margin:0;line-height:120%;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;color:#381474">FREE SHIPPING*</h4></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td><td style="width:40px"></td><td style="width:146px" valign="top"><![endif]-->
                       <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                         <tr>
                          <td align="left" style="padding:0;Margin:0;width:146px">
                           <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#ffffff;border-radius:40px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:10px;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px"><img src="https://fclpafy.stripocdn.email/content/guids/CABINET_b581c9945fe2e4514a94e313baf823d7/images/package.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="50"></a></td>
                             </tr>
                             <tr>
                              <td align="center" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px"><h4 style="Margin:0;line-height:120%;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;color:#381474">30-DAY RETURNS</h4></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table><!--[if mso]></td></tr></table><![endif]--></td>
                     </tr>
                     <tr>
                      <td align="left" bgcolor="#ff006e" style="Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:30px;background-color:#ff006e;border-radius:0px 0px 50px 50px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><h2 style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#ffffff">This sale ends Friday. Sign up now to do a lot more with social. For a lot less.</h2></td>
                             </tr>
                             <tr>
                              <td align="center" class="es-m-txt-c" style="padding:10px;Margin:0;font-size:0">
                               <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:20px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px"><img title="Facebook" src="https://fclpafy.stripocdn.email/content/assets/img/social-icons/circle-white/facebook-circle-white.png" alt="Fb" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:20px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px"><img title="Twitter" src="https://fclpafy.stripocdn.email/content/assets/img/social-icons/circle-white/twitter-circle-white.png" alt="Tw" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:20px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px"><img title="Instagram" src="https://fclpafy.stripocdn.email/content/assets/img/social-icons/circle-white/instagram-circle-white.png" alt="Inst" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:20px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px"><img title="Youtube" src="https://fclpafy.stripocdn.email/content/assets/img/social-icons/circle-white/youtube-circle-white.png" alt="Yt" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                  <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px"><img title="Pinterest" src="https://fclpafy.stripocdn.email/content/assets/img/social-icons/circle-white/pinterest-circle-white.png" alt="P" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                 </tr>
                               </table></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                     <tr>
                      <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;color:#381474;font-size:12px">*Free delivery included on all of the Black Friday offers except accessories-only&nbsp;orders.</p></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table>
               <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                 <tr>
                  <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;border-radius:0 0 50px 50px;width:600px">
                     <tr>
                      <td align="left" style="padding:20px;Margin:0">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" style="padding:20px;Margin:0;font-size:0">
                               <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td style="padding:0;Margin:0;border-bottom:3px solid #ffbe0b;background:unset;height:1px;width:100%;margin:0px"></td>
                                 </tr>
                               </table></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#381474;font-size:14px">You are receiving this email because you signed up for&nbsp;<b>TECH</b>. Cheers!🍷</p></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#381474;font-size:14px">5502 Red Branch Diversion, Nipinnawasee, Alaska</p></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:20px;Margin:0;font-size:0">
                               <table border="0" width="60%" height="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td style="padding:0;Margin:0;border-bottom:1px solid #ffbe0b;background:unset;height:1px;width:100%;margin:0px"></td>
                                 </tr>
                               </table></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#381474;font-size:14px">😭&nbsp;<a href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px" target="_blank">Unsubscribe</a></p></td>
                             </tr>
                             <tr>
                              <td align="center" style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:20px;padding-right:20px;font-size:0">
                               <table border="0" width="60%" height="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td style="padding:0;Margin:0;border-bottom:1px solid #ffbe0b;background:unset;height:1px;width:100%;margin:0px"></td>
                                 </tr>
                               </table></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#381474;font-size:14px">💻&nbsp;<a href="https://viewstripo.email" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px">View code</a></p></td>
                             </tr>
                             <tr>
                              <td align="center" style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:20px;padding-right:20px;font-size:0">
                               <table border="0" width="60%" height="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td style="padding:0;Margin:0;border-bottom:1px solid #ffbe0b;background:unset;height:1px;width:100%;margin:0px"></td>
                                 </tr>
                               </table></td>
                             </tr>
                             <tr>
                              <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#381474;font-size:14px">🌎&nbsp;<a href="https://viewstripo.email" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#381474;font-size:14px">View online</a></p></td>
                             </tr>
                             <tr>
                              <td align="center" style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:20px;padding-right:20px;font-size:0">
                               <table border="0" width="60%" height="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td style="padding:0;Margin:0;border-bottom:1px solid #ffbe0b;background:unset;height:1px;width:100%;margin:0px"></td>
                                 </tr>
                               </table></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table>
               <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                 <tr>
                  <td class="es-info-area" align="center" style="padding:0;Margin:0">
                   <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                     <tr>
                      <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px">
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="left" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td align="center" class="es-infoblock made_with" style="padding:0;Margin:0;line-height:14px;font-size:0;color:#CCCCCC"><a target="_blank" href="https://viewstripo.email/?utm_source=templates&utm_medium=email&utm_campaign=gadgets_11&utm_content=top_picks_for_you" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"><img src="https://fclpafy.stripocdn.email/content/guids/CABINET_09023af45624943febfa123c229a060b/images/7911561025989373.png" alt width="125" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table>
          </div>
         </body>
        </html>`
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

// Handle Profile picture upload POST request
app.post('/change-profile-pic', upload.single('file'), (req, res) => {

  const db = dbService.getDbServiceInstance();

  if (req.file) {
    const fileName = profilePicDir.substring('public/'.length) + "/" + req.file.originalname;

    console.log("File name:" + fileName);
    //console.log(req.session.passport.user.username);
    //console.log(req.session.passport.user.picture);

    const profilePicPath = "public/" + req.session.passport.user.picture;
    console.log("Profile pic path: " + profilePicPath);
    fs.unlink(profilePicPath, (err) => {
      if (err) {
        console.log("Error deleting file!");
        return;
      }
      console.log("File deleted successfully!");
    });

    db.SetPicturePath(fileName, req.session.passport.user.username)
      .then(() => {
        console.log("Path Added to Database!");
        req.session.passport.user.picture = fileName;
        if (user.role === 'Admin') {
          res.render('adminPanel.ejs', { user: user });
        } else if (user.role === 'Editor') {
          res.render('editorPanel.ejs', { user: user });
        } else if (user.role == null) {
          res.redirect('/login');
        }
      })
      .catch((err) => console.log(err));
  }
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

app.get('/logout', (req, res) => {
  // Destroy the session data
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/login'); // Redirect to a login page or any other page after logout
    }
  });
});

app.get('/panel', checkAuthenticated, (req, res) => {

  user = req.session.passport.user;

  console.log(req.session.passport.user.picture);

  if (user == null) {
    res.redirect('/login');
  }


  if (user.role === 'Admin') {
    res.render('adminPanel.ejs', { user: user });
  } else if (user.role === 'Editor') {
    res.render('editorPanel.ejs', { user: user });
  } else if (user.role == null) {
    res.redirect('/login');
  }

})

//Products section

app.get('/panel/products', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const getData = db.getProductData();

  getData
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log(err));


})

app.get('/panel/products/getProductSizes', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const productData = db.getProductSizes();

  productData
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log(err));

})

app.post('/panel/products/addProductSizes', checkPermission(['Admin', 'Editor']), (req, res) => {

  const size = req.body.size;

  console.log(size);

  const db = dbService.getDbServiceInstance();

  db.addProductSizes(size)
    .then(() => {
      console.log("Successfully added product size!");
    })
    .catch((err) => console.log(err));

})

app.get('/panel/products/getProductCategory', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const productData = db.getProductCategory();

  productData
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log(err));

})

app.post('/panel/products/addProductCategory', checkPermission(['Admin', 'Editor']), (req, res) => {

  const category = req.body.category;

  console.log(category);

  const db = dbService.getDbServiceInstance();

  db.addProductCategory(category)
    .then(() => {
      console.log("Successfully added product category!");
    })
    .catch((err) => console.log(err));

})


app.get('/panel/products/getProducts', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const productData = db.getProducts();

  productData
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log(err));

})


app.post('/panel/products/addProduct', checkPermission(['Admin', 'Editor']), productUpload.array('file', 10), (req, res) => {

  const { title, price, size, category, description, details } = req.body;

  const files = req.files;
  console.log(title, price, size, category, description, details);
  console.log(files);

  console.log(Array.isArray(category));

  const productPicDir = "public/images/products";

  const fileNames = files.map(item => productPicDir.substring('public/'.length) + "/" + title + "/" + item.originalname); 

  console.log(fileNames);

  const db = dbService.getDbServiceInstance();

  db.addProduct(title, price, description, details, size, category, fileNames)
  .then((data) => {
    console.log("SUCCESS!");
  })
  .catch(err => console.log(err));

})

app.get('/panel/products/removeProduct/:id', checkPermission(['Admin']), (req,res) => {

  const productId = req.params.id;

  console.log(productId + " Product id");

  const db = dbService.getDbServiceInstance();

  db.removeProduct(productId)
  .then(() => {
    console.log("Successfully deleted product: " + productId);
  })
  .catch(err => console.log(err));
})

app.get('/panel/orders', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const getAccounts = db.getAccountData();

  console.log("Have access!")

})

app.get('/panel/transactions', checkPermission(['Admin']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const getAccounts = db.getAccountData();

  console.log("Have access!")

})

app.get('/panel/blog', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const blogData = db.getBlogData();

  blogData
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log(err));


})

app.post('/panel/blog/createBlog', checkPermission(['Admin', 'Editor']), blogUpload.single('file'), (req, res) => {

  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;
  const picture = req.file;

  console.log(picture);
  console.log(title);
  console.log(content);
  console.log(author);

  if (picture) {
    const fileName = blogPicDir.substring('public/'.length) + "/" + req.file.originalname;
    const db = dbService.getDbServiceInstance();

    db.createBlog(title, content, author, fileName, req.session.passport.user.picture)
      .then(() => {
        console.log("Successfully created blog!");
      })
      .catch((err) => console.log(err));
  }

})

app.post('/panel/blog/editBlog', checkPermission(['Admin', 'Editor']), (req, res) => {

  const { id, title, content, author } = req.body;

  // Process the received data (perform database updates, etc.)
  console.log(`Received data: id=${id}, title=${title}, content=${content}, author=${author}`);

  const db = dbService.getDbServiceInstance();

  db.editBlog(id, title, content, author)
    .then(() => {
      console.log("Successfully Updated blog!");
    })
    .catch((err) => console.log(err));



})


app.get('/panel/newsletter', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const getAccounts = db.getAccountData();

  console.log("Have access!")

})

app.get('/panel/manage-accounts', checkPermission('Admin'), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const getAccounts = db.getAccountData();

  getAccounts
    .then(data => {

      console.log(data);
    })

})



app.get('/forgot-password', (req, res) => {
  res.render('forgot-password.ejs');
})

app.get('/products', (req, res) => {
  res.render('products.ejs');
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
  console.log(token);

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

    //req.session.user = req.user;

    // console.log("HIIIII");
    /* console.log (req.user);
     console.log(req.session.user);
     console.log(req.user.id);
     console.log("This is username: " + req.session.username);
     console.log("This is id: " + req.session.user.id); */

    //console.log(user.user_name);

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
