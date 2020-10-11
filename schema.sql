DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department(
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
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT INTO department (department) VALUES
("Sales"),
("Finance"),
("Legal"),
("Engineering");

INSERT INTO role (title, salary, department_id) VALUES
("SalesPerson", 80000, 4),
("Accountant", 120000, 3),
("Lawyer", 180000, 2),
("Engineer", 150000, 1);


INSERT INTO employee (first_name, last_name, role_id) VALUES 
("Nik", "Lenning", 4),
("Zac", "LaFlour", 3),
("Seth", "Martin", 2),
('Sydney', "Good", 1);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary 
FROM employee, department, role 
LEFT JOIN employee ON employee.role_id = role.id