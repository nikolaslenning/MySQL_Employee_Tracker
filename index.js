const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const password = require('./password');


var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: password,
    database: "employeeDB"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});