INSERT INTO department (name)
VALUES ("Customer Service"),
       ("IT"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Customer Service Manager", 90000.0, 1),
       ("Customer Service Agent", 60000.0, 1),
       ("Senior Developer", 110000.0, 2),
       ("Intern", 55000.0, 2),
       ("Manager", 150000.0, 2),
       ("Supervisor", 100000.0, 3),
       ("Associate Analyst", 65000.0, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Yvonne", "Wallace", 1, null),
       ("Colin", "Davidson", 2, 1),
       ("Ian", "Buckland", 2, 1),
       ("David", "Martin", 5, null),
       ("Gordon", "Mills", 5, null),
       ("Gordon", "Kerr", 3, 4),
       ("Michelle", "McDonald", 3, 4),
       ("Benjamin", "Tucker", 3, 5),
       ("Evan", "White", 4, 5),
       ("Lauren", "Dowd", 6, null),
       ("Tracey", "Mills", 6, null),
       ("Alan", "Alsop", 7, 10),
       ("Jennifer", "Knox", 7, 10),
       ("Michael", "Forsyth", 7, 11),
       ("Charles", "Henderson", 7, 10);