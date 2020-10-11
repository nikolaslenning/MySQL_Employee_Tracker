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

connection.connect(function (err) {
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
                "Add Department",
                "Add Role",
                "Add Employee",
                "View Departments",
                "View Roles",
                "View All Employees",
                "Update Employees Roles",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add Department":
                    addDept();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "View Departments":
                    viewDept();
                    break;

                case "View Roles":
                    viewRoles();
                    break;

                case "View All Employees":
                    viewEmployee();
                    break;

                case "Update Employee Roles":
                    // updateRoles();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function addDept() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What department would you like to add?"
        })
        .then(function (answer) {
            console.log(answer.department);
            connection.query("INSERT INTO department set ?", { name: answer.department }, function (err) {
                if (err) throw err;
                console.log(
                    "Department Created Successfully!"
                );
                runSearch();
            });
        });
}

function addRole() {
    inquirer
        .prompt([{
            name: "role",
            type: "input",
            message: "What role would you like to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }])
        .then(function (answer) {
            console.log(answer.role);
            connection.query("SELECT * FROM role", function (error, response) {
                if (error) {
                    console.log("error");
                    console.log(error);
                } else {
                    var shouldCreate = true;
                    for (var i = 0; i < response.length; i++) {
                        var currentRole = response[i];
                        if (answer.role === currentRole.title) {
                            console.log("Role already exists")
                            shouldCreate = false;
                            runSearch();
                            break;
                        }
                    }
                    if (shouldCreate) {
                        connection.query("INSERT INTO role set ?",
                            {
                                title: answer.role,
                                salary: answer.salary
                            },
                            function (err) {
                                if (err) throw err;
                                console.log(
                                    "Role Created Successfully!"
                                );
                                runSearch();
                            });
                    }
                }
            })
        });
}

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the employee's first Name?"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the employee's last name?"

                },
                {
                    name: "empRole",
                    type: "rawlist",
                    message: "What is the employee's role?",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    }
                }
            ])
            .then(function (answer) {
                console.log(answer.firstName);
                console.log(answer.lastName);
                connection.query("INSERT INTO employee set ?",
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(
                            "Role Created Successfully!"
                        );
                        runSearch();
                    });
            });
    })
}

function viewDept() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
       
        console.table(results);
        runSearch();
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
       
        console.table(results);
        runSearch();
    })
}

// function viewEmployee() {
//     connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee, department, role WHERE employee.role_id = role.id", function (err, results) {
//         if (err) throw err;
       
//         console.table(results);
//         runSearch();
//     })
// }
function viewEmployee() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary FROM employee, department, role WHERE employee.role_id = role.id", function (err, results) {
        if (err) throw err;
       
        console.table(results);
        console.log(results);
        runSearch();
    })
}