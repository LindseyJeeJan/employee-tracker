const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('./config/connection');
const { prompt } = require('inquirer');

const typeChoices = ["Departments", "Roles", "Employees", "Return to main menu"];

const promptMain = {
  name: "mainMenu",
  type: "list",
  message: `Would you like to:`,
  choices: ["Add departments, roles and employees", "View departments, roles and employees", "Update employee's roles", "Exit the system"]
};

const promptMainAdd = {
  name: "typeOfAdd",
  type: "list",
  message: "What would you like to add?",
  choices: typeChoices
};

const promptMainView = {
  name: "typeOfView",
  type: "list",
  message: "What would you like to view?",
  choices: typeChoices
};


    // connect and give welcome message
connection.connect((err) => {
  if (err) throw err;
  console.log(`\nWelcome to the Acme Company Employee Management System!\nYou are connected as id ${connection.threadId}.\n`);
  afterConnection();
});

// begin prompting user after connection
const afterConnection = () => {
    questionsMain();
};

// function which prompts the user for what action they should take
const questionsMain = () => {
  inquirer
    .prompt(promptMain)
    .then(function(answer) {
      // based on their answer, add, update or view (CRU)
      if (answer.mainMenu === "Add departments, roles and employees") {
        questionsAdd();
      } else if (answer.mainMenu === "Update employee's roles"){
        updateEmployee();
      } else if (answer.mainMenu === "View departments, roles and employees"){
        questionsView();
      } else {
        // exit the application and give goodbye message
        console.log("Good bye!");
        connection.end();
      }
    });
};

// function to update an employee
const updateEmployee = () => {
    const newQuery = `SELECT CONCAT(c.first_name, ' ', c.last_name) AS full_name,
       c.* FROM employee c`;
        connection.query(newQuery, (err, results) => {
        if (results.length === 0){
            console.log('No employees exist. Add an employee first');
            addEmployee();
            return;
        }
        if (err) throw err;
        inquirer
        .prompt([
        {
        name: 'choice',
        type: 'rawlist',
        message: 'Which employee do you want to update?',
        choices() {
                const choiceArray = [];
                results.forEach(({full_name}) => {
                choiceArray.push(full_name);
                });
                return choiceArray;
            },
        },
        
        ])
        .then(function(response) {
        // when finished prompting, insert a new item into the db with that info
        const person = response.choice;
                connection.query('SELECT * FROM role', (err, res) => {
                inquirer
                .prompt([
                {
                    name: 'choice',
                    type: 'rawlist',
                    message: 'What is the employees new role?',
                    choices() {
                            const choiceArray = [];
                            res.forEach(({ title }) => {
                            choiceArray.push(title);
                            });
                            return choiceArray;
                        }, 
                    },  
                ])         
                .then(function(responseRole) {
                const role = responseRole.choice;
                const newId = results.find(x => x.full_name === person).id;      
                const roleId = res.find(x => x.title === role).id;
                const updateQuery = 
                    connection.query(
                    "UPDATE employee SET ? WHERE ?", 
                    [{
                        id: newId,
                    },
                    {  
                        role_id: roleId,  
                    },
                  ],
                    (err) => {
                        if (err) throw err;
                        console.log(`\nEmployee ${person} was updated to ${role}.\n`);
                        // return to main menu
                        questionsMain();
                        }
                    );

            });
    });
    });
    });
};

// function to prompt for type of add
const questionsAdd = () => {
  inquirer
    .prompt(promptMainAdd)
   .then(function(answer) {
      // based on their answer, add department, role, employee or return to main menu
      if (answer.typeOfAdd === "Departments") {
        addDepartment();
      } else if (answer.typeOfAdd === "Roles"){
        addRole();
      } else if (answer.typeOfAdd === "Employees"){
        addEmployee();
      } else {
        console.log("Returning to main menu.")
        questionsMain();
      }
    });
};

// function to add a new department
const addDepartment = () => {
    inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the department?"
      },
    ])
    .then(function(response) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        {
          dept_name: response.name
        },
        function(err) {
          if (err) throw err;
          console.log(`\nDepartment "${response.name}" was sucessfully added.\n`);
          // re-prompt the user for if they want to bid or post
          questionsMain();
        }
      );
    });
};

