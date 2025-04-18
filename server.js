if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

const dbService = require('./database.js');
const crypto = require('crypto');

const validHTMLPaths = ['/index', '/about', '/blog-entry', '/blog', '/cart', '/contact', '/gallery', '/imprint', '/privacy-policy', '/product-page', '/return-policy', '/terms-and-conditions'];
const validFetchPaths = ['/sendCheckoutEmail', '/insertCheckoutData', '/getCheckoutData', '/panel/dashboard', '/panel/orders/insertTrackingId', '/api/orders', '/paypal/refund', '/webhook', '/applyCoupon', '/proceed-to-checkout', '/remove-from-cart', '/add-to-cart', '/getCart', '/getCartData', '/getFavourites', '/getProduct', '/getCategories', '/getBlogs', '/insertNewsletter', '/sendEmail', '/login', '/panel', '/forgot-password', '/products', '/panel/newsletter/sendNewsletter', '/panel/products', '/panel/orders', '/panel/transactions', '/panel/blog', '/panel/newsletter', '/panel/coupon', '/panel/coupon/getProductNames', '/panel/coupon/createCoupon', '/panel/coupon/editCoupon', '/panel/manageAccounts', '/panel/manage-accounts/getAccounts', '/panel/manageAccounts/getAccountRoles', '/panel/manageAccounts/editAccount', '/panel/manageAccounts/createAccount', '/change-profile-pic', '/panel/products/getProductSizes', '/panel/products/addProductSizes', '/panel/products/removeSizes', '/panel/products/getProductCategory', '/panel/products/addProductCategory', '/panel/products/editProductCategory', '/panel/products/removeCategories', '/panel/products/addProduct', '/panel/products/editProduct', '/panel/products/removeProduct', '/panel/products/getProduct/', '/panel/products/getProducts', '/panel/blog/createBlog', '/panel/blog/editBlog', '/panel/blog/removeBlog', '/panel/createBackup', '/logout'];

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
const cheerio = require('cheerio');

const stripe = require('stripe')(`${process.env.stripe_secret}`)

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8888 } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const multer = require('multer');

const { checkPermission } = require('./middlewares.js')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 180 * 24 * 60 * 60 * 1000
  }
}));


//Setting up credentials for the email

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_TEMP,
    pass: process.env.EMAIL_TEMP_PASS,
  },
});


var user;

let tempAccounts = false;

let emailArray = [];
const registerToken = [];

var orderId;

const path = require('path');

