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
var table = new Table({
    head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],
});

var cartTable = new Table({
    head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],

})

var purchaseTotal = 0;

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

    })
}


function start() {
    createTable();

    inquirer.prompt([{
        name: "addToCart",
        message: "Type the ID number of the item you would like to add to the cart"
    }, {
        name: "quantity",
        message: "How many would you like to purchase?"
    }, ]).then(function (answer) {
        var selectQuant = answer.quantity;
        var selectItem = answer.addToCart;
        connection.query("SELECT * FROM products WHERE item_id =?", [selectItem], function (err, res) {
            if (err) throw err;
            if (selectQuant < res[0].stock) {
                var newStock = res[0].stock -= selectQuant;
                purchaseTotal += (res[0].price * selectQuant)
                console.log("total:", purchaseTotal)
                console.log("You have added", res[0].product_name, "to your cart");
                // connection.query('INSERT INTO shoping_cart (item_id, product_name, department_name, price, stock) VALUES =?', (res[0].item_id, res[0].product_name, res[0].department_name, res[0].price, selectQuant), function (err, res) {
                //     if (err) throw err;
                //     console.log(res)

                // });
                connection.query('UPDATE products SET stock = ? WHERE item_id = ?', [newStock, selectItem], function (err, res) {
                        if (err) throw err;
                    }),

                    inquirer.prompt({
                        type: 'confirm',
                        name: "continue",
                        message: "Would you like to add another item to your cart?"
                    }).then(function (answer) {
                        if (answer.continue === true) {
                            start();
                            table
                            console.log(table.toString())
                        } else {
                            // if (parseInt(purchaseTotal) != 0) {
                            //     connection.query('SELECT * FROM shopping_cart', function (err, res) {
                            //         if (err) throw err;
                            //         for (var i = 0; i < res.length; i++) {
                            //             cartTable.push(
                            //                 [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock]
                            //             )
                            //         }
                            //         console.log(cartTable.toString())
                            //         Console.log("Your total cost for the above goods comes to:")
                            //         console.log("$", purchaseTotal)
                            //         console.log("Thanks for stopping by!")
                            //         // connection.end();
                            //     })
                            // }
                            console.log("Your total cost for the goods in your shoppng cart comes to:")
                            console.log("$", purchaseTotal)
                            console.log("Thanks for stopping by!")
                            connection.end();
                        }
                        // else {
                        //     console.log("Thanks for stopping by!")
                        //     // connection.end();
                        // }
                    })
            } else {
                console.log("There is not enough stock on hand to add to your cart.");
                inquirer.prompt({
                    type: 'confirm',
                    name: "continue",
                    message: "Would you like to add a different item to your cart?"
                }).then(function (answer) {
                    if (answer.continue === true) {
                        start();
                    } else {

                        console.log("Thanks for stopping by!")
                        // connection.end();
                    }
                })
            }
        })
    })
}