// function to add a new role
const addRole = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        if (results.length === 0){
            console.log('No departments exist. Add a department first');
            addDepartment();
            return;
        }
        if (err) throw err;
        inquirer
        .prompt([
        {
        name: 'choice',
        type: 'rawlist',
        message: 'Which department would you like to add a role to?',
        choices() {
                const choiceArray = [];
                results.forEach(({ dept_name }) => {
                choiceArray.push(dept_name);
                });
                return choiceArray;
            },
        },
        {
            name: "title",
            type: "input",
            message: "What is the title of the role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of the role?"
        },
        ])
        .then(function(response) {
        // when finished prompting, insert a new item into the db with that info
        const dept = response.choice;
        const newId = results.find(x => x.dept_name === dept).id;
                // insert row into Role table with ID of chosen Department
                connection.query(
                "INSERT INTO role SET ?", 
                {
                    department_id: newId,
                    title: response.title,
                    salary: response.salary,
                },
                (err) => {
                    if (err) throw err;
                    console.log(`\nRole ${response.title} was successfully added.\n`);
                    // return to main menu
                    questionsMain();
                    }
                );

        });
    });
};

// function to add a new employee
const addEmployee = () => {
   connection.query('SELECT * FROM role', (err, results) => {
        if (results.length === 0){
            console.log('No roles exist. Add a role first');
            addRole();
            return;
        }
        if (err) throw err;
        inquirer
        .prompt([
        {
            name: "fName",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "lName",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
        name: 'choice',
        type: 'rawlist',
        message: 'Which role does the employee have?',
        choices() {
                const choiceArray = [];
                results.forEach(({ title }) => {
                choiceArray.push(title);
                });
                return choiceArray;
            },
        },
        
        ])
        .then(function(response) {
        // when finished prompting, insert a new item into the db with that info
        const role = response.choice;
        const newId = results.find(x => x.title === role).id;
                // insert row into Role table with ID of chosen Department
                connection.query(
                "INSERT INTO employee SET ?", 
                {
                    role_id: newId,
                    first_name: response.fName,
                    last_name: response.lName,
                },
                (err) => {
                    if (err) throw err;
                    console.log(`\nEmployee ${response.fName} ${response.lName} was successfully added.\n`);
                    // return to main menu
                    questionsMain();
                    }
                );

        });
    });
};

// function to prompt for type of view
const questionsView = () => {
  inquirer
    .prompt(promptMainView)
    .then(function(answer) {
      // based on their answer, update department, role, employee or return to main menu
      if (answer.typeOfView === "Departments") {
        viewDepartments();
      } else if (answer.typeOfView === "Roles"){
        viewRoles();
      } else if (answer.typeOfView === "Employees"){
        viewEmployees();
      } else {
        console.log("Returning to main menu.");
        questionsMain();
      }
    });
};

// use console table to print the employee table
const viewEmployees = () => {
    const showAllQuery = `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.dept_name
                FROM ((role
                INNER JOIN employee ON role.id = employee.role_id)
                INNER JOIN department ON role.department_id = department.id)
                ORDER BY dept_name`;
    connection.query(showAllQuery, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(`\nAll Acme Company employees:\n`);
        console.table(res);
        // Prompt for main menu again
        questionsMain()
    });
};

// use console table to print the role table
const viewRoles = () => {
    const showAllQuery = `SELECT role.title, role.salary, department.dept_name 
    FROM (role 
    INNER JOIN department ON role.department_id = department.id) 
    ORDER BY dept_name;`;
    connection.query(showAllQuery, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(`\nAll Acme Company roles:\n`)
        console.table(res);
        // Prompt for main menu again
        questionsMain()
    });
};

// use console table to print the department table
const viewDepartments = () => {
    const showAllQuery = `SELECT dept_name FROM department`;
    connection.query(showAllQuery, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
         console.log(`\nAll Acme Company departments:\n`)
        console.table(res);
        // Prompt for main menu again
        questionsMain()
    });
};