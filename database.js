if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}

const mysql = require('mysql2');
let instance = null;

//Creating connection for the database

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Connecting to the database 

db.connect((err) => {
    if (err) {
        console.log(err);
    }
    console.log('MySQL database connected!');
})

// Returns a single instance of the Database Service

class dbService {
    static getDbServiceInstance() {
        return instance ? instance : new dbService();
    }

    //MySQL queries

    async getCategories() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `
            SELECT * FROM product_category
            `;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewsletter(email, token) {
        try {
            const response = await new Promise((resolve, reject) => {
                var emailExists = false;
                const queryCheck = `SELECT * FROM newsletter WHERE email = ?`;

                db.query(queryCheck, [email], (err, results) => {

                    if (results.length > 0) {
                        emailExists = true;
                        resolve(emailExists);
                    } else {
                        const queryInsert = "INSERT INTO newsletter (email, date_col, token, isConfirmed) VALUES (?, CURDATE(), ?, ?)";

                        db.query(queryInsert, [email, token, false], (err, results) => {
                            if (err) reject(new Error(err.message));
                            resolve(emailExists);
                            console.log("The mail is added succesfully.");
                        })
                    }
                })
            });

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async confirmNewsletter(token) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE newsletter SET isConfirmed = ? WHERE token = ?`;

                db.query(query, [true, token], (err, results) => {
                    if (err) {
                        console.log(error);
                        reject.status(500).send('Failed to confirm subscription');
                    } else {
                        resolve('Subscription confirmed. Thank you!');
                    }
                })
            });
        } catch (error) {
            console.log(error);
        }
    }

    async unsubscribeNewsletter(token) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `DELETE FROM newsletter WHERE token = ?`;
                console.log(token);
                db.query(query, [token], (err, results) => {
                    if (err) {
                        console.log(error);
                        reject.status(500).send('Failed to unsubscribe');
                    } else {
                        resolve('You unsubscribed!');
                    }
                })
            })
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = dbService;