const endpointSecret = "whsec_28efc077e25dd49ed9cbf3024bccc58b8ed0a609a869429a67693ac5e300161e";

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("Webhook verified!");
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      paymentIntentSucceeded = event.data.object;

      const metadata = paymentIntentSucceeded.metadata;

      console.log("135", metadata);

      const userData = JSON.parse(metadata.data);

      const data = { name: userData.name, email: userData.email, address: userData.address, country: userData.country, city: userData.city, postal: userData.postal, phone: userData.phone };

      console.log("136", userData);
      const db = dbService.getDbServiceInstance();

      db.insertCheckoutData(data, userData.date, userData.items, userData.price, paymentIntentSucceeded.id, 'stripe', paymentIntentSucceeded.latest_charge)
        .then(orderData => {
          console.log("99", orderData);

          const filePath = path.join(__dirname, 'public', 'mailCheckout.html');

          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.log(error);
              return;
            }

            const products = [];

            // Iterate over each key-value pair in the object
            Object.entries(metadata).forEach(([key, value]) => {
              if (key !== 'data') {
                products.push(JSON.parse(value));
              }
            });

            console.log("158", products)

            const $final = cheerio.load(data);

            let subtotal = products[0].product_price * products[0].product_quantity;

            $final('.cus-name').text(`Hello ${userData.name},`);
            $final('.p_name').text(`${products[0].product_name}`);
            $final('.p_size').text(`Size: ${products[0].product_size}`);
            $final('.p_quantity').text(`Quantity: ${products[0].product_quantity}`);
            $final('.p_price').text(`$${(products[0].product_price * products[0].product_quantity).toFixed(2)}`);
            $final('.b_title').html(`ORDER NO. ${orderData.insertId} <br>
              ${userData.date.split(" ")[0]}`)

            products.forEach((item, index) => {

              if (index > 0) {

                subtotal += + (item.product_price * item.product_quantity);

                $final('.product-row').last().after(`<tr class="product-row">
                          <td align="left"
                            style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-bottom:40px">
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none"
                              style="border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:195px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                      style="border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="center" style="padding:0;Margin:0;font-size:0px">
                                            <a target="_blank" href=""
                                              style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;text-decoration:underline;color:#67A329;font-size:16px">
                                              <img class="adapt-img p_image"
                                                src="https://drive.google.com/thumbnail?id=1c__dt0jIc7xsRBjr0G0R0j9ie3y9SN47"
                                                alt=""
                                                style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"
                                                width="195">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none"
                              style="border-collapse:collapse;border-spacing:0px;float:right">
                              <tbody>
                                <tr>
                                  <td align="left" style="padding:0;Margin:0;width:345px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td align="left" class="es-m-txt-c"
                                            style="Margin:0;padding-left:20px;padding-right:20px;padding-bottom:25px">
                                            <h3 class="p_name"
                                              style="Margin:0;line-height:36px;font-family:Mitr, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641">${item.product_name}</h3>
                                            <p class="p_size"
                                              style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">
                                              Size: ${item.product_size}</p>
                                            <p class="p_quantity"
                                              style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">
                                              Quantity: ${item.product_quantity}</p>
                                            <h3 class="p_price"
                                              style="Margin:0;line-height:36px;font-family:Mitr, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641">$${(item.product_price * item.product_quantity).toFixed(2)}</h3>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>`);
              }

            })


            $final('.order-total').html(`$${subtotal.toFixed(2)}<br>$${parseFloat(userData.discount).toFixed(2)}<br>$00.00`);
            $final('.total-price').text(`$${userData.price}`);

            const modifiedHtmlString = $final.html();

            const mailOptions = {
              from: process.env.EMAIL_TEMP,
              to: process.env.EMAIL_TEMP,
              subject: 'Order received',
              html: modifiedHtmlString
            };

            setTimeout(() => {
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            }, 5000)

          })
        })
      break;
    // ... handle other event types
    case 'charge.refunded':
      const refunded = event.data.object;
      console.log("97 ", refunded);
      res.json(refunded);

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static("client"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());

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

  } else if (urlPath.startsWith('/blog/')) {
    res.sendFile(`${__dirname}/public/blog-entry.html`);

  } else if (validFetchPaths.includes(urlPath)) {
    next();
  } else if (urlPath.startsWith('/getBlog/') || urlPath.startsWith('/panel/orders/initiateRefund/') || urlPath.includes(`${base}/v1/oauth2/token`) || urlPath.startsWith('/api/orders/') || urlPath.startsWith('/getGalleryData/') || urlPath.startsWith('/gallery/') || urlPath.startsWith('/getProduct/') || urlPath.startsWith('/confirm/') || urlPath.startsWith('/unsubscribe/') || urlPath.startsWith('/register/') || urlPath.startsWith('/password-reset/') || urlPath.startsWith('/panel/products/removeProduct/') || urlPath.startsWith('/panel/products/getProduct/') || urlPath.startsWith('/panel/blog/removeBlog/') || urlPath.startsWith('/panel/coupon/removeCoupon/') || urlPath.startsWith('/panel/manageAccounts/getAccount/') || urlPath.startsWith('/panel/manageAccounts/removeAccount/')) {
    console.log(urlPath);
    const newPath = validHTMLPaths.find(validPath => urlPath.includes(validPath));
    console.log(newPath);
    if (newPath && newPath !== '/blog' && newPath !== '/gallery') {
      // Redirect to the URL without the common prefixes and with the valid HTML path
      res.redirect(newPath);
    } if (urlPath.startsWith('/gallery/')) {
      res.sendFile(`${__dirname}/public/product-category.html`);
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
    const user = req.session.passport.user.username; // Assuming 'title' is the product title field in the form
    console.log(user);
    const profileFolderPath = path.join(__dirname, 'public', 'images', 'profile', user);

    // Create the directory if it doesn't exist
    fs.mkdirSync(profileFolderPath, { recursive: true });

    cb(null, profileFolderPath); // Save files to the 'public/images/products/{productTitle}' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save file with its original name
  }
});

// Define storage location and filename for profile picture
const blogPicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const title = req.body.title; // Assuming 'title' is the product title field in the form
    console.log(title);
    const blogFolderPath = path.join(__dirname, 'public', 'images', 'blog', title);

    // Create the directory if it doesn't exist
    fs.mkdirSync(blogFolderPath, { recursive: true });

    cb(null, blogFolderPath); // Save files to the 'public/images/products/{productTitle}' folder
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

const categoryPicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const categoryName = req.body.value;
    console.log(categoryName);
    const categoryFolderPath = path.join(__dirname, 'public', 'images', 'categories', categoryName);

    fs.mkdirSync(categoryFolderPath, { recursive: true });

    cb(null, categoryFolderPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});



const upload = multer({ storage: profilePicStorage, fileFilter: fileFilter });
const blogUpload = multer({ storage: blogPicStorage, fileFilter: fileFilter });
const productUpload = multer({ storage: productPicStorage, fileFilter: fileFilter });
const categoryUpload = multer({ storage: categoryPicStorage, fileFilter: fileFilter });

//Paypal access token generation

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

