DROP DATABASE if EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(10,2),
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Hairbrush', 'beauty', 10.50, 25), ('White Shirt', 'clothing', 5.00, 50),('Black Shirt', 'clothing', 6.40, 50), ('Laptop', 'computers', 505.99, 10), ('Blanket', 'home', 98.98, 45),('Dry Dog Food', 'pets', 10.33, 145), ('Canned Dog Food', 'pets', 15.25, 106), ('iPhone XXY', 'smartphones', 1900.78, 1000), ('Loaf of Bread', 'food', 2.65, 98), ('5 Minute Princess Stories', 'books', 12.99, 38);