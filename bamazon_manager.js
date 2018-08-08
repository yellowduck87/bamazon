// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

var mysql = require("mysql");
var inquirer = require("inquirer");

var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Bbtmwntfc69",
    database: "bamazon_db"
})

connection.connect(function (err) {
    console.log("Connected as id:", connection.threadId);
    start();
})



function start() {
    inquirer.prompt({
        type: "list",
        name: "list",
        message: "Choose an option:",
        choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function (answer) {
        if (answer.list === "View Products For Sale") {
            createTable();
        } else if (answer.list === "View Low Inventory") {
            viewInventory();
        } else if (answer.list === "Add to Inventory") {
            addInventory();
        } else if (answer.list === "Add New Product") {
            addProduct();
        }
    })
}

function createTable() {
    var table = new Table({
        head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],
    });
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock],
            );
        }
        console.log(table.toString());
        start();
    })
}




function viewInventory() {
    var table = new Table({
        head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],
    });
    connection.query("SELECT * FROM products WHERE stock < 5", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock],
            );
        }
        console.log(table.toString());
        start();
    })

}


function addInventory() {
    inquirer.prompt([{
        name: "item_id",
        message: "To which item (by ID) would you like to add stock?"
    }, {
        name: "stock",
        message: "How much stock would you like to add?"
    }]).then(function (answer) {
        connection.query("UPDATE products SET ? WHERE ?", [{
            stock = answer.stock,
        }, {
            item_id = answer.item_id
        }], function (err, res) {
            if (err) throw err;
            console.log("You have updated the stock quanitity of item number", answer.item_id);
            console.log(res);
            start();

        })
    })

}


function addProduct() {
    inquirer.prompt([{
        name: "item_id",
        message: "What item would you like to add?"
    }, {
        name: "department",
        message: "What department is the item in?"
    }, {
        name: "price",
        message: "What is the price of the item"
    }, {
        name: "stock",
        message: "How much inventory do you have?"
    }]).then(function (answer) {
        connection.query("INSERT INTO products (item_id, department_name, price, stock VALUE = ?", [(answer.item_id, answer.department, answer.price, answer.stock)], function (err, res) {
            if (err) throw err;
            console.log("Item successfuly added to inventory");
            console.log(res)
            start();
        })
    })
}