/**
* Create an order to start the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
*/
const createOrder = async (checkoutData, discount) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    checkoutData,
  );

  const productData = [];

  let totalQuantity = 0;
  let totalPrice = 0;
  let itemNames = "";

  checkoutData.forEach((item, index) => {
    if (index > 0) {
      productData.push(item)
      totalQuantity += +item.quantity;
      itemNames += item.product_name + `(${item.size_value})` + `x${item.quantity}` + '/'
    }

  })
  console.log(totalQuantity);

  const db = dbService.getDbServiceInstance();

  const productCheckoutData = await db.getCheckoutProducts(productData);

  const productEmailData = [];

  console.log(productCheckoutData, "197");

  productCheckoutData.forEach((item, index) => {
    let price = 0;

    if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
      price = item.product_price_reduced;
      totalPrice += +(item.product_price_reduced * productData[index].quantity);
    } else {
      price = item.product_price;
      totalPrice += +(item.product_price * productData[index].quantity);
    }

    productEmailData.push({ product_name: item.product_name, product_size: item.size_value, product_price: price, product_quantity: item.quantity, product_image: item.image_url });

    console.log(productData[index].quantity);
  })

  console.log("478", productEmailData);

  console.log(discount);

  console.log("Total: ", totalPrice)

  let totalDiscount = 0;

  if (discount) {
    if (discount.includes('%')) {
      let percentValue = parseFloat(discount.match(/\d+/)[0]);
      let discountPrice = totalPrice;

      totalPrice = totalPrice * (1 - (percentValue / 100));
      discountPrice -= totalPrice;
      totalDiscount = discountPrice;
      console.log("test1 304", totalPrice);
    } else {
      totalPrice = totalPrice - (discount / totalQuantity);
      let discountPrice = totalPrice;
      discountPrice -= totalPrice;
      totalDiscount = discountPrice;
      console.log("test2 307", totalPrice);
    }
  }

  console.log(totalPrice, "312")

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: totalPrice.toFixed(2),
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = { responseData: await handleResponse(response), items: itemNames, total: totalPrice, discount: totalDiscount, emailData: productEmailData };

  totalPrice = 0;

  return data;
};

