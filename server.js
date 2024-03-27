if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

const dbService = require('./database.js');
const crypto = require('crypto');

const validHTMLPaths = ['/index', '/about', '/abstract-art', '/blog-entry', '/blog', '/cart', '/contact', '/favourites', '/figure-drawing', '/gallery', '/imprint', '/privacy-policy', '/product-page', '/return-policy', '/terms-and-conditions', '/test'];
const validFetchPaths = ['/remove-from-cart', '/add-to-cart', '/getCart', '/getCartData', '/getFavourites', '/getProduct', '/getCategory', '/insertNewsletter', '/test', '/sendEmail', '/login', '/panel', '/forgot-password', '/sessionCount', '/products', '/panel/newsletter/sendNewsletter', '/panel/products', '/panel/orders', '/panel/transactions', '/panel/blog', '/panel/newsletter', '/panel/manageAccounts', '/panel/manage-accounts/getAccounts', '/panel/manageAccounts/getAccountRoles', '/panel/manageAccounts/editAccount', '/panel/manageAccounts/createAccount', '/change-profile-pic', '/panel/products/getProductSizes', '/panel/products/addProductSizes', '/panel/products/removeSizes', '/panel/products/getProductCategory', '/panel/products/addProductCategory', '/panel/products/removeCategories', '/panel/products/addProduct', '/panel/products/editProduct', '/panel/products/removeProduct', '/panel/products/getProduct/', '/panel/products/getProducts', '/panel/blog/createBlog', '/panel/blog/editBlog', '/panel/blog/removeBlog', '/panel/createBackup', '/logout'];

const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const fs = require('fs');
const os = require('os');
const https = require('https');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const multer = require('multer');

const { checkPermission } = require('./middlewares.js')

var user;

let tempAccounts = false;

let emailArray = [];
const registerToken = [];

