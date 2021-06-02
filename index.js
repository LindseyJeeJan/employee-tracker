const mysql = require('mysql');
const inquirer = require('inquirer');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'base4D8t8',
  database: 'employee_db',
  multipleStatements: true
});

// connect and 
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  afterConnection();
});

// begin prompting user
const afterConnection = () => {
    questionsMain();
    // updateEmployee();
};

// function which prompts the user for what action they should take
const questionsMain = () => {
  inquirer
    .prompt({
      name: "mainMenu",
      type: "list",
      message: "Would you like to ADD, UPDATE, VIEW or EXIT?",
      choices: ["ADD", "UPDATE", "VIEW", "EXIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.mainMenu === "ADD") {
        questionsAdd();
      } else if (answer.mainMenu === "UPDATE"){
        updateEmployee();
      } else if (answer.mainMenu === "VIEW"){
        questionsView();
      } else {
        // exit the prompt and 
        console.log("Good bye!");
        connection.end();
      }
    });
};

// function to prompt for type of add
const questionsAdd = () => {
  inquirer
    .prompt({
      name: "typeOfAdd",
      type: "list",
      message: "Would you like to add a DEPARTMENT, ROLE or EMPLOYEE?",
      choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "RETURN TO MAIN MENU"]
    })
   .then(function(answer) {
      // based on their answer, add department, role, employee or return to main menu
      if (answer.typeOfAdd === "DEPARTMENT") {
        addDepartment();
      } else if (answer.typeOfAdd === "ROLE"){
        addRole();
      } else if (answer.typeOfAdd === "EMPLOYEE"){
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
          console.log(`Department "${response.name}" was added`);
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
                    console.log(`Role ${response.title} was added.`);
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
                    console.log(`Employee ${response.fName} ${response.lName} was added.`);
                    // return to main menu
                    questionsMain();
                    }
                );

        });
    });
};

// function to update an employee
const updateEmployee = () => {
    // const newQuery = `SELECT CONCAT(c.first_name, ' ', c.last_name) AS full_name,
    //    c.* FROM employee c`;
    //     connection.query(newQuery, (err, results) => {
    //     if (results.length === 0){
    //         console.log('No employees exist. Add an employee first');
    //         addEmployee();
    //         return;
    //     }
    //     if (err) throw err;
    //     inquirer
    //     .prompt([
    //     {
    //     name: 'choice',
    //     type: 'rawlist',
    //     message: 'Which employee do you want to update?',
    //     choices() {
    //             const choiceArray = [];
    //             results.forEach(({full_name}) => {
    //             choiceArray.push(full_name);
    //             });
    //             return choiceArray;
    //         },
    //     },
        
    //     ])
    //     .then(function(response) {
    //     // when finished prompting, insert a new item into the db with that info
    //     const person = response.choice;
    //             connection.query('SELECT * FROM role', (err, roleResults) => {
    //             inquirer
    //             .prompt([
    //             {
    //                 name: 'choice',
    //                 type: 'rawlist',
    //                 message: 'What is the employees new role?',
    //                 choices() {
    //                         const choiceArray = [];
    //                         roleResults.forEach(({ title }) => {
    //                         choiceArray.push(title);
    //                         });
    //                         return choiceArray;
    //                     }, 
    //                 },  
    //             ])         
    //             .then(function(responseRole) {
    //             const role = responseRole.choice;
    //             const newId = results.find(x => x.full_name === person).id;
    //             const roleId = responseRole.find(x => x.title === role).id;

    //                 connection.query(
    //                 "UPDATE INTO employee SET ?", 
    //                 {
    //                     role_id: newId,
    //                     full_name: response.full_name,
    //                 },
    //                 (err) => {
    //                     if (err) throw err;
    //                     console.log(`Employee ${response.fName} ${response.lName} was updated.`);
    //                     // return to main menu
    //                     questionsMain();
    //                     }
    //                 );

    //             });
    //         });
    // });
};

// function to prompt for type of view
const questionsView = () => {
  inquirer
    .prompt({
      name: "typeOfView",
      type: "list",
      message: "Would you like to view a DEPARTMENT, ROLE or EMPLOYEE?",
      choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "RETURN TO MAIN MENU"]
    })
    .then(function(answer) {
      // based on their answer, update department, role, employee or return to main menu
      if (answer.typeOfView === "DEPARTMENTS") {
        viewDepartments();
      } else if (answer.typeOfView === "ROLES"){
        viewRoles();
      } else if (answer.typeOfView === "EMPLOYEES"){
        viewEmployees();
      } else {
        console.log("Returning to main menu.")
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
        console.table(res);
        // Prompt for main menu again
        questionsMain()
    });
};