const refundOrder = async (paymentId) => {

  const tokenLength = 36;
  const tokenValue = generateRandomToken(tokenLength);

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/payments/captures/${paymentId}/refund`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'PayPal-Request-Id': `${tokenValue}`,
      'Prefer': 'return=representation'
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  })

  console.log("475, ", response);
  return handleResponse(response);
}


/**
* Capture payment for the created order to complete the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
*/
const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

app.post("/api/orders", upload.none(), async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const checkoutData = req.body;

    console.log("387", checkoutData);

    let discount = req.session.discount;

    const data = await createOrder(checkoutData, discount);

    console.log("499 ", data);

    const { jsonResponse, httpStatusCode } = data.responseData;

    req.session.emailData = req.session.emailData || [];

    Object.entries(data.emailData).forEach(([key, value]) => {
        req.session.emailData.push(value);
    });

    req.session.save((err) => {
      if(err) console.log(err);
      console.log("628", req.session.emailData)
    })

    console.log("499 ", jsonResponse, httpStatusCode);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
    console.log(formattedDate);

    req.session.checkout = req.session.checkout || [];
    req.session.checkout = { data: checkoutData[0], date: formattedDate, items: data.items, price: data.total, discount: data.discount }
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      // Confirm that session has been saved
      console.log('Session saved successfully:', req.session.checkout);
    });

    console.log("526", jsonResponse);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

    const db = dbService.getDbServiceInstance();

    console.log("510, ", jsonResponse.purchase_units[0].payments.captures[0].id);

    const checkoutData = req.session.checkout;

    const emailProduct = req.session.emailData;

    console.log("534", checkoutData);

    db.insertCheckoutData(checkoutData.data, checkoutData.date, checkoutData.items, checkoutData.price, orderID, 'paypal', jsonResponse.purchase_units[0].payments.captures[0].id)
    .then(orderData => {
      console.log("99", orderData);

      const filePath = path.join(__dirname, 'public', 'mailCheckout.html');

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.log(error);
          return;
        }

        console.log("158", emailProduct)

        const $final = cheerio.load(data);

        let subtotal = emailProduct[0].product_price * emailProduct[0].product_quantity;

        $final('.cus-name').text(`Hello ${checkoutData.data.name},`);
        $final('.p_name').text(`${emailProduct[0].product_name}`);
        $final('.p_size').text(`Size: ${emailProduct[0].product_size}`);
        $final('.p_quantity').text(`Quantity: ${emailProduct[0].product_quantity}`);
        $final('.p_price').text(`$${(emailProduct[0].product_price * emailProduct[0].product_quantity).toFixed(2)}`);
        $final('.b_title').html(`ORDER NO. ${orderData.insertId} <br>
          ${checkoutData.date.split(" ")[0]}`)

          emailProduct.forEach((item, index) => {

          if (index > 0) {

            console.log("700", item);

            subtotal += + (item.product_price * item.product_quantity);

            $final('.product-row').last().after(`<tr class="product-row">
                      <td align="left"
                        style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-bottom:40px">
                        <table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none"
                          style="border-collapse:collapse;border-spacing:0px;float:left">
                          <tbody>
                            <tr>
                              <td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:195px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                  style="border-collapse:collapse;border-spacing:0px">
                                  <tbody>
                                    <tr>
                                      <td align="center" style="padding:0;Margin:0;font-size:0px">
                                        <a target="_blank" href=""
                                          style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;text-decoration:underline;color:#67A329;font-size:16px">
                                          <img class="adapt-img p_image"
                                            src="https://drive.google.com/thumbnail?id=1c__dt0jIc7xsRBjr0G0R0j9ie3y9SN47"
                                            alt=""
                                            style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"
                                            width="195">
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none"
                          style="border-collapse:collapse;border-spacing:0px;float:right">
                          <tbody>
                            <tr>
                              <td align="left" style="padding:0;Margin:0;width:345px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td align="left" class="es-m-txt-c"
                                        style="Margin:0;padding-left:20px;padding-right:20px;padding-bottom:25px">
                                        <h3 class="p_name"
                                          style="Margin:0;line-height:36px;font-family:Mitr, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641">${item.product_name}</h3>
                                        <p class="p_size"
                                          style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">
                                          Size: ${item.product_size}</p>
                                        <p class="p_quantity"
                                          style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">
                                          Quantity: ${item.product_quantity}</p>
                                        <h3 class="p_price"
                                          style="Margin:0;line-height:36px;font-family:Mitr, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641">$${(item.product_price * item.product_quantity).toFixed(2)}</h3>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>`);
          }

        })


        $final('.order-total').html(`$${subtotal.toFixed(2)}<br>$${parseFloat(checkoutData.discount).toFixed(2)}<br>$00.00`);
        $final('.total-price').text(`$${(subtotal- checkoutData.discount).toFixed(2)}`);

        const modifiedHtmlString = $final.html();

        const mailOptions = {
          from: process.env.EMAIL_TEMP,
          to: process.env.EMAIL_TEMP,
          subject: 'Order received',
          html: modifiedHtmlString
        };

        setTimeout(() => {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }, 5000)

      })
    })
    .then(() => {
        req.session.checkout = null;
        req.session.emailData = null;
        req.session.save();
        setTimeout(() => {
          res.redirect('/index');
        }, 1000)

      })

  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});


app.post('/applyCoupon', upload.none(), (req, res) => {

  let { code, quantity, productCount, name, total } = req.body;

  console.log(code, quantity, productCount, name, total);

  const currentDate = new Date();
  const formattedDateTime = currentDate.toISOString();

  const db = dbService.getDbServiceInstance();

  if (code && quantity && productCount && name && total) {

    db.getCoupon(code)
      .then(data => {
        console.log(data);

        if (data) {
          
          let restricted = false;

          const splitProducts = data.product_restrictions.split('/');

          console.log("206", splitProducts);

          for (let i = 0; i < name.length; i++) {
            if (splitProducts.includes(name[i]))
              restricted = true;
          }

          console.log(restricted);

          if (data.redemption_status === 'Used') {
            res.status(404).json("Invalid coupon code!");
            return;
          }

          if ((data.maximum_uses - data.amount_used) <= 0) {
            res.status(404).json("Invalid coupon code!");
            return;
          }

          if (data.maximum_order_amount <= productCount && data.maximum_order_amount <= quantity) {
            res.status(404).json("Invalid coupon code!");
            return;
          }

          if (formattedDateTime >= data.expiration_date.toISOString()) {
            res.status(404).json("Invalid coupon code!");
            return;
          }

          if (restricted) {
            res.status(404).json("Invalid coupon code!");
            return;
          }

          req.session.cart = req.session.cart || [];
          req.session.discount = data.discount_amount;
          console.log(req.session.discount);
          req.session.save(session.discount);

          let discountPrice = 0;

          if (data.discount_amount.includes('%')) {
            console.log("percent")
            let temp = 0;
            let percentValue = parseFloat(data.discount_amount.match(/\d+/)[0])
            temp = total;
            total = total * (1 - (percentValue / 100));
            temp -= total;
            discountPrice = temp;
            console.log("test1", total);
            const finalData = {discount: discountPrice, total: total};
            res.json(finalData)
          } else {
            let temp = 0;
            total = total - data.discount_amount;
            temp -= total;
            discountPrice = temp;
            console.log("test2", total);
            const finalData = {discount: discountPrice, total: total};
            res.json(finalData)
          }

        } else {
          res.status(404).json("Invalid coupon code!");
            return;
        }

      })
      .catch(err => console.log(err))
  }
})

app.post('/proceed-to-checkout', upload.none(), (req, res) => {

  const checkoutData = req.body;

  console.log(checkoutData, "192");

  const productData = [];

  let totalQuantity = 0;
  let totalPrice = 0;
  let totalDiscount = 0;
  let itemNames = "";

  checkoutData.forEach((item, index) => {
    if (index > 0) {
      productData.push(item);
      totalQuantity += +item.quantity;
      itemNames += item.product_name + `(${item.size_value})` + `x${item.quantity}` + '/'
    }
  })

  console.log(totalQuantity);

  const db = dbService.getDbServiceInstance();

  const items = [];

  console.log("671 ", req.session);

  const productEmailData = [];

  try {
    db.getCheckoutProducts(productData)
      .then(async data => {
        data.forEach((item, index) => {
          let price = 0;

          if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
            price = item.product_price_reduced;
            totalPrice += +(item.product_price_reduced * item.quantity);
          } else {
            price = item.product_price;
            totalPrice += +(item.product_price * item.quantity);
          }

          let discount = req.session.discount;

          productEmailData.push({ product_name: item.product_name, product_size: item.size_value, product_price: price, product_quantity: item.quantity, product_image: item.image_url });

          console.log(discount);
          if (discount) {
            if (discount.includes('%')) {
              let percentValue = parseFloat(discount.match(/\d+/)[0])
              let discountPrice = price;

              price = price * (1 - (percentValue / 100));
              discountPrice -= price;
              totalDiscount += + discountPrice * item.quantity;
              totalPrice -= discountPrice * item.quantity;
              console.log("test1", price);
            } else {
              let discountPrice = price;
              price = price - (discount / totalQuantity);
              discountPrice -= price;
              totalDiscount += + discountPrice * item.quantity;
              totalPrice -= discountPrice * item.quantity;
              console.log("test2", price);
            }

          }

          items.push({
            price_data: {
              currency: "eur",
              product_data: {
                name: item.product_name,
                images: [`http://localhost:3001/${item.image_url}`],
              },
              unit_amount: Math.round(price * 100), // Use unit_amount instead of price
            },
            quantity: item.quantity
          });

        })

        console.log(items, "225")

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
        console.log(formattedDate);

        req.session.checkout = req.session.checkout || [];
        req.session.checkout = { data: checkoutData[0], date: formattedDate, items: itemNames, price: totalPrice }
        req.session.save(async (err) => {
          if (err) {
            console.error('Session save error:', err);
          }
          // Confirm that session has been saved
          console.log('Session saved successfully:', req.session.checkout);
          console.log("690 ", req.session.checkout);

          const finalData = {
            data: JSON.stringify({
              name: checkoutData[0].name,
              email: checkoutData[0].email,
              address: checkoutData[0].address,
              country: checkoutData[0].country,
              city: checkoutData[0].city,
              postal: checkoutData[0].postal,
              phone: checkoutData[0].phone,
              date: formattedDate,
              items: itemNames,
              price: totalPrice.toFixed(2),
              discount: totalDiscount.toFixed(2)
            })
          }

          productEmailData.forEach((item, index) => {
            finalData[`product${index}`] = JSON.stringify(item);
          })

          console.log("820", finalData);

          // Create the Checkout Session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items,
            mode: "payment",
            payment_intent_data: {
              metadata: finalData

            },
            success_url: "http://localhost:3001/index",
            cancel_url: "http://localhost:3001/index"
          });

          req.session.checkout = req.session.checkout || [];
          req.session.checkout = null;
          req.session.save();

          res.json({ id: session.id });

        });

      })

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }

})

