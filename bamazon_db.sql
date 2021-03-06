CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price INTEGER(10) NOT NULL,
    stock INTEGER(10),
    PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock)
VALUES 
("Fedora", "Clothing", 25, 100), 
("Screwdriver", "Hardware", 5, 300), 
("Castle Cat Tower", "Pets", 55, 10), 
("Dog Bowl", "Pets", 10, 200), 
("Leather Belt", "Clothing", 30, 50), 
("Chainsaw", "Hardware", 150, 20), 
("Laptop Computer", "Electronics", 300, 5), 
("Flatscreen TV", "Electronics", 1000, 30), 
("Women's Jeans", "Clothing", 50, 20),
("Diamond Cat Collar", "Pets", 2000, 1),
("Backhoe", "Hardware", 50000, 4), 
("Antique Cassette Player", "Electronics", 1, 2);


CREATE TABLE departments (
    dept_id INTEGER NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(50) NOT NULL,
    overhead INTEGER(10),
    sales INTEGER(10) default 0,
    PRIMARY KEY(dept_id)
);

INSERT INTO departments (dept_name, overhead)
VALUEs ("Clothing", 1000), ("Hardware", 10500), ("Electronics", 2000), ("Pets", 500), ("Sports", 3000);