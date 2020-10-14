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
                "Update Employee Role",
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

                case "Update Employee Role":
                    updateRoles();
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
            connection.query("INSERT INTO office set ?", { department: answer.department }, function (err) {
                if (err) throw err;
                console.log(
                    `${answer.department} Created Successfully!`
                );
                runSearch();
            });
        });
}

function addRole() {
    connection.query("SELECT * FROM office", function (err, results) {
        if (err) throw err;
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
            },
            {
                name: "departmentID",
                type: "rawlist",
                message: "What department does this role fall under?",
                choices: function () {
                    var deptArray = [];
                    results.forEach((entry) => {
                        let name = entry.department;
                        let value = entry.id;
                        deptArray.push({ name, value });
                    })
                    return deptArray;
                }

            }])
            .then(function (answer) {
                connection.query("SELECT * FROM role", function (error, response) {
                    if (error) {
                        console.log("error");
                        console.log(error);
                    } else {
                        var shouldCreate = true;
                        for (var i = 0; i < response.length; i++) {
                            var currentRole = response[i];
                            if (answer.role === currentRole.title) {
                                console.log(`${answer.role} already exists`)
                                shouldCreate = false;
                                runSearch();
                                break;
                            }
                        }
                        if (shouldCreate) {
                            connection.query("INSERT INTO role set ? ",
                                {
                                    title: answer.role,
                                    salary: answer.salary,
                                    department_id: answer.departmentID
                                },
                                function (err) {
                                    if (err) throw err;
                                    console.log(
                                        `${answer.role} Created Successfully!`
                                    );
                                    runSearch();
                                });
                        }
                    }
                })
            });
    });
}

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        connection.query("SELECT * FROM employee", function (error, empResult) {
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
                            results.forEach((entry) => {
                                let name = entry.title;
                                let value = entry.id;
                                choiceArray.push({ name, value });
                            })
                            return choiceArray;
                        }
                    },
                    {
                        name: "managerID",
                        type: "rawlist",
                        message: "What is the employee's Manager?",
                        choices: function () {
                            var choiceArray = [];
                            empResult.forEach((entry) => {
                                let name = (entry.first_name + " " + entry.last_name);
                                let value = entry.id;
                                choiceArray.push({ name, value });
                            })
                            let name = 'None';
                            let value = 0;
                            choiceArray.push({ name, value });
                            return choiceArray;
                        }
                    }
                ])
                .then(function (answer) {
                    if (answer.managerID === 0) {
                        answer.managerID = null;
                    }
                    connection.query("INSERT INTO employee set ?",
                        {
                            first_name: answer.firstName,
                            last_name: answer.lastName,
                            role_id: answer.empRole,
                            manager_id: answer.managerID
                        },
                        function (err) {
                            if (err) throw err;
                            console.log(
                                `${answer.firstName} ${answer.lastName} Created Successfully!`
                            );
                            runSearch();
                        });
                });
        })
    })
}


function updateRoles() {
    connection.query("SELECT first_name, last_name, employee.id, title FROM employee JOIN role ON employee.role_id = role.id", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "updateRole",
                    type: "rawlist",
                    message: "Which employee's role would you like to update?",
                    choices: function () {
                        var choiceArray = [];
                        results.forEach((entry) => {
                            let name = (entry.first_name + " " + entry.last_name);
                            let value = entry.id;
                            choiceArray.push({ name, value });
                        })

                        return choiceArray;
                    }
                }
            ])
            .then(function (empAnswer) {
                connection.query("SELECT * FROM role", function (err, results) {
                    if (err) throw err;

                    inquirer
                        .prompt([
                            {
                                name: "newRole",
                                type: "rawlist",
                                message: "Which role would you like change to??",
                                choices: function () {
                                    var choiceArray = [];
                                    results.forEach((entry) => {
                                        let name = entry.title;
                                        let value = entry.id
                                        choiceArray.push({ name, value });
                                    })
                                    return choiceArray;
                                }
                            }
                        ])
                        .then(function (answer) {
                            for (var i = 0; i < results.length; i++) {
                                if (answer.newRole == (results[i].id)) {
                                    connection.query(
                                        "UPDATE employee SET ? WHERE ?",
                                        [
                                            {
                                                role_id: answer.newRole
                                            },
                                            {
                                                id: empAnswer.updateRole
                                            }
                                        ],
                                    )
                                }
                            }
                            runSearch();
                        })

                });
            });
    });
};

function viewDept() {
    connection.query("SELECT * FROM office", function (err, results) {
        if (err) throw err;

        console.table(results);
        runSearch();
    })
}

function viewRoles() {
    connection.query("SELECT role.id, title, salary, department FROM role JOIN office on office.id = role.department_id ORDER BY role.id", function (err, results) {
        if (err) throw err;

        console.table(results);
        runSearch();
    })
}

function viewEmployee() {
    connection.query("SELECT e.id, e.first_name, e.last_name, title, department, salary, CONCAT(man.first_name, ' ', man.last_name)  as 'manager' FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN office ON office.id = role.department_id LEFT JOIN employee man ON man.id = e.manager_id ORDER BY e.id", function (err, results) {
        if (err) throw err;

        console.table(results);
        runSearch();
    })
}
