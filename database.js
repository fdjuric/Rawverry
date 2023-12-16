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
                    if (err) reject(new Error(err.message));
                    resolve(results);

                })
            });
        } catch (error) {
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

    async getAccountEmail(email) {

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

    async getAccountData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT id, user_name, user_email, account_role, token FROM account`;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async changePassword(token, password) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE account
                                SET user_password = ?
                                WHERE token = ?`;
                db.query(query, [password, token], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    async changeAccountToken(token, email) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE account
                                SET token = ?
                                WHERE user_email = ?`;
                db.query(query, [token, email], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        } catch (error) {
            console.log(error);
        }

    }


    async SetPicturePath(path, user) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE account
                                SET picture_path = ?
                                WHERE user_name = ?`;
                db.query(query, [path, user], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    async createBlog(title, content, author, picture, author_pic) {
        try {
            const response = await new Promise((resolve, reject) => {

                const query = `INSERT INTO blog (title, content, author, picture_path, author_pic) VALUES (?, ?, ?, ?, ?)`;

                db.query(query, [title, content, author, picture, author_pic], (err, results) => {
                    if (err) reject(new Error(err.message));
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

    async getBlogData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM blog`;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));

                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async getProductData() {

        try {

            const response1 = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_size`;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));

                    resolve(results);

                });
            });

            const response2 = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_category`;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));

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

    async getProductSizes() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_size`;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));

                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductSizes(size) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `INSERT INTO product_size (size_value) VALUES (?)`;

                db.query(query, [size], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductCategory() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_category`;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));

                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductCategory(category) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `INSERT INTO product_category (category_name) VALUES (?)`;

                db.query(query, [category], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async addProduct(title, price, description, details, size, category, images) {
        try {

            const response1 = await new Promise((resolve, reject) => {
                const query = `INSERT INTO product (product_name, product_price, description, details) VALUES (?, ?, ?, ?)`;

                db.query(query, [title, price, description, details], (err, results) => {
                    if (err) reject(new Error(err.message));

                    resolve(results);

                });
            });

            const response2 = await new Promise((resolve, reject) => {
                const query = `SELECT product_id FROM product WHERE product_name = ?`;

                db.query(query, [title], (err, results) => {
                    if (err) reject(new Error(err.message));

                    console.log("Product id: " + results[0].product_id);
                    resolve(results[0].product_id);

                });
            });

            const promises1 = category.map(item => {
                return new Promise((resolve, reject) => {
                    const query = `SELECT category_id FROM product_category WHERE category_name = ?`;
            
                    db.query(query, [item], (err, results) => {
                        if (err) {
                            reject(new Error(err.message));
                        } else {
                            if (results.length > 0) {
                                resolve(results[0].category_id);
                            } else {
                                // Handle case where no results were found for the item
                                resolve(null);
                            }
                        }
                    });
                });
            });
            
            const response3 = await Promise.all(promises1);

            const promises2 = size.map(item => {
                return new Promise((resolve, reject) => {
                    const query = `SELECT size_id FROM product_size WHERE size_value = ?`;
            
                    db.query(query, [item], (err, results) => {
                        if (err) {
                            reject(new Error(err.message));
                        } else {
                            if (results.length > 0) {
                                resolve(results[0].size_id);
                            } else {
                                // Handle case where no results were found for the item
                                resolve(null);
                            }
                        }
                    });
                });
            });
            
            const response4 = await Promise.all(promises2);

            console.log(response3);
            console.log(response4);
            console.log("Arrays");
            
            const dataArray = {
                categories: response3,
                sizes: response4
            };

            const response5 = await new Promise((resolve, reject) => {
                const query1 = `INSERT INTO product_category_link (product_id, category_id) VALUES (?, ?)`;
                const query2 = `INSERT INTO product_size_link (product_id, size_id) VALUES (?, ?)`;
                const query3 = `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`;

                const categoryArray = dataArray.categories;
                const sizeArray = dataArray.sizes;

                console.log("TEXT: ");
                console.log(categoryArray);
                console.log(sizeArray);
                console.log(response2);

                dataArray.categories.forEach((item) => {

                    db.query(query1, [response2, item], (err, results) => {
                        if (err) reject(new Error(err.message));

                        resolve(results);

                    });

                })

                dataArray.sizes.forEach((item) => {

                    db.query(query2, [response2, item], (err, results) => {
                        if (err) reject(new Error(err.message));

                        resolve(results);

                    });

                })

                images.forEach((item) => {

                    db.query(query3, [response2, item], (err, results) => {
                        if (err) reject(new Error(err.message));

                        resolve(results);

                    });

                })
            });

 
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch product data');
        }
    }



}

module.exports = dbService;