const path = require('path');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());
app.use(session({
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
    res.sendFile(`${__dirname}/public/${urlPath}.html`);
  } else if (urlPath.startsWith('/product/')) {

    const matches = urlPath.match(/^\/([^\/]+)/); // Match the first part of the URL
    const url = matches[1]; // Get the first captured group

    res.sendFile(`${__dirname}/public/${url}.html`);


  } else if (validFetchPaths.includes(urlPath)) {
    next();
  } else if (urlPath.startsWith('/getProduct/') || urlPath.startsWith('/confirm/') || urlPath.startsWith('/unsubscribe/') || urlPath.startsWith('/register/') || urlPath.startsWith('/password-reset/') || urlPath.startsWith('/panel/products/removeProduct/') || urlPath.startsWith('/panel/products/getProduct/') || urlPath.startsWith('/panel/blog/removeBlog/') || urlPath.startsWith('/panel/manageAccounts/getAccount/') || urlPath.startsWith('/panel/manageAccounts/removeAccount/')) {
    console.log(urlPath);
    const newPath = validHTMLPaths.find(validPath => urlPath.includes(validPath));
    console.log(newPath);

    if (newPath && newPath !== '/blog') {
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
    console.log(productTitle);
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
const productUpload = multer({ storage: productPicStorage, fileFilter: fileFilter });


app.post('/remove-from-cart', upload.none(), (req,res) => {
  const productToRemove = req.body;

  if(productToRemove){

    const cartItemIndex = req.session.cart.findIndex((item) => {

      let temp;
  
      item.forEach((element) => {
  
  
        console.log(element.quantity, productToRemove[0].quantity);
  
        if (element.product_id === productToRemove[0].product_id &&
          element.product_name === productToRemove[0].product_name &&
          element.size_value === productToRemove[0].size_value) {
          temp = true;
        } else
          temp = false;
  
      })
      return temp;
    });

    req.session.cart = req.session.cart || [];

    console.log("213", req.session.cart);

    req.session.cart.splice(cartItemIndex, 1);
    req.session.save(session.cart);

    console.log("218", req.session.cart);

    res.status(200).json("Success!");
  }
})
app.post('/add-to-cart', upload.none(), (req, res) => {

  const { id, name, quantity, size } = req.body;

  const cart = [{ product_id: id, product_name: name, quantity: quantity, size_value: size }];

  // console.log(cart)
  req.session.cart = req.session.cart || [];

  const isCartItemInCart = req.session.cart.some((item) => {

    let temp;

    item.forEach((element) => {

      console.log(element.product_id, cart[0].product_id, element.product_name, cart[0].product_name);
      if (element.product_id === cart[0].product_id &&
        element.product_name === cart[0].product_name &&
        element.size_value === cart[0].size_value) {
        temp = true;
      } else {
        temp = false;
      }

    })

    return temp;

  });

  console.log(isCartItemInCart);

  const cartItemIndex = req.session.cart.findIndex((item) => {

    let temp;

    item.forEach((element) => {


      console.log(element.quantity, cart[0].quantity);

      if (element.product_id === cart[0].product_id &&
        element.product_name === cart[0].product_name &&
        element.quantity !== cart[0].quantity &&
        element.size_value === cart[0].size_value) {
        temp = true;
      } else
        temp = false;

    })
    return temp;
  });

  if (!isCartItemInCart) {
    req.session.cart.push(cart);
    req.session.save(session.cart)

    console.log(req.session.cart);
    console.log('New Item');
    res.status(200).json({message:'Item added to the cart.'});
  } else if (cartItemIndex !== -1) {
    console.log('Dif quantity');
    console.log(req.session.cart[cartItemIndex][0].quantity, cart[0].quantity);
    req.session.cart[cartItemIndex][0].quantity = cart[0].quantity;
    req.session.save();
    res.status(200).json({message:'Item added to the cart.'});;
  } else {
    console.log('Item exists');
    res.status(400).json({message:'Item is already in cart.'});
  }

})

app.get('/getCart', (req, res) => {

  const cart = req.session.cart;

  if (cart) {

    res.json(cart.flat());

  } else {
    res.json([]);
  }

})

app.post('/getCartData', upload.none(), (req, res) => {

  const formData = req.body;

  console.log(formData[0]);

  const db = dbService.getDbServiceInstance();

  if (formData) {

    const productData = db.getCartProducts(formData);

    productData
      .then((data) => {
        console.log("ProductData, ", data);
        res.json(data);
      })
      .catch(err => console.log(err));

  }

})


app.get('/getFavourites', (req, res) => {

  const db = dbService.getDbServiceInstance();

  const favourites = db.getFavourites();

  favourites
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch(err => console.log(err));
})

app.get('/getProduct/:name', (req, res) => {

  const name = req.params.name;


  const db = dbService.getDbServiceInstance();

  const product = db.getProduct(name);

  product
    .then((data) => {
      console.log(data);
      const product = data[0][0];
      const productImages = [];
      const productCategory = [];
      const productSize = [];
      for (i = 0; i < data[3].length; i++) {
        productSize.push(data[3][i]);
      }

      for (i = 0; i < data[2].length; i++) {
        productCategory.push(data[2][i]);
      }

      for (i = 0; i < data[1].length; i++) {
        productImages.push(data[1][i]);
      }
      const productArray = [];

      productArray.push(product);
      productArray.push(productImages);
      productArray.push(productCategory);
      productArray.push(productSize);

      console.log(productArray[0].product_id);
      res.json(productArray);
    })
    .catch(err => console.log(err));
})




app.get('/panel/createBackup', checkPermission(['Admin']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  try {
    db.createBackup()
      .then((data) => {

        console.log(data);

        const filePath = path.join(__dirname, 'dumps', path.basename(data));

        setTimeout(() => {

          fs.readFile(filePath, (err, data) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error reading file');
              return;
            }

            res.set({
              'Content-Type': 'application/octet-stream',
              'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`,
            });
            res.send(data);
          });
        }, 1000);

      })
      .catch(err => console.log(err))
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error creating backup');
  }

})

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


app.post('/panel/newsletter/sendNewsletter', checkPermission(['Admin', 'Editor']), upload.none(), (req, res) => {
  const { title, newsletter } = req.body;

  const db = dbService.getDbServiceInstance();

  const emails = db.getNewsletterEmails();

  emails
    .then((data) => {
      console.log(data);

      data.forEach((item, index) => {

        setTimeout(() => {

          console.log(item.email);

          const mailOptions = {
            from: `${process.env.Email_NAME}`,
            to: `${item.email}`,
            subject: title,
            //text: `From: ${name} (${email})\n\nMessage: ${message}`
            html: newsletter
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              res.status(500).send("Error sending email");
            } else {
              console.log(info);
              res.status(200).send("Email sent successfully");
            }
          });

        }, index * 1000)

      })

    })
    .catch(err => console.log(err));



});

