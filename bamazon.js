var mysql = require("mysql");
var inquirer = require("inquirer");

var Table = require('cli-table');
 
// instantiate
// var table = new Table({
//     head: ['TH 1 label', 'TH 2 label']
//   , colWidths: [100, 200]
// });

// table.push(
//     ['First value', 'Second value']
//   , ['First value', 'Second value']
// );
 
console.log(table.toString());

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
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);


        inquirer.prompt([{
            name: "addToCart",
            message: "Type the ID number of the item you would like to add to the cart"
        }, {
            name: "quantity",
            message: "How many would you like to purchase?"
        }, ]).then(function (answer) {
            if (answer.quanity < res[answer.addToCart]) {
                console.log("You have added", res.item_id, "to your cart");
            }
        })
    });
}