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

// create new department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "deptName",
                message: "What is the name of the department?"
            }
        ])
        .then((response) => {
            const sql = `INSERT INTO department (name) 
            VALUES (?)`
            const params = [response.deptName];

            db.query(sql, params, (err, res) => {
                if (err) {
                    throw err;
                }
                console.log(`Added ${response.deptName} to the database`);
                mainMenu();
            });
        });
}

// create new role
function addRole() {
    // get department data to use as prompt choices
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        let departments = [];
        // populate array of department names
        res.forEach((department) => departments.push(department.name));

        inquirer
            .prompt([
                {
                    type: "input",
                    name: "roleName",
                    message: "What is the name of the role?"
                },
                {
                    type: "input",
                    name: "roleSalary",
                    message: "What is the salary of the role?",
                    validate(value) {
                        const valid = !isNaN(parseInt(value));
                        return valid || 'Please enter a number.';
                    }
                },
                {
                    type: 'list',
                    name: 'roleDept',
                    message: "Which department does the role belong to?",
                    choices: departments
                }
            ])
            .then((response) => {
                // get id for department
                let deptId;
                res.forEach((department) => {
                    if (department.name === response.roleDept) {
                        deptId = department.id;
                    }
                });

                const sql = `INSERT INTO role (title, salary, department_id) 
                VALUES (?, ?, ?)`
                const params = [response.roleName, response.roleSalary, deptId];

                db.query(sql, params, (err, res) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`Added ${response.roleName} to the database`);
                    mainMenu();
                });
            });
    });
    
}

// create new employee
function addEmployee() {
    // get arrays of potential managers
    // one with id and name data, another with only names
    let managers = ["None"];
    let managerData = [];
    const managerSql = `SELECT id, CONCAT (first_name, ' ', last_name) AS name 
    FROM employee;`
    db.query(managerSql, (err, res) => {
        if (err) throw err;
        res.forEach((emp) => {
            managers.push(emp.name);
            managerData.push(emp);
        });
    });

    // get roles data to use as prompt choices
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        let roles = [];
        // populate array of role titles
        res.forEach((role) => roles.push(role.title));

        inquirer
            .prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the employee's last name?"
                },
                {
                    type: 'list',
                    pageSize: roles.length,
                    name: 'empRole',
                    message: "Which is the employee's role?",
                    choices: roles
                },
                {
                    type: 'list',
                    pageSize: managers.length,
                    name: 'empManager',
                    message: "Who is the employee's manager?",
                    choices: managers
                }
            ])
            .then((response) => {
                // get id for department
                let roleId;
                res.forEach((role) => {
                    if (role.title === response.empRole) {
                        roleId = role.id;
                    }
                });

                // get id for manager
                let managerId;
                managerData.forEach((manager) => {
                    if (manager.name === response.empManager) {
                        managerId = manager.id;
                    }
                })

                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                VALUES (?, ?, ?, ?)`
                const params = [response.firstName, response.lastName, roleId, managerId];

                db.query(sql, params, (err, res) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`Added ${response.firstName} ${response.lastName} to the database`);
                    mainMenu();
                });
            });
    });
}

function updateEmployeeRole() {

}