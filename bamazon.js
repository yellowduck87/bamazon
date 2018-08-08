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
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        start();
    })
}
createTable()

function start() {

    inquirer.prompt([{
        name: "addToCart",
        message: "Type the ID number of the item you would like to add to the cart"
    }, {
        name: "quantity",
        message: "How many would you like to purchase? (Type Q to quit)"
    }, ]).then(function (answer) {
        var selectQuant = answer.quantity;
        var selectItem = answer.addToCart;
        connection.query("SELECT * FROM products WHERE item_id =?", [selectItem], function (err, res) {
            if (err) throw err;
            if(answer.quantity || answer.addToCart === "Q"){
                console.log("Thanks for shopping at Bamazon!")
                connection.end()
            }
            else if (selectQuant < res[0].stock) {
                var newStock = res[0].stock -= selectQuant;
                purchaseTotal += (res[0].price * selectQuant)
                console.log("You have purcahsed", selectQuant, res[0].product_name);
                console.log("So Far, you have spent $"+ purchaseTotal, "in total.")

                connection.query('UPDATE products SET stock = ? WHERE item_id = ?', [newStock, selectItem], function (err, res) {
                        if (err) throw err;
                    }),

                    inquirer.prompt({
                        type: 'confirm',
                        name: "continue",
                        message: "Would you like to add another item to your cart?"
                    }).then(function (answer) {
                        if (answer.continue === true) {
                            createTable();
                            // console.log(table.toString())
                        } else {

                            console.log("Your total cost for the goods in your shoppng cart comes to:")
                            console.log("$" + purchaseTotal)
                            console.log("Thanks for stopping by!")
                            connection.end();
                        }
                    })
            } else {
                console.log("There is not enough stock on hand to add to your cart.");
                inquirer.prompt({
                    type: 'confirm',
                    name: "continue",
                    message: "Would you like to add a different item to your cart?"
                }).then(function (answer) {
                    if (answer.continue === true) {
                        createTable();
                    } else {

                        console.log("Thanks for stopping by!")
                        connection.end();
                    }
                })
            }
        })
    })
}
