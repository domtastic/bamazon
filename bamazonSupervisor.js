const inquirer = require("inquirer");
var Table = require("cli-table");
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "bamazon"
});
// * View Product Sales by Department

// * Create New Department
function supervisorAction() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
        "Exit App"
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case "View Product Sales by Department":
          viewSales();
          break;
        case "Create New Department":
          createDepartment();
          break;
        case "Exit App":
          process.exit();
          break;
      }
    });
}

function viewSales() {
  let queryString =
    "SELECT products.department_name AS departmentName, department_id, over_head_costs, SUM(product_sales) AS department_sales, SUM(product_sales) - over_head_costs AS total_profit FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY department_id";
  connection.query(queryString, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      displayTable(results);
    }
  });
}

function createDepartment() {
  inquirer
    .prompt([
      {
        name: "deptName",
        type: "input",
        message: "What is the name of the department?"
      },
      {
        name: "costs",
        type: "input",
        message: "What are the overhead costs?"
      }
    ])
    .then(answers => {
      let deptName = answers.deptName;
      let costs = answers.costs;
      insertDepartment(deptName, costs);
    });
}

function displayTable(results) {
  var table = new Table({
    head: [
      "Department ID",
      "Department Name",
      "Over Head Costs",
      "Product Sales",
      "Total Profit"
    ],
    colWidths: [16, 17, 17, 15, 15]
  });
  for (i = 0; i < results.length; i++) {
    table.push([
      results[i].department_id,
      results[i].departmentName,
      results[i].over_head_costs,
      "$" + results[i].department_sales,
      "$" + results[i].total_profit
    ]);
  }
  console.log(table.toString());
  supervisorAction();
}

function insertDepartment(deptName, costs) {
  connection.query(
    "INSERT INTO departments (department_name, over_head_costs) VALUES (?,?)",
    [deptName, costs],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log(
          "========================================================================================================================================"
        );
        console.log(
          `${deptName} Department successfully added. Use the Manager App to add products from the ${deptName} department to enable profit data.`
        );
        console.log(
          "=========================================================================================================================================="
        );
      }
    }
  );
}

supervisorAction();
