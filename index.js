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
    runSearch();
});

function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Add Departments",
          "Add Roles",
          "Add Employee",
          "Search for a specific song",
          "exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Add Department":
          addDept();
          break;
  
        case "Add Roles":
          addRoles();
          break;
  
        case "Add Employee":
          addEmployee();
          break;
  
        case "View Department":
          viewDept();
          break;

        case "View Roles":
          viewRoles();
          break;

        case "View Employees":
          viewDept();
          break;

        case "Update Employee Roles":
          updateRoles();
          break;
  
        case "exit":
          connection.end();
          break;
        }
      });
  }