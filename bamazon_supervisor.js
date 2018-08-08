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
    start()
})





function start() {
    inquirer.prompt({
        type: "list",
        name: "list",
        message: "Pick an option:",
        choices: ["View product sales by department", "Create new department", "Quit\n"]
    }).then(function (answer) {
        if (answer.list === "View product sales by department") {
            createTable();
        } else if (answer.list === "Create new department") {
            createNewDept()
        } else {
            console.log("Thanks for using the Bamazon Supervisor App.")
            connection.end();
        }
    })
}


function createTable() {
    var table = new Table({
        head: ['Dept ID', 'Dept Name', 'Overhead', "Total Sales", "Total Profit"],
    });
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var profit = (res[i].sales - res[i].overhead)
            table.push(
                [res[i].dept_id, res[i].dept_name, res[i].overhead, res[i].sales, profit])
        }
        console.log(table.toString());
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        start();
    })
}

function createNewDept() {
    inquirer.prompt([{
        name: "dept_name",
        message: "What is the name of the Department you wish to add?"
    }, {
        name: "overhead",
        message: "What is the total overhead cost for the new department?"
    }]).then(function (answer) {
        overInt = parseInt(answer.overhead)
        profit = 0 - overInt
        connection.query("INSERT INTO departments SET ?", [{
            dept_name: answer.dept_name,
            overhead: answer.overhead,
        }], function (err, res) {
            if (err) throw err;
            console.log("You have added", answer.dept_name, "to your departments.\n")
            start();
        })
    })

}