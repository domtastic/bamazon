const inquirer = require('inquirer');
var Table = require('cli-table');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bamazon'
});
let productID;
let amountAdded;
let productName;
let quantity;
let department;
let price;

function showStock() {
    connection.query(
        'SELECT * FROM products', (err, results) => {
            displayTable(results);
            if (err) { console.log(err); }
            managerAction();

        });
}
function managerAction() {
    inquirer.prompt(
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit App']
        }
    ).then(answer => {
        switch (answer.action) {
            case 'View Products for Sale':
                showStock();
                break;
            case 'View Low Inventory':
                lowInventory();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
            case 'Exit App':
                process.exit();
                break;
        }
    });
}
// show the low inventory by connectino to database and selecting products with stock quantity less than ten
function lowInventory() {
    connection.query(
        'SELECT * FROM products WHERE stock_quantity < 10', (err, results) => {
            if (err) { console.log(err); }
            displayTable(results);
            managerAction();
        }
    )
};
// function to get information about how much of a product to add to stock
function addInventory() {
    inquirer.prompt([
        {
            name: 'item',
            type: 'input',
            message: 'What is the Item ID?'
        },
        {
            name: 'amount',
            type: 'input',
            message: 'How many?'
        }
    ]).then(answers => {
        productID = +answers.item;
        amountAdded = +answers.amount;
        updateInventoryInDB(productID, amountAdded);
        showStock();
    });
};
// function to inquire about the information of the new product
function addProduct() {
    inquirer.prompt([
        {
            name: 'product',
            type: 'input',
            message: 'What is the name of the product?'
        },
        {
            name: 'department',
            type: 'input',
            message: 'What department is it in?'
        },
        {
            name: 'price',
            type: 'input',
            message: 'What is the price?'
        }, {
            name: 'quantity',
            type: 'input',
            message: 'How many are in stock?'
        }]).then(answers => {
            productName = answers.product;
            department = answers.department;
            price = answers.price;
            quantity = answers.quantity;
            addInventoryToDB(productName, department, price, quantity);
            showStock();
        });
};

// functino to show the table in the console using CLI-Table
function displayTable(results) {
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock']
        , colWidths: [10, 30, 15, 10, 10]
    });
    for (i = 0; i < results.length; i++) {
        table.push(
            [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
        );
    }
    console.log(table.toString());
}
// function to update the database inventory
function updateInventoryInDB(productID, amountAdded) {

    connection.query(
        'UPDATE products SET stock_quantity = stock_quantity + ' + amountAdded + ' WHERE item_id = ' + productID, (err, results) => {
            if (err) { console.log(err); }
            else { console.log('Inventory successfuly added updated'); }
        }
    );
}
// function to insert new product into database
function addInventoryToDB(productName, departmentName, price, amountAdded) {
    connection.query(
        'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)',
        [
            productName,
            department,
            price,
            amountAdded
        ],
        (err, results) => {
            if (err) { console.log(err); }
        }
    );
}
// Run App
managerAction();