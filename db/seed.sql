USE employee_db;

INSERT INTO department (dept_name)
VALUES ("Human Resources");

INSERT INTO department (dept_name)
VALUES ("Marketing");

INSERT INTO department (dept_name)
VALUES ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("HR Director", 90, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("HR Assistant", 50, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Mktg. Director", 90, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Mktg. Assistant", 50, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("CFO", 90, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Finance Manager", 50, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Finance Assistant", 20, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Billy", "Smith", 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Smith", 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Roger", "Smith", 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Mike", "Smith", 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Bert", "Smith", 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Gene", "Smith", 6);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Roberta", "Smith", 7);