app.post("/insertCheckoutData", upload.none(), (req, res) => {

  const checkoutData = req.session.checkout;

  console.log("523, ", req.session)

  try {

    console.log(req.body, "60");

    const { paymentId, method, chargeId } = req.body;

    console.log("526", paymentId, method, chargeId);
    const db = dbService.getDbServiceInstance();

    console.log("530", checkoutData);

    db.insertCheckoutData(checkoutData.data, checkoutData.date, checkoutData.items, checkoutData.price, payment_id, method, charge_id)
      .then(() => {
        console.log("Success!");
        req.session.checkout = null
        req.session.save();

        console.log("542", req.session.checkout);
      })
    res.redirect('/');

  } catch (error) {
    console.log(error);
  }
})

app.get('/getCheckoutData', (req, res) => {

  const data = req.session.checkout;

  console.log("755", data);

  //res.json(data);
})

app.post('/remove-from-cart', upload.none(), (req, res) => {
  const productToRemove = req.body;

  console.log("333", productToRemove);

  if (productToRemove) {

    const cartItemIndex = req.session.cart.findIndex((item) => {

      let temp;

      console.log("341", item);

      item.forEach((element) => {

        console.log("345", element);

        console.log("347", element.quantity, productToRemove[0].product_id);

        if (element.product_id === productToRemove[0].product_id &&
          element.product_name === productToRemove[0].product_name &&
          element.size_value === productToRemove[0].size_value) {
          temp = true;
        } else
          temp = false;

      })
      return temp;
    });

    console.log(cartItemIndex);
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
    res.status(200).json({ message: 'Item added to the cart.' });
  } else if (cartItemIndex !== -1) {
    console.log('Dif quantity');
    console.log(req.session.cart[cartItemIndex][0].quantity, cart[0].quantity);
    req.session.cart[cartItemIndex][0].quantity = cart[0].quantity;
    req.session.save();
    res.status(200).json({ message: 'Item added to the cart.' });;
  } else {
    console.log('Item exists');
    res.status(400).json({ message: 'Item is already in cart.' });
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

app.get('/getCategories', (req, res) => {

  const db = dbService.getDbServiceInstance();

  const categories = db.getCategories();

  categories
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch(err => console.log(err));

})

app.get('/getGalleryData/:name', (req, res) => {

  const name = req.params.name;

  const formatedName = name.split('-').join(' ');
  console.log(formatedName);

  const db = dbService.getDbServiceInstance();

  db.getCategoryData(formatedName)
    .then(data => {
      console.log("509", data);
      if (data) {
        res.json(data);
      } else
        res.render('404notfound.ejs');
    })
    .catch(err => console.log(err))

})


app.get('/getFavourites', (req, res) => {

  const db = dbService.getDbServiceInstance();

  const favourites = db.getCatalogProducts();

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

  const product = db.getProduct(name.replace("-", " "));

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

app.get('/getBlogs', (req, res) => {

  const db = dbService.getDbServiceInstance();

  db.getBlogs()
    .then(data => {
      console.log(data)
      res.json(data);

    })
    .catch(err => console.log(err))
})

app.get('/getBlog/:name', (req, res) => {
  const name = req.params.name;
  console.log(name);

  const db = dbService.getDbServiceInstance();

  db.getSpecificBlog(name)
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log(err))
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
            from: process.env.EMAIL_TEMP,
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
    to: `${process.env.EMAIL_TEMP}`,
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
            from: `${process.env.EMAIL_TEMP}`,
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

        }, index * 6000)

      })

    })
    .catch(err => console.log(err));



});

