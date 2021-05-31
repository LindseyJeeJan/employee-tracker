const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

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

// get data from table and then begin prompting user
const afterConnection = () => {
    connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    if (res.length){
        console.log('array has stuff')
    } else {
        console.log('array has no stuff')
    }
    console.log(res);
    //viewData();
  });
};

const queryDepartments = () => {
    connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    if (res.length){
        
       return res;
    } else {
        console.log('No departments exist.');
    }
}

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
        questionsUpdate();
      } else if (answer.mainMenu === "VIEW"){
        viewData();
      } else {
        // exit the prompt and 
        console.log("Good bye!");
        connection.end();
      }
    });
}

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
}

const addDepartment = () => {

}

const addRole = () => {
    
}

const addEmployee = () => {
    
}

// function to prompt for type of update
const questionsUpdate = () => {
  inquirer
    .prompt({
      name: "typeOfUpdate",
      type: "list",
      message: "Would you like to update a DEPARTMENT, ROLE or EMPLOYEE?",
      choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "RETURN TO MAIN MENU"]
    })
    .then(function(answer) {
      // based on their answer, update department, role, employee or return to main menu
      if (answer.typeOfUpdate === "DEPARTMENT") {
        addDepartment();
      } else if (answer.typeOfUpdate === "ROLE"){
        addRole();
      } else if (answer.typeOfUpdate === "EMPLOYEE"){
        addEmployee();
      } else {
        console.log("Returning to main menu.")
        questionsMain();
      }
    });
}

// use console table to print the database table
const viewData = () => {
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
}