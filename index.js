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
    questionsMain();
  });
};

// function which prompts the user for what action they should take
function questionsMain() {
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
function questionsAdd() {
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

// function to prompt for type of update
function questionsUpdate() {
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
function questionsUpdate() {
    // console.table([
    //   {
    //     name: 'foo',
    //     age: 10
    //   }, {
    //     name: 'bar',
    //     age: 20
    //   }
    // ]);
}