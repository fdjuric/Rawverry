if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();

}

const { exec } = require('child_process');
const fs = require('fs');

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

    async getNewsletterEmails() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT email FROM newsletter WHERE isConfirmed = 1`;

                db.query(query, (err, results) => {
                    if (err) {
                        console.log(error);
                        reject.status(500).send("Failed to get Newsletters");
                    } else {
                        resolve(results);
                    }

                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }


    async registerUser(username, password, token) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE account SET user_name = ?, user_password = ? WHERE token = ?";

                db.query(query, [username, password, token], (err, results) => {
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
                const query = `SELECT id, user_name, user_email, account_role, picture_path,  DATE_FORMAT(Account.date_col, '%d.%m.%Y') AS date_col FROM account`;

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

    async getAccountRoles() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT DISTINCT
                SUBSTRING(COLUMN_TYPE, 6, LENGTH(COLUMN_TYPE) - 6) AS enum_values
                FROM
                information_schema.COLUMNS
                WHERE
                TABLE_NAME = 'account'
                AND COLUMN_NAME = 'account_role'`;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));

                    const enumString = results[0].enum_values;
                    const enumValues = enumString.match(/'([^']+)'/g).map(value => value.slice(1, -1));
                    resolve(enumValues);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getSpecificAccount(id) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT id, user_name, user_email, account_role FROM account WHERE id = ?`;

                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }

    }

    async editAccount(id, username, email, role) {
        try {

            return new Promise((resolve, reject) => {
                const query = `UPDATE account
                SET user_name = ?, user_email = ?, account_role = ?
                WHERE id = ?`

                db.query(query, [username, email, role, id], (err, results) => {
                    if (err) reject(new Error(err.message))

                    console.log("success")
                    console.log(results);
                    resolve();
                })
            })

        } catch (error) {
            console.log(error)
        }

    }

    async removeAccount(id) {
        try {

            const responseEmail = await new Promise((resolve, reject) => {
                const query = `select user_email FROM account WHERE id = ?`;

                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0].user_email);
                });
            })

            const response = await new Promise((resolve, reject) => {
                const query = `DELETE FROM account WHERE id = ?`;

                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve();
                });
            });
            return responseEmail;
        } catch (error) {
            console.log(error);
        }
    }

    async createAccount(email, role, token) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `INSERT INTO account (user_email, account_role, token, date_col) VALUES(?, ?, ?, CURDATE())`


                db.query(query, [email, role, token], (err, results) => {
                    if (err) reject(new Error(err.message))
                    resolve();
                })
            })

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

    async createBlog(title, content, author, picture, date, author_pic) {
        try {
            const response = await new Promise((resolve, reject) => {

                const query = `INSERT INTO blog (title, content, author, created_at, updated_at, image_url, author_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`;

                db.query(query, [title, content, author, date, date, picture, author_pic], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async editBlog(id, title, content, author, date, author_pic) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE blog SET title = ?, content = ?, author = ?, updated_at = ?, author_picture = ? WHERE id = ?';

                db.query(query, [title, content, author, date, author_pic, id], (err, results) => {
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

    async removeBlog(id) {
        try {

            const response = await new Promise((resolve, reject) => {
                const query = `DELETE FROM blog WHERE id = ?`;

                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve();
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
                const query = `SELECT Blog.id, 
                Blog.title, 
                Blog.content, 
                Blog.author, 
                Blog.image_url, 
                Blog.author_picture, 
                DATE_FORMAT(Blog.created_at, '%H:%i:%s %d.%m.%Y') AS created_at,
                DATE_FORMAT(Blog.updated_at, '%H:%i:%s %d.%m.%Y') AS updated_at 
                FROM blog`;

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

    async getFavourites() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT 
                main.product_id, 
                main.product_name, 
                MIN(Product_size_link.product_price) AS product_price,
                main.product_price_reduced, 
                main.in_stock, 
                main.size_id,
                product_size.size_value,
                img1.image_url AS image_url_1,
                img2.image_url AS image_url_2
            FROM (
                SELECT 
                    Product.product_id, 
                    Product.product_name, 
                    Product_size_link.product_price_reduced, 
                    Product.in_stock, 
                    Product_size_link.size_id AS size_id
                FROM Product
                LEFT JOIN Product_size_link ON Product.product_id = Product_size_link.product_id
            ) AS main
            LEFT JOIN (
                SELECT 
                    product_id,
                    product_price,
                    ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY product_price) AS rn
                FROM Product_size_link
            ) AS Product_size_link ON main.product_id = Product_size_link.product_id AND Product_size_link.rn = 1
            LEFT JOIN product_size ON main.size_id = product_size.size_id
            LEFT JOIN (
                SELECT 
                    product_id,
                    image_url
                FROM (
                    SELECT 
                        Product_Images.product_id,
                        Product_Images.image_url,
                        ROW_NUMBER() OVER (PARTITION BY Product_Images.product_id ORDER BY Product_Images.id) AS img_rn
                    FROM Product_Images
                ) AS img_subquery
                WHERE img_rn = 1
            ) AS img1 ON main.product_id = img1.product_id
            LEFT JOIN (
                SELECT 
                    product_id,
                    image_url
                FROM (
                    SELECT 
                        Product_Images.product_id,
                        Product_Images.image_url,
                        ROW_NUMBER() OVER (PARTITION BY Product_Images.product_id ORDER BY Product_Images.id) AS img_rn
                    FROM Product_Images
                ) AS img_subquery
                WHERE img_rn = 2
            ) AS img2 ON main.product_id = img2.product_id
            GROUP BY main.product_id, main.product_name, main.product_price_reduced, main.in_stock, main.size_id, product_size.size_value, img1.image_url, img2.image_url;
            
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

    async removeProductSizes(sizes) {
        try {
            const sizesArray = [];

            if (Array.isArray(sizes)) {
                sizesArray.push(...sizes);
            } else {
                sizesArray.push(sizes);
            }

            console.log(sizesArray);

            const queryProductIds = `SELECT product_id FROM product`;

            const productIds = new Promise((resolve, reject) => {

                db.query(queryProductIds, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })

            })

            const id = await productIds;
            const productId = id.map(ids => ids.product_id);
            console.log(productId);

            await Promise.all(sizesArray.map(async (size) => {
                try {
                    const querySizeIds = `SELECT size_id FROM product_size WHERE size_value = ?`;
                    const queryRemoveProductSize = `DELETE FROM product_size_link WHERE product_id = ? AND size_id = ?`;
                    const queryRemoveSize = `DELETE FROM product_size WHERE size_id = ?`;

                    const sizeId = await new Promise((resolve, reject) => {
                        db.query(querySizeIds, [size], (err, results) => {
                            if (err) reject(new Error(err.message));
                            resolve(results[0].size_id);
                        });
                    });

                    console.log(sizeId);

                    const removeProductSizePromises = productId.map((item) => {
                        return new Promise((resolve, reject) => {
                            db.query(queryRemoveProductSize, [item, sizeId], (err, results) => {
                                if (err) reject(new Error(err.message));
                                console.log("Successfully removed size: " + sizeId + " from product: " + item);
                                resolve();
                            });
                        });
                    });

                    await Promise.all(removeProductSizePromises);

                    await new Promise((resolve, reject) => {
                        db.query(queryRemoveSize, [sizeId], (err, results) => {
                            if (err) reject(new Error(err.message))
                            console.log("Successfully removed size: " + sizeId);
                            resolve();
                        });
                    });

                } catch (error) {
                    console.error(error);
                }
            }))
        } catch (error) {
            console.error(error);
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
                const query = ` SELECT 
                                Product.product_id, 
                                Product.product_name, 
                                Product_size_link.product_price, 
                                Product.product_amount_bought_total, 
                                Product_size_link.product_price_reduced, 
                                Product.in_stock, 
                                Product.description, 
                                Product.details, 
                                DATE_FORMAT(Product.date_col, '%H:%i:%s %d.%m.%Y') AS date_col,
                                DATE_FORMAT(Product.date_edited, '%H:%i:%s %d.%m.%Y') AS date_edited,
                                Product.edited_by, 
                                Product_images.image_url
                                FROM Product
                                LEFT JOIN Product_Images ON Product.product_id = Product_Images.product_id
                                LEFT JOIN Product_size_link ON Product.product_id = Product_size_link.product_id
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

    async removeProductCategories(categories) {
        try {
            const categoriesArray = [];

            if (Array.isArray(categories)) {
                categoriesArray.push(...categories);
            } else {
                categoriesArray.push(categories);
            }

            console.log(categoriesArray);

            const queryProductIds = `SELECT product_id FROM product`;

            const productIds = new Promise((resolve, reject) => {

                db.query(queryProductIds, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })

            })

            const id = await productIds;
            const productId = id.map(ids => ids.product_id);
            console.log(productId);

            await Promise.all(categoriesArray.map(async (category) => {
                try {
                    const queryCategoryIds = `SELECT category_id FROM product_category WHERE category_name = ?`;
                    const queryRemoveProductSize = `DELETE FROM product_category_link WHERE product_id = ? AND category_id = ?`;
                    const queryRemoveSize = `DELETE FROM product_category WHERE category_id = ?`;

                    const categoryId = await new Promise((resolve, reject) => {
                        db.query(queryCategoryIds, [category], (err, results) => {
                            if (err) reject(new Error(err.message));
                            resolve(results[0].category_id);
                        });
                    });

                    console.log(categoryId);

                    const removeProductSizePromises = productId.map((item) => {
                        return new Promise((resolve, reject) => {
                            db.query(queryRemoveProductSize, [item, categoryId], (err, results) => {
                                if (err) reject(new Error(err.message));
                                console.log("Successfully removed category: " + categoryId + " from product: " + item);
                                resolve();
                            });
                        });
                    });

                    await Promise.all(removeProductSizePromises);

                    await new Promise((resolve, reject) => {
                        db.query(queryRemoveSize, [categoryId], (err, results) => {
                            if (err) reject(new Error(err.message))
                            console.log("Successfully removed category: " + categoryId);
                            resolve();
                        });
                    });

                } catch (error) {
                    console.error(error);
                }
            }))
        } catch (error) {
            console.error(error);
        }
    }

    async getCartProducts(data) {
        try {

            const responseData = [];

            await Promise.all(data.map(async (item) => {
                const sizeQuery = 'SELECT size_id FROM product_size WHERE size_value = ?';
                const sizeResults = await new Promise((resolve, reject) => {
                    db.query(sizeQuery, [item.size_value], (err, results) => {
                        if (err) reject(err);
                        resolve(results);
                    });
                });
                
                const sizeId = sizeResults[0].size_id;
    
                const priceQuery = 'SELECT product_price, product_price_reduced FROM product_size_link WHERE product_id = ? AND size_id = ?';
                const priceResults = await new Promise((resolve, reject) => {
                    db.query(priceQuery, [item.id, sizeId], (err, results) => {
                        if (err) reject(err);
                        resolve(results);
                    });
                });
    
                const imageQuery = 'SELECT image_url FROM product_images WHERE product_id = ?';
                const imageResults = await new Promise((resolve, reject) => {
                    db.query(imageQuery, [item.id], (err, results) => {
                        if (err) reject(err);
                        resolve(results);
                    });
                });
    
                responseData.push({
                    product_id: item.id,
                    product_name: item.product_name,
                    quantity: item.quantity,
                    size_value: item.size_value,
                    product_price: priceResults[0].product_price,
                    product_price_reduced: priceResults[0].product_price_reduced,
                    image_url: imageResults[0].image_url
                });
            }));
    
            return responseData;

        } catch (error) {
            console.log(error);
        }
    }

    async getProduct(name) {
        try {

            const id = await new Promise((resolve, reject) => {
                const query = `SELECT product_id FROM product WHERE product_name = ?`

                db.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message))

                    resolve(results[0]);
                })
            })

            const response = await new Promise((resolve, reject) => {
                const query = `SELECT product_id, product_name, description, in_stock, details FROM product WHERE product_id = ?`;

                console.log()

                db.query(query, [id.product_id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const response1 = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_images WHERE product_id = ?`;

                db.query(query, [id.product_id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const response2 = await new Promise((resolve, reject) => {
                const query = `SELECT product_category_link.*, product_category.*
                FROM product_category_link
                JOIN product_category ON product_category_link.category_id = product_category.category_id
                WHERE product_category_link.product_id = ?;
                `;

                db.query(query, [id.product_id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const response3 = await new Promise((resolve, reject) => {
                const query = `SELECT product_size_link.*, product_size.*
                FROM product_size_link
                JOIN product_size ON product_size_link.size_id = product_size.size_id
                WHERE product_size_link.product_id = ?;`;

                db.query(query, [id.product_id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const AllData = [];

            AllData.push(response);
            AllData.push(response1);
            AllData.push(response2);
            AllData.push(response3);


            return AllData;
        } catch (error) {
            console.log(error);
        }
    }

    async getSpecificProduct(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product WHERE product_id = ?`;

                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const response1 = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM product_images WHERE product_id = ?`;

                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
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
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const response3 = await new Promise((resolve, reject) => {
                const query = `SELECT product_size_link.*, product_size.*
                FROM product_size_link
                JOIN product_size ON product_size_link.size_id = product_size.size_id
                WHERE product_size_link.product_id = ?;`;

                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            const AllData = [];

            AllData.push(response);
            AllData.push(response1);
            AllData.push(response2);
            AllData.push(response3);


            return AllData;
        } catch (error) {
            console.log(error);
        }
    }

    async addProduct(title, price, description, details, category, date, author, images) {
        try {

            console.log(price);
            console.log(price[0].price);
            console.log(price[0].priceReduced);

            const response1 = await new Promise((resolve, reject) => {
                const query = `INSERT INTO product (product_name, product_amount_bought_total, description, details, date_col, date_edited, edited_by) VALUES (?, ?, ?, ?, ?, ?, ?)`;

                db.query(query, [title, 0, description, details, date, date, author], (err, results) => {
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

            if (Array.isArray(price)) {

                promises2 = price.map(item => {
                    return new Promise((resolve, reject) => {
                        const query = 'SELECT size_id FROM product_size WHERE size_value = ?';

                        db.query(query, [item.size], (err, results) => {
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

                    db.query(query, [price.size], (err, results) => {
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
                const query2 = `INSERT INTO product_size_link (product_id, size_id, product_price, product_price_reduced) VALUES (?, ?, ?, ?)`;
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

                dataArray.sizes.forEach((item, index) => {

                    db.query(query2, [response2, item, price[index].price, price[index].priceReduced || 0.00], (err, results) => {
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

    async editProduct(id, title, removePics, removePrices, changedSizes, newSizes, oldCategories, categories, description, details, date, author, images) {
        try {

            console.log(newSizes);
            console.log(changedSizes);
            console.log(removePrices);

            const response1 = await new Promise((resolve, reject) => {
                const query = `UPDATE product
                SET product_name = ?, description = ?, details = ?, date_edited = ?, edited_by = ?
                WHERE product_id = ?`;

                db.query(query, [title, description, details, date, author, id], (err, results) => {
                    if (err) reject(new Error(err.message));

                    resolve(results);

                });
            });

            const response2 = await new Promise((resolve, reject) => {

                const removedPricesArray = [];

                const newSizesArray = [];
                const ChangedSizesArray = [];

                const categoriesArray = [];
                const oldCategoriesArray = [];

                if (removePrices != null)
                    removedPricesArray.push(...removePrices);

                if (newSizes != null)
                    newSizesArray.push(...newSizes);
                if (changedSizes != null)
                    ChangedSizesArray.push(...changedSizes);

                categoriesArray.push(...categories);
                oldCategoriesArray.push(...oldCategories);

                const categoriesRemoved = oldCategoriesArray.filter(category => !categoriesArray.includes(category));
                const categoriesAdded = categoriesArray.filter(value => !oldCategoriesArray.includes(value));

                console.log(Array.isArray(categoriesArray));
                console.log(Array.isArray(oldCategoriesArray));
                console.log(categoriesRemoved + " Categories Removed");
                console.log(categoriesAdded + " Categories Added");


                if (removedPricesArray != null) {

                    removedPricesArray.forEach(async (item) => {

                        console.log("RemovedArray ", item);

                        const sizeId = await new Promise((resolve, reject) => {
                            try {
                                const query = `SELECT size_id from product_size WHERE size_value = ?`;
                                db.query(query, [item.size], (err, results) => {
                                    if (err) reject(new Error(err.message))
                                    resolve(results[0].size_id);
                                })
                            } catch (error) {
                                console.error(error);
                            }
                        })

                        console.log(sizeId, " Remove");

                        await new Promise((resolve, reject) => {
                            try {
                                const query = `DELETE FROM product_size_link WHERE product_id = ? AND size_id = ? AND product_price = ? AND product_price_reduced = ?`;

                                db.query(query, [id, sizeId, item.price, item.priceReduced || 0.00], (err, results) => {
                                    if (err) reject(new Error(err.message))
                                    console.log("Successfully removed size: ", item.size);
                                    resolve(results);
                                })
                            } catch (error) {
                                console.error(error);
                            }

                        })

                    })

                }


                if (newSizesArray !== null) {

                    newSizesArray.forEach(async (item) => {
                        console.log("Test ", item);
                        try {
                            const query = `SELECT size_id FROM product_size WHERE size_value = ?`;
                            const query1 = `INSERT INTO product_size_link (product_id, size_id, product_price, product_price_reduced) VALUES (?, ?, ?, ?)`;

                            // Wrap the db.query operation in a promise
                            const sizeId = await new Promise((resolve, reject) => {
                                db.query(query, [item.size], (err, results) => {
                                    if (err) {
                                        reject(new Error(err.message));
                                    } else {
                                        // Check if results array is not empty before accessing its elements
                                        if (results.length > 0) {
                                            resolve(results[0].size_id);
                                        } else {
                                            reject(new Error('No matching size found.'));
                                        }
                                    }
                                });
                            });

                            // Now that sizeId is resolved, you can log it here
                            console.log(sizeId + " SizesAddedId");

                            // Continue with the next query
                            await new Promise((resolve, reject) => {
                                db.query(query1, [id, sizeId, item.price, item.priceReduced || 0.00], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    console.log("Successfully added: " + item);
                                    resolve();
                                });
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    });


                }

                if (ChangedSizesArray !== null) {

                    ChangedSizesArray.forEach(async (item) => {

                        console.log("Changed ", item)

                        try {

                            const query = `SELECT size_id FROM product_size WHERE size_value = ?`
                            const query1 = `UPDATE product_size_link
                            SET product_price = ?, product_price_reduced = ?, size_id = ?
                            WHERE product_id = ? AND id = ?`;


                            const sizeId = await new Promise((resolve, reject) => {
                                db.query(query, [item.size], (err, results) => {
                                    if (err) reject(new Error(err.message))

                                    resolve(results[0].size_id);
                                });

                            })

                            console.log(sizeId + " ID");

                            await new Promise((resolve, reject) => {
                                db.query(query1, [item.price, item.priceReduced || 0.00, sizeId, id, item.id], (err, results) => {
                                    if (err) reject(new Error(err.message))
                                    console.log("Successfuly changed size: " + item.id);
                                    resolve();
                                })
                            })

                        } catch (error) {
                            console.error(error);
                        }

                    })
                }

                if (categoriesAdded !== null) {

                    categoriesAdded.forEach(async (item) => {
                        try {
                            const query = `SELECT category_id FROM product_category WHERE category_name = ?`;
                            const query1 = `INSERT INTO product_category_link (product_id, category_id) VALUES (?, ?)`;

                            // Wrap the db.query operation in a promise
                            const CategoryId = await new Promise((resolve, reject) => {
                                db.query(query, [item], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results[0].category_id);
                                });
                            });

                            console.log(CategoryId + "CategoriesAddedId");

                            // Now that sizeId is resolved, you can proceed with the next query
                            await new Promise((resolve, reject) => {
                                db.query(query1, [id, CategoryId], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    console.log("Successfully added: " + item);
                                    resolve();
                                });
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    });
                }

                if (categoriesRemoved !== null) {



                    categoriesRemoved.forEach(async (item) => {
                        try {
                            const query = `SELECT category_id FROM product_category WHERE category_name = ?`
                            const query1 = `DELETE FROM product_category_link WHERE product_id = ? AND category_id = ?`


                            // Wrap the db.query operation in a promise
                            const CategoryId = await new Promise((resolve, reject) => {
                                db.query(query, [item], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results[0].category_id);
                                });
                            });

                            console.log(CategoryId + "CategoriesRemovedId");

                            // Now that sizeId is resolved, you can proceed with the next query
                            await new Promise((resolve, reject) => {
                                db.query(query1, [id, CategoryId], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    console.log("Successfully added: " + item);
                                    resolve();
                                });
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    });

                }

                const removePicsArray = [];
                if (removePics != null) {
                    if (!Array.isArray(removePics)) {
                        // Check if removePics is not an array and is not undefined before pushing
                        if (removePics !== undefined) {
                            removePicsArray.push(removePics);
                        }
                    } else if (Array.isArray(removePics)) {
                        // Use filter to exclude undefined values when populating the array
                        removePicsArray.push(...removePics.filter(item => item !== undefined));
                    }
                }

                console.log("test12", removePicsArray);

                if (removePicsArray !== null && removePicsArray.length > 0) {

                    removePicsArray.forEach(item => {
                        try {

                            const removeUrl = item.substring("/".length);
                            const query = `DELETE FROM product_images WHERE image_url = ? AND product_id = ?`

                            // Wrap the db.query operation in a promise
                            db.query(query, [removeUrl, id], (err, results) => {
                                if (err) reject(new Error(err.message));
                                resolve();
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    });
                }

                if (images != null) {
                    images.forEach(item => {

                        const query = `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`

                        db.query(query, [id, item], (err, results) => {
                            if (err) reject(new Error(err.message))
                            console.log("Successfully added: " + item);
                        })

                    })
                }

                resolve();

            });

            const renameImageSrc = await new Promise((resolve, reject) => {
                try {

                    const query = `SELECT image_url FROM product_images WHERE product_id = ?`;

                    db.query(query, [id], (err, results) => {
                        if (err) reject(new Error(err.message))

                        resolve(results);
                    })
                } catch (error) {
                    console.error(error);
                }
            })

            //console.log(renameImageSrc[0].image_url);

            const renameImageArray = [];

            renameImageSrc.forEach(item => {
                renameImageArray.push(item.image_url);
            })

            new Promise((resolve, reject) => {
                try {

                    renameImageArray.forEach(item => {
                        const query = `UPDATE product_images SET image_url = ? WHERE product_id = ? AND image_url = ?`;

                        const imageUrl = "images/products/" + title + "/" + item.split('/').pop();

                        console.log(imageUrl);


                        db.query(query, [imageUrl, id, item], (err, results) => {
                            if (err) reject(new Error(err.message))

                            console.log("Changed Picture Path to: " + imageUrl);
                            resolve();
                        })
                    })
                } catch (error) {
                    console.error(error);
                }
            })

            return true;

            //console.log(response2); 

        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch product data');
        }
    }

    async removeProduct(id) {
        try {

            const response1 = await new Promise((resolve, reject) => {
                const query = `DELETE FROM product_images WHERE product_id = ?`

                db.query(query, [id], (err, results) => {

                    if (err) reject(new Error(err.message));

                    resolve(results);
                })
            })

            const response2 = await new Promise((resolve, reject) => {
                const query = `DELETE FROM product_category_link WHERE product_id = ?`

                db.query(query, [id], (err, results) => {

                    if (err) reject(new Error(err.message));

                    resolve(results);
                })
            })

            const response3 = await new Promise((resolve, reject) => {
                const query = `DELETE FROM product_size_link WHERE product_id = ?`

                db.query(query, [id], (err, results) => {

                    if (err) reject(new Error(err.message));

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




    async createBackup() {

        try {

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

            const finalFormat = customFormat.replace(/--/g, '-');

            const dumpFilePath = path.join(__dirname, 'dumps', `${process.env.DB_NAME}${finalFormat}.sql`);

            fs.mkdirSync(path.dirname(dumpFilePath), { recursive: true });

            // Construct the mysqldump command
            const mysqldumpPath = '"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump"'; // Replace with the actual path

            const mysqldumpCommand = `${mysqldumpPath} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${dumpFilePath}`;

            // Execute the mysqldump command

            // return new Promise((resolve, reject) => {
            exec(mysqldumpCommand) /*, (error, stdout, stderr) => {
                if (error) reject(new Error(error.message))
                if (stderr) {
                    console.error('Error during mysqldump (stderr):', stderr);
                    return;
                }

                resolve(dumpFilePath);
    
            }) */
            return dumpFilePath;
            // });

        } catch (error) {
            console.log(error);
        }


    }
}

module.exports = dbService;