// Handle Profile picture upload POST request
app.post('/change-profile-pic', upload.single('file'), (req, res) => {

  const db = dbService.getDbServiceInstance();

  if (req.file) {
    const fileName = profilePicDir.substring('public/'.length) + "/" + req.session.passport.user.username + "/" + req.file.originalname;

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

  const db = dbService.getDbServiceInstance();

  db.checkUsername(req.body.username)
    .then(async data => {

      if (data === 'true') {
        res.status(500).send('Username already exists!');
      } else {
        try {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          if (req.body.username && hashedPassword != null) {

            db.registerUser(req.body.username, hashedPassword, token)
              .then(() => {
                res.status(200).send('Success!');
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

      }

    })
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

//Dashboard

app.get('/panel/dashboard', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  db.getDashboardData()
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log(err));
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

app.post('/panel/products/addProductCategory', checkPermission(['Admin', 'Editor']), categoryUpload.single('file'), (req, res) => {

  const { value, header, subheader } = req.body;

  if (req.file) {

    if (value.includes(" ")) {
      console.log("true");
      value.split(" ").join('%20')
      console.log(value);
    }

    const categoryPicDir = 'public/images/categories/' + value;
    const fileName = categoryPicDir.substring('public/'.length) + "/" + req.file.originalname;

    console.log("File name:" + fileName);

    const db = dbService.getDbServiceInstance();

    db.addProductCategory(value, header, subheader, fileName)
      .then(() => {
        console.log("Successfully added product category!");
      })
      .catch((err) => console.log(err));
  }
})

app.post('/panel/products/editProductCategory', checkPermission(['Admin', 'Editor']), categoryUpload.single('file'), (req, res) => {

  const { value, oldValue, id, header, subheader, oldFile } = req.body;

  console.log(value, oldValue, header, id, subheader, oldFile);

  let newValue;

  if (value.includes(" ")) {
    console.log("true");
    newValue = value.replace(/ /g, "%20");
    console.log(newValue);
  } else
    newValue = value;

  let fileName;
  const categoryPicDir = 'public/images/categories/';

  if (req.file) {

    fileName = categoryPicDir.substring('public/'.length) + "/" + newValue + "/" + req.file.originalname;

    const categoryPicPath = "public/images/categories/" + value;

    console.log("Category pic path: " + categoryPicPath);
    fs.unlink(categoryPicPath, (err) => {
      if (err) {
        console.log("Error deleting file: ", err.message);
        return;
      }
      console.log("File deleted successfully!");
    });
  }
  else
    fileName = categoryPicDir.substring('public/'.length) + newValue + oldFile.substring(oldFile.lastIndexOf('/'));

  console.log("File name:" + fileName);

  const db = dbService.getDbServiceInstance();

  db.editProductCategory(id, value, header, subheader, fileName)
    .then(() => {
      console.log("Successfully added product category!");
      if (oldValue !== value) {
        const CategoryPicDirOld = `public/images/categories/${oldValue}/`;
        const CategoryPicDirNew = `public/images/categories/${value}/`;

        fs.rename(CategoryPicDirOld, CategoryPicDirNew, (err) => {
          if (err) {
            console.error(`Error renaming folder: ${err.message}`);
          } else {
            console.log('Folder renamed successfully');
          }
        })

      }
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
  console.log(categories);

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

  console.log("2026", removePicsArray);

  const fileNames = files.map(item => productPicDir.substring('public/'.length) + "/" + title + "/" + item.originalname);

  console.log(fileNames);


  const db = dbService.getDbServiceInstance();
  db.editProduct(id, newTitle, removePicsArray, removePricesData, changedSizesData, newSizesData, oldCategories, categories, description, details, date, author, fileNames)
    .then(() => {
      console.log("Successfully edited product: " + newTitle);

      if (title != newTitle) {

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

      if (removePicsArray[0]) {

        removePicsArray.forEach(item => {

          let finalPath;
          if(item.includes("%20"))
            finalPath = item.replace("%20", " ")
          else
            finalPath = item;

          const productPicDir = `public/${finalPath}`;

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

app.get('/panel/orders', checkPermission(['Admin']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const getOrders = db.getOrders();

  getOrders
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(error => console.log(error))

})

app.post('/panel/orders/insertTrackingId', checkPermission(['Admin']), upload.none(), (req, res) => {
  const { id, status, trackingId } = req.body;

  console.log(id, status, trackingId);

  const db = dbService.getDbServiceInstance();

  db.insertTrackingId(id, status, trackingId)
    .then((data) => {
      console.log(data);

      const mailOptions = {
        from: process.env.EMAIL_TEMP,
        to: process.env.EMAIL_TEMP,
        subject: 'Order sent!',
        text: `
        Thank you for choosing us!
        Your tracking number is: ${trackingId}
        To track your package visit the following link: https://www.dhl.com/ba-en/home/tracking.html`
      };

      setTimeout(() => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json("Success!")
          }
        });
      }, 5000)

    })
    .catch(error => console.log(error))

})

app.get('/panel/orders/initiateRefund/:id', checkPermission(['Admin']), (req, res) => {
  const id = req.params.id;

  const db = dbService.getDbServiceInstance();

  console.log(id);

  const retrieveRefundData = db.getRefundData(id);

  retrieveRefundData
    .then(async (data) => {
      console.log(data);
      if (data.payment_method === 'stripe') {
        console.log(data.payment_method);
        try {
          const refund = await stripe.refunds.create({ charge: data.charge_id });
          console.log('Refund successful:', refund.refunded);
          console.log(refund.status);
          if (refund.status === 'succeeded') {
            db.changeRefundStatus(id)
              .then((data) => {
                const mailOptions = {
                  from: process.env.EMAIL_TEMP,
                  to: process.env.EMAIL_TEMP,
                  subject: 'Order refunded!',
                  text: `
                  Unfortunately we had to refund your order due to technical difficulties!
                  Thank you for choosing us!`
                };
          
                setTimeout(() => {
                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                      res.status(200).json("Success!")
                    }
                  });
                }, 5000)
                res.status(200).json('Success!');
              })
          }
        } catch (error) {
          if (error instanceof stripe.errors.StripeInvalidRequestError && error.message.includes('has already been refunded')) {
            console.log(`Charge ${data.charge_id} has already been refunded.`);
            // Handle the already refunded charge case
          } else {
            console.error('An error occurred:', error);
            // Handle other errors or rethrow them
            throw error;
          }
        }

      } else if (data.payment_method === 'paypal') {
        console.log('paypal');
        const { jsonResponse, httpStatusCode } = await refundOrder(data.charge_id);
        db.changeRefundStatus(id)
          .then((data) => {
            const mailOptions = {
              from: process.env.EMAIL_TEMP,
              to: process.env.EMAIL_TEMP,
              subject: 'Order refunded!',
              text: `
              Unfortunately we had to refund your order due to technical difficulties!
              Thank you for choosing us!`
            };

            setTimeout(() => {
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            }, 5000)
            res.status(httpStatusCode).json(jsonResponse);
          })
      }
    })
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


  const { title, content, date, description } = req.body;
  const picture = req.file;

  console.log(picture);
  console.log(title);
  console.log(content);
  console.log(date);
  console.log(req.session.passport.user.username);
  console.log(req.session.passport.user.picture);

  if (picture) {
    const fileName = blogPicDir.substring('public/'.length) + "/" + title + "/" + req.file.originalname;
    const db = dbService.getDbServiceInstance();
    console.log(fileName);

    db.createBlog(title, content, req.session.passport.user.username, fileName, date, req.session.passport.user.picture, description)
      .then(() => {
        console.log("Successfully created blog!");
      })
      .catch((err) => console.log(err));
  }

})

app.post('/panel/blog/editBlog', checkPermission(['Admin', 'Editor']), blogUpload.single('file'), (req, res) => {

  const { title, oldTitle, id, content, date, description } = req.body;

  const picture = req.file;

  let fileName;

  console.log(id);

  if (picture)
    fileName = blogPicDir.substring('public/'.length) + "/" + title + "/" + req.file.originalname;

  const db = dbService.getDbServiceInstance();

  db.editBlog(id, title, content, req.session.passport.user.username, date, req.session.passport.user.picture, fileName, description)
    .then((data) => {

      const blogPicDir = `public/${data.image_url}`;

      if (fileName !== undefined && fileName !== data.image_url) {

        fs.unlink(blogPicDir, (err) => {
          if (err) {
            console.error(`Error deleting file: ${err.message}`);
          } else {
            console.log('File deleted successfully');
          }
        })
      }

      if (oldTitle !== title) {
        const blogDirOld = `public/images/blog/${oldTitle}/`;
        const blogPicDirNew = `public/images/blog/${title}/`;

        fs.rename(blogDirOld, blogPicDirNew, (err) => {
          if (err) {
            console.error(`Error renaming folder: ${err.message}`);
          } else {
            console.log('Folder renamed successfully');
          }
        })
      }
      res.status(200).json("Success!");
    })
    .catch((err) => console.log(err));

})

app.get('/panel/blog/removeBlog/:id', checkPermission('Admin'), (req, res) => {
  const blogId = req.params.id;

  console.log("TEST", blogId)

  const db = dbService.getDbServiceInstance();

  db.removeBlog(blogId)
    .then((data) => {
      const blogPicDir = `public/images/blog/${data.title}`;

      console.log(data.title);

      fs.rm(blogPicDir, { recursive: true }, (err) => {
        if (err) {
          console.error(`Error deleting folder: ${err.message}`);
        } else {
          console.log('Folder deleted successfully');
        }
      })

      console.log("Successfully deleted product: " + blogId);

      res.status(200).send("Product deleted successfully!");
    })
    .catch(err => console.log(err))
})


app.get('/panel/newsletter', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const getAccounts = db.getAccountData();

  console.log("Have access!")

})

app.get('/panel/coupon', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const coupons = db.getCoupons();

  coupons
    .then(data => {
      console.log(data)
      res.json(data)
    })
    .catch(err => console.log(err))
})

app.get('/panel/coupon/getProductNames', checkPermission(['Admin', 'Editor']), (req, res) => {

  const db = dbService.getDbServiceInstance();

  const productNames = db.getProductNames();

  productNames
    .then(data => {
      console.log(data)
      res.json(data)
    })
    .catch(err => console.log(err))
})

app.post('/panel/coupon/createCoupon', checkPermission(['Admin', 'Editor']), upload.none(), (req, res) => {

  const { code, discount, uses, orderAmount, expDate, excluded } = req.body;

  console.log(code, discount, uses, orderAmount, expDate, excluded);

  let excludedString;

  if (excluded) {
    excludedString = excluded.join('/');
  }


  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
  console.log(formattedDate);

  console.log(excludedString);

  const db = dbService.getDbServiceInstance();

  db.createCoupon(code, discount, uses, orderAmount, formattedDate, expDate, excludedString)
    .then(() => {
      console.log("success");
      res.status(200).json("Success");
    })
    .catch(err => console.log(err))
})

app.post('/panel/coupon/editCoupon', checkPermission(['Admin', 'Editor']), upload.none(), (req, res) => {

  const { id, code, discount, uses, orderAmount, expDate, excluded } = req.body;

  console.log(id, code, discount, uses, orderAmount, expDate, excluded.length);

  let excludedString;

  if (excluded && Array.isArray(excluded)) {
    excludedString = excluded.join('/');
  } else
    excludedString = excluded;

  console.log(excludedString);

  const db = dbService.getDbServiceInstance();

  db.editCoupon(id, code, discount, uses, orderAmount, expDate, excludedString)
    .then(() => {
      console.log("success");
      res.status(200).json("Success");
    })
    .catch(err => console.log(err))
})

app.get('/panel/coupon/removeCoupon/:id', checkPermission(['Admin', 'Editor']), (req, res) => {

  const id = req.params.id;

  console.log(id);

  const db = dbService.getDbServiceInstance();

  db.removeCoupon(id)
    .then(() => {
      res.status(200).json("Success");

    })
    .catch(err => console.log(err))

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
          from: process.env.EMAIL_TEMP,
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
            res.status(500).send("Error sending email");
          } else {
            console.log(info);
            res.status(200).send("Email sent successfully");
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
            from: process.env.EMAIL_TEMP,
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
              console.log(info.response);
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
