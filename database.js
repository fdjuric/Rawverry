if(process.env.NODE_ENV !== 'production') {
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
    if(err){
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

async getCategories(){
    try {
        const response = await new Promise((resolve, reject) => {
            const query = `
            SELECT * FROM product_category
            `;

            db.query(query, (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
            })
        })

        return response;
    }catch(error) {
        console.log(error);
    }
}

async insertNewsletter(email){
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "INSERT INTO newsletter (email, date_col) VALUES (?, CURDATE())";

            db.query(query, [email], (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
                console.log("The mail is added succesfully.");
            }) 
        });
    } catch(error) {
        console.log(error);
    }
}
}

module.exports = dbService;
