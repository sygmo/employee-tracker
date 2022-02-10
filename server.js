const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'employees_db'
    }
);

// connect to database and start app
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the employees_db database.');
    mainMenu();
});

// displays the main menu of choices available to the user
function mainMenu() {
    inquirer
        .prompt([
            {
                type: "list",
                pageSize: 8,
                name: "options",
                message: "What would you like to do?",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add a Department",
                    "Add a Role",
                    "Add an Employee",
                    "Update an Employee Role",
                    "Exit App"
                ]
            }
        ])
        .then((response) => {
            // move into submenus
            switch (response.options) {
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "Update an Employee Role":
                    updateEmployeeRole();
                    break;
                case "Exit App":
                    db.end();
                    break;
                default:
                    console.log("Invalid choice");
            }
        });
}

// read all departments
function viewAllDepartments() {
    const sql = `SELECT * 
    FROM department 
    ORDER BY name`;
    
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.table(result);
        mainMenu();
    });
}

// read all roles
function viewAllRoles() {
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role 
    LEFT JOIN department 
    ON role.department_id = department.id`;
    
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.table(result);
        mainMenu();
    });
}

// read all employees
function viewAllEmployees() {
    const sql = `SELECT emp.id, emp.first_name, emp.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager
    FROM employee emp
    LEFT JOIN employee manager
    ON emp.manager_id = manager.id
    LEFT JOIN role
    ON emp.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id`;
    
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.table(result);
        mainMenu();
    });
}

function addDepartment() {

}

function addRole() {

}

function addEmployee() {

}

function updateEmployeeRole() {

}