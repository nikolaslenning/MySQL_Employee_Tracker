DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE office(
    id INT NOT NULL AUTO_INCREMENT,
    department VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES office(id)
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id), 
    FOREIGN KEY (manager_id) REFERENCES employee(id) SET NULL,
);

INSERT INTO office (department) VALUES
("Sales"),
("Finance"),
("Janitorial"),
("Engineering");

INSERT INTO role (title, salary, department_id) VALUES
("SalesPerson", 80000, 1),
("Accountant", 120000, 2),
("Janitor", 18000, 3),
("Engineer", 150000, 4);


INSERT INTO employee (first_name, last_name, role_id) VALUES 
("Nik", "Lenning", 4),
("Seth", "Martin", 1),
("Zac", "LaFlour", 3),
('Sydney', "Good", 2);

SELECT * FROM office;
SELECT * FROM role;
SELECT * FROM employee;

SELECT employee.id, employee.first_name, employee.last_name, role.title, office.department, role.salary 
FROM employee, office, role 
LEFT JOIN employee ON employee.role_id = role.id