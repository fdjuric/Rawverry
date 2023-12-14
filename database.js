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


    async registerUser(username, password, email, token) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO account (user_name, user_password, user_email, token, date_col) VALUES (?, ?, ?, ?, CURDATE())";

                db.query(query, [username, password, email, token], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);

                })
            });
        }catch (error) {
            console.log(error);
        }
    }

    async getUser(username) {
        try {
          const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM account WHERE user_name = ?";
            db.query(query, [username], (err, results) => {
              if (err) reject(new Error(err.message));
              resolve(results[0]);
            });
          });
          return response;
        } catch (error) {
          console.log(error);
        }
      }

      async getAccountEmail(email){

        try {
            const response = await new Promise((resolve, reject) => {
              const query = "SELECT user_email FROM account WHERE user_email = ?";
              db.query(query, [email], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results[0]);
                resolve(results[0]);
              });
            });
            return response;
          } catch (error) {
            console.log(error);
          }

      }

      async getAccountData(){
        try {
            const response = await new Promise ((resolve, reject) => {
                const query = `SELECT id, user_name, user_email, account_role, token FROM account`;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        }catch(error) {
            console.log(error);
        }
      }

      async changePassword(token, password){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE account
                                SET user_password = ?
                                WHERE token = ?`;
                db.query(query, [password, token], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        }catch (error) {
            console.log(error);
        }
      }

      async changeAccountToken(token, email){

        try{
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE account
                                SET token = ?
                                WHERE user_email = ?`;
                db.query(query, [token, email], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        }catch (error) {
            console.log(error);
        }

      }


      async SetPicturePath(path, user) {
        try{
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE account
                                SET picture_path = ?
                                WHERE user_name = ?`;
                db.query(query, [path, user], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        }catch (error) {
            console.log(error);
        }
    }

    async createBlog(title, content, author, picture, author_pic) {
        try {
            const response = await new Promise((resolve, reject) => {

                const query = `INSERT INTO blog (title, content, author, picture_path, author_pic) VALUES (?, ?, ?, ?, ?)`;

                db.query(query, [title, content, author, picture, author_pic], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async editBlog(id, title, content, author) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE blog SET title = ?, content = ?, author = ? WHERE id = ?';
    
                db.query(query, [title, content, author, id], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });
    
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getBlogData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM blog`;

                db.query(query, (err, results) => {
                    if(err) reject(new Error(err.message));

                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async getProductData(){

        try {

            const response1 = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_sizes`;

                db.query(query, (err, results) => {
                    if(err) reject(new Error(err.message));

                    resolve(results);
                    
                });
            });

            const response2 = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_category`;

                db.query(query, (err, results) => {
                    if(err) reject(new Error(err.message));

                    resolve(results);
                    
                });
            });

            const dataArray = {
                sizes: response1, 
                categories: response2
            };

            return dataArray;


        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch product data');
        }
    }

    async getProductSizes(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_sizes`;

                db.query(query, (err, results) => {
                    if(err) reject(new Error(err.message));

                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductSizes(size){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `INSERT INTO product_sizes (size_value) VALUES (?)`;

                db.query(query, [size], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductCategory(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_category`;

                db.query(query, (err, results) => {
                    if(err) reject(new Error(err.message));

                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductCategory(category){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `INSERT INTO product_category (category_name) VALUES (?)`;

                db.query(query, [category], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    

}

module.exports = dbService;