// Handle Profile picture upload POST request
app.post('/change-profile-pic', upload.single('file'), (req, res) => {

  const db = dbService.getDbServiceInstance();

  if (req.file) {
    const fileName = profilePicDir.substring('public/'.length) + "/" + req.file.originalname;

    console.log("File name:" + fileName);
    console.log(req.session.passport.user.username);
    console.log(req.session.passport.user.picture);

    const profilePicPath = "public/" + req.session.passport.user.picture;
    console.log("Profile pic path: " + profilePicPath);
    fs.unlink(profilePicPath, (err) => {
      if (err) {
        console.log("Error deleting file!");
        return;
      }
      console.log("File deleted successfully!");
    });

    req.session.passport.user.picture = fileName;

    db.SetPicturePath(fileName, req.session.passport.user.username)
      .then(() => {
        console.log("Path Added to Database!");

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


app.post('/register/:token', upload.none(), async (req, res) => {

  const token = req.params.token;

  console.log(token, req.body.username, req.body.password);

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const db = dbService.getDbServiceInstance();
    if (req.body.username && hashedPassword != null) {

      db.registerUser(req.body.username, hashedPassword, token)
        .then(() => {
          res.redirect('/login');
        })
        .catch((error) => {
          console.log(error);
          res.json({ success: false });
        })
    } else {
      console.log("Wrong email!");
    }
  } catch {
    res.redirect('/register')
  }
})

app.get('/register/:token', (req, res) => {
  if (registerToken.includes(req.params.token)) {
    res.render('register.ejs')
  } else {
    res.render('404notfound.ejs');
  }
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

app.post('/panel/products/removeSizes', checkPermission(['Admin', 'Editor']), upload.none(), (req, res) => {
  const sizes = req.body.sizes;

  console.log(sizes);

  const db = dbService.getDbServiceInstance();

  db.removeProductSizes(sizes)
    .then(() => {
      console.log("Success!")
      res.status(200).json("Success!");
    })
    .catch(err => console.log(err))
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

app.post('/panel/products/removeCategories', checkPermission(['Admin', 'Editor']), upload.none(), (req, res) => {
  const categories = req.body.categories;

  console.log("test" + categories);

  const db = dbService.getDbServiceInstance();

  db.removeProductCategories(categories)
    .then(() => {
      console.log("Success!")
      res.status(200).json("Success!");
    })
    .catch(err => console.log(err))
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

app.get('/panel/products/getProduct/:id', checkPermission(['Admin', 'Editor']), (req, res) => {

  const productId = req.params.id;

  console.log("ProductIDD: " + productId);
  const db = dbService.getDbServiceInstance();
  const productData = db.getSpecificProduct(productId);

  productData
    .then((data) => {
      console.log(data);
      const product = data[0][0];
      const productImages = [];
      const productCategory = [];
      const productSize = [];
      for (i = 0; i < data[3].length; i++) {
        productSize.push(data[3][i]);
      }

      for (i = 0; i < data[2].length; i++) {
        productCategory.push(data[2][i]);
      }

      for (i = 0; i < data[1].length; i++) {
        productImages.push(data[1][i]);
      }
      const productArray = [];

      productArray.push(product);
      productArray.push(productImages);
      productArray.push(productCategory);
      productArray.push(productSize);

      console.log(productArray[0].product_id);
      res.json(productArray);
    })
    .catch(err => console.log(err));
})


app.post('/panel/products/addProduct', checkPermission(['Admin', 'Editor']), productUpload.array('file', 10), (req, res) => {

  const { title, price, category, description, details, date } = req.body;



  const files = req.files;
  console.log(title, price, category, description, details);
  console.log(files);

  const priceData = price.map(jsonString => JSON.parse(jsonString));

  console.log(Array.isArray(category));

  const productPicDir = "public/images/products";

  const fileNames = files.map(item => productPicDir.substring('public/'.length) + "/" + title + "/" + item.originalname);

  console.log(fileNames);

  const author = req.session.passport.user.username;
  console.log(author);

  const db = dbService.getDbServiceInstance();

  db.addProduct(title, priceData, description, details, category, date, author, fileNames)
    .then((data) => {
      console.log("SUCCESS!");
      res.status(200).send("Product added successfully!");
    })
    .catch(err => console.log(err));

})

app.post('/panel/products/editProduct', checkPermission(['Admin', 'Editor']), productUpload.array('file', 10), (req, res) => {

  const { id, newTitle, title, removePics, removePrices, newSizes, changedSizes, oldCategories, categories, description, details, date } = req.body;

  const files = req.files;


  const author = req.session.passport.user.username;
  console.log(author);

  let removePricesData;
  let changedSizesData;
  let newSizesData;

  if (removePrices != null) {
    removePricesData = removePrices.map(jsonString => JSON.parse(jsonString));
  }
  if (changedSizes != null) {
    changedSizesData = changedSizes.map(jsonString => JSON.parse(jsonString));
  }

  if (newSizes != null) {
    newSizesData = newSizes.map(jsonString => JSON.parse(jsonString));
  }

  console.log(`${id},${newTitle},${title},${removePrices},${changedSizesData}+, ${newSizesData},${categories},${description},${details},`);
  console.log(files);

  const productPicDir = "public/images/products";

  const removePicsArray = [];
  if (!Array.isArray(removePics)) {
    removePicsArray.push(removePics);
  } else if (Array.isArray(removePics)) {
    removePics.forEach(item => {
      removePicsArray.push(item);
    })
  }

  console.log(removePicsArray);

  const fileNames = files.map(item => productPicDir.substring('public/'.length) + "/" + title + "/" + item.originalname);

  console.log(fileNames);


  const db = dbService.getDbServiceInstance();
  db.editProduct(id, newTitle, removePicsArray, removePricesData, changedSizesData, newSizesData, oldCategories, categories, description, details, date, author, fileNames)
    .then(() => {
      console.log("Successfully edited product: " + newTitle);

      if (title !== newTitle) {

        const productPicDirOld = `public/images/products/${title}`;
        const productPicDirNew = `public/images/products/${newTitle}`;

        fs.rename(productPicDirOld, productPicDirNew, (err) => {
          if (err) {
            console.error(`Error renaming folder: ${err.message}`);
          } else {
            console.log('Folder renamed successfully');
          }
        })
      }

      if (removePicsArray != null) {

        removePicsArray.forEach(item => {

          const productPicDir = `public/${item}`;

          fs.unlink(productPicDir, (err) => {
            if (err) {
              console.error(`Error deleting file: ${err.message}`);
            } else {
              console.log('File deleted successfully');
            }
          })

        })
      }

      res.status(200).json("Success!");

    })
    .catch(err => console.log(err))

})

app.get('/panel/products/removeProduct/:id', checkPermission(['Admin']), async (req, res) => {

  const productId = req.params.id;

  console.log(productId + " Product id");

  const db = dbService.getDbServiceInstance();

  db.removeProduct(productId)
    .then((data) => {
      const productPicDir = `public/images/products/${data[0].product_name}`;

      console.log(data[0].product_name);

      fs.rm(productPicDir, { recursive: true }, (err) => {
        if (err) {
          console.error(`Error deleting folder: ${err.message}`);
        } else {
          console.log('Folder deleted successfully');
        }
      })

      console.log("Successfully deleted product: " + productId);

      res.status(200).send("Product deleted successfully!");

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


  const { title, content, date } = req.body;
  const picture = req.file;

  console.log(picture);
  console.log(title);
  console.log(content);
  console.log(date);
  console.log(req.session.passport.user.username);
  console.log(req.session.passport.user.picture);

  if (picture) {
    const fileName = blogPicDir.substring('public/'.length) + "/" + req.file.originalname;
    const db = dbService.getDbServiceInstance();

    db.createBlog(title, content, req.session.passport.user.username, fileName, date, req.session.passport.user.picture)
      .then(() => {
        console.log("Successfully created blog!");
      })
      .catch((err) => console.log(err));
  }

})

app.post('/panel/blog/editBlog', checkPermission(['Admin', 'Editor']), upload.none(), (req, res) => {

  const { id, title, content, date } = req.body;

  // Process the received data (perform database updates, etc.)
  console.log(`Received data: id=${id}, title=${title}, content=${content}`);

  const db = dbService.getDbServiceInstance();

  db.editBlog(id, title, content, req.session.passport.user.username, date, req.session.passport.user.picture)
    .then(() => {
      console.log("Successfully Updated blog!");
      res.status(200).json("Success!");
    })
    .catch((err) => console.log(err));

})

app.get('/panel/blog/removeBlog/:id', checkPermission('Admin'), (req, res) => {
  const blogId = req.params.id;

  console.log("TEST", blogId)

  const db = dbService.getDbServiceInstance();

  db.removeBlog(blogId)
    .then(() => {
      res.status(200).json("Success!");
    })
    .catch(err => console.log(err))
})


app.get('/panel/newsletter', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const getAccounts = db.getAccountData();

  console.log("Have access!")

})

app.get('/panel/manageAccounts', checkPermission('Admin'), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const getAccounts = db.getAccountData();

  getAccounts
    .then(data => {

      if (!tempAccounts) {
        data.forEach(item => {
          emailArray.push(item.user_email);
        })

        tempAccounts = true;
      }

      res.json(data);
      console.log(data);
    })
    .catch(err => console.log(err));

})

app.get('/panel/manageAccounts/getAccountRoles', checkPermission('Admin'), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const getAccountRoles = db.getAccountRoles();

  getAccountRoles
    .then(data => {
      res.json(data);
      console.log(data);
    })
    .catch(err => console.log(err));
})

app.get('/panel/manageAccounts/removeAccount/:id', checkPermission('Admin'), (req, res) => {
  const accountId = req.params.id;

  const db = dbService.getDbServiceInstance();

  db.removeAccount(accountId)
    .then((data) => {

      emailArray = emailArray.filter(item => item !== data);
      console.log(emailArray);
      res.status(200).json("Success!");
    })
    .catch(err => console.log(err))
})

app.get('/panel/manageAccounts/getAccount/:id', checkPermission('Admin'), (req, res) => {

  const accountId = req.params.id;

  console.log(accountId);

  const db = dbService.getDbServiceInstance();
  db.getSpecificAccount(accountId)
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log(err))
})

app.post('/panel/manageAccounts/editAccount', checkPermission('Admin'), upload.none(), (req, res) => {

  const { id, username, email, role } = req.body;

  console.log(id, username, email, role);

  const db = dbService.getDbServiceInstance();

  db.editAccount(id, username, email, role)
    .then(() => {

      res.status(200).json("Success!");
    })
    .catch(err => console.log(err))
})

app.post('/panel/manageAccounts/createAccount', checkPermission('Admin'), upload.none(), (req, res) => {

  const email = req.body.email;
  const role = req.body.role;

  if (emailArray.includes(email)) {
    res.status(409).json({ message: `That email is already registered to another account` });
  } else {

    const tokenLength = 128;
    const tokenValue = generateRandomToken(tokenLength);

    registerToken.push(tokenValue);

    const db = dbService.getDbServiceInstance();

    db.createAccount(email, role, tokenValue)
      .then(() => {

        const mailOptions = {
          from: process.env.EMAIL_NAME,
          to: email,
          subject: 'Create your Account',
          //text: `Click on the following link to register your account: http://25.48.211.38:3001/register/${tokenValue}`,
          html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="css/styles.css">
        </head>
        
        <body>
        
            <h2 style="font-size: 28px;
            line-height: 44px;
            font-weight: 400;
            font-family: sans-serif;
            white-space: normal;
            font-smooth: always;
            text-rendering: optimizeLegibility;">Click on the following button to register your account:</h2>
            <a href="http://localhost:3001/register/${tokenValue}" style ="text-decoration: none; font-family: sans-serif;
            color: #F2F2F2;
            font-size: 18px;
            line-height: 28.3px;
            font-weight: 400;
            padding: 15px 40px;
            display: inline-block;
            background-color: #67A329;
            transition: all 200ms ease-in-out;
            white-space: normal;
            font-smooth: always;
            text-rendering: optimizeLegibility;"class="button">Create Account</a>

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

      })
      .catch(error => console.log(error))

  }

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
