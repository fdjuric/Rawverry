if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();

}

const { exec } = require('child_process');

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

            createBackup();

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

    async getProducts() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT Product.product_id, Product.product_name, Product.product_price, Product.product_amount_bought_total, Product.product_price_reduced, Product.in_stock, Product.description, Product.details, Product.date_col, Product_images.image_url
                FROM Product
                LEFT JOIN Product_Images ON Product.product_id = Product_Images.product_id
                `;

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

    async getSpecificProduct(id) {
        try{
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product WHERE product_id = ?`;

                db.query(query, [id], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const response1 = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_images WHERE product_id = ?`;

                db.query(query, [id], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const response2 = await new Promise((resolve, reject) => {
                const query = `SELECT product_category_link.*, product_category.*
                FROM product_category_link
                JOIN product_category ON product_category_link.category_id = product_category.category_id
                WHERE product_category_link.product_id = ?;
                `;

                db.query(query, [id], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const response3 = await new Promise((resolve, reject) => {
                const query = `SELECT product_size_link.*, product_size.*
                FROM product_size_link
                JOIN product_size ON product_size_link.size_id = product_size.size_id
                WHERE product_size_link.product_id = ?;`;

                db.query(query, [id], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const AllData = [];

            AllData.push(response);
            AllData.push(response1);
            AllData.push(response2);
            AllData.push(response3);
            

            return AllData;
        }catch(error) {
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

            console.log([category]);
            console.log('Hello: ' + category);

            let promises1;

            if (Array.isArray(category)) {

                promises1 = category.map(item => {
                    return new Promise((resolve, reject) => {
                        const query = 'SELECT category_id FROM product_category WHERE category_name = ?';

                        db.query(query, [item], (err, results) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                if (results.length > 0) {
                                    const categoryIds = results.map(result => result.category_id);
                                    resolve(categoryIds);
                                } else {
                                    // Handle case where no results were found for the item
                                    resolve(null);
                                }
                            }
                        });
                    });
                });

            } else {
                promises1 = new Promise((resolve, reject) => {
                    const query = 'SELECT category_id FROM product_category WHERE category_name = ?';

                    db.query(query, [category], (err, results) => {
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

                })
            }

            let response3;

            if (Array.isArray(promises1)) {
                response3 = await Promise.all(promises1);
            } else {
                response3 = [await promises1];
            }

            let promises2;

            if (Array.isArray(size)) {

                promises2 = size.map(item => {
                    return new Promise((resolve, reject) => {
                        const query = 'SELECT size_id FROM product_size WHERE size_value = ?';

                        db.query(query, [item], (err, results) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                if (results.length > 0) {
                                    const sizeIds = results.map(result => result.size_id);
                                    resolve(sizeIds);
                                } else {
                                    // Handle case where no results were found for the item
                                    resolve(null);
                                }
                            }
                        });
                    });
                });


            } else {
                promises2 = new Promise((resolve, reject) => {
                    const query = 'SELECT size_id FROM product_size WHERE size_value = ?';

                    db.query(query, [size], (err, results) => {
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

            }

            let response4;

            if (Array.isArray(promises2)) {
                response4 = await Promise.all(promises2);
            } else {
                response4 = [await promises2];
            }

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

    async removeProduct(id){
        try {

            const response1 = await new Promise((resolve, reject) => {
                const query = `DELETE FROM product_images WHERE product_id = ?`

                db.query(query, [id], (err,results) => {

                    if(err) reject(new Error(err.message));

                    resolve(results);
                })
            })

            const response2 = await new Promise((resolve, reject) => {
                const query = `DELETE FROM product_category_link WHERE product_id = ?`

                db.query(query, [id], (err,results) => {

                    if(err) reject(new Error(err.message));

                    resolve(results);
                })
            })

            const response3 = await new Promise((resolve, reject) => {
                const query = `DELETE FROM product_size_link WHERE product_id = ?`

                db.query(query, [id], (err,results) => {

                    if(err) reject(new Error(err.message));

                    resolve(results);
                })
            })

            const response4 = await new Promise((resolve, reject) => {
                const query = `SELECT product_name FROM product WHERE product_id = ?`;

                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));

                    resolve(results);
                });
            });

            const response = await new Promise((resolve, reject) => {
                const query = `DELETE FROM product WHERE product_id = ?`;

                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));

                    resolve(results);
                });
            });

            return response4;
        } catch (error) {
            console.log(error);
        }
    }




    createBackup() {

        const currentDateTime = new Date();

        const path = require('path');

        //const mainFolderPath = path.resolve(__dirname, '..');

        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false, // Use 24-hour format
            timeZone: 'Europe/Paris',
        };

        const formattedDateTime = new Intl.DateTimeFormat('en-GB', options).format(currentDateTime);

        // Replace "/" with "-" to match the desired format
        const customFormat = formattedDateTime.replace(/[/ : ,]/g, '-'); // Replace '/', ':', and ',' with '-'

        const dumpFilePath = path.join(__dirname, 'dumps', `${process.env.DB_NAME}${customFormat}.sql`);

        // Construct the mysqldump command
        const mysqldumpPath = '"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump"'; // Replace with the actual path

        const mysqldumpCommand = `${mysqldumpPath} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${dumpFilePath}`;

        // Execute the mysqldump command
        exec(mysqldumpCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Error during mysqldump:', error.message);
                return;
            }

            if (stderr) {
                console.error('Error during mysqldump (stderr):', stderr);
                return;
            }

            console.log("Success!");
        })
    }
}

module.exports = dbService;
