const inquirer = require('inquirer');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bamazon'
});
let chosenItem;
let customerProduct;
let customerQuantity;
let totalCost;
let newQuantity;

function showProducts() {
    // show the products available in the database
    connection.query(
        'SELECT * FROM `products`', function (err, results) {
            for (i = 0; i < results.length; i++) {
                // only if in stock....
                if (results[i].stock_quantity > 0) {
                    console.log(
                        `ID: ${results[i].item_id}, Item: ${results[i].product_name}, Price: $${results[i].price}, `
                    )
                }
            }
            // ask what product the customer would like to purchase
            buySomething(results);
        });
}
function buySomething(results) {
    inquirer.prompt([
        {
            name: "product_id",
            type: "input",
            message: "Please provide the ID of the item you would like to purchase."
        }, {
            name: "product_quantity",
            type: "input",
            message: "How many would you like to purchase?"
        }
    ]).then(answers => {
        // check to see if ID selection is valid
        // console.log('answers: ', answers);
        // get the chosen product
        customerProduct = +answers.product_id;
        customerQuantity = +answers.product_quantity;
        // console.log(results);
        // check to see  if ID selection is valid
        for (var i = 0; i < results.length; i++) {
            if (results[i].item_id === customerProduct) {
                chosenItem = results[i];
            }
        }
        if (chosenItem == undefined) {
            console.log('=====================================');
            console.log("Please choose a valid ID.");
            console.log('=====================================');
            showProducts();
        } else {
            // check if there is enough stock for the order
            if (chosenItem.stock_quantity >= customerQuantity) {
                // console.log("We have enough in stock for this order.")
                // determine total cost
                totalCost = chosenItem.price * customerQuantity;
                // console.log(totalCost);
                newQuantity = chosenItem.stock_quantity - customerQuantity;
                // console.log('newQuantity: ', newQuantity);
                // ask if total coast is okay and to confirm order
                confirmPurchase();
            } else {
                console.log('=====================================');
                console.log("Insufficient quantity in stock!");
                console.log('=====================================');
                // START OVER???
                nextOrder();
            }
        }
        // console.log(chosenItem);
    });
}
function confirmPurchase() {
    inquirer.prompt([
        {
            name: "confirmOrder",
            type: "confirm",
            message: `Your total cost is $${totalCost}. Do you wish to complete this purchase?`
        }
    ]).then(answer => {
        console.log('answer: ', answer);
        if (answer.confirmOrder) {
            console.log('=====================================');
            console.log("Your order has been confirmed")
            console.log('=====================================');
            // update stock in database
            updateStock();
            nextOrder();
        }
        else {
            console.log('=====================================');
            console.log("Your order has been canceled")
            console.log('=====================================');

            // start over?????
            nextOrder();
        }
    })
}
function updateStock() {
    connection.query(
        'UPDATE `products` SET ? WHERE ?',
        [
            { stock_quantity: newQuantity },
            { item_id: chosenItem.item_id }
        ],
        (err) => {
            if (err) { console.log(err); }
        }
    )
}
function nextOrder() {
    inquirer.prompt([
        {
            name: "anotherOrder",
            type: "confirm",
            message: `Would you like to buy anything else?`
        }
    ]).then(answer => {
        // console.log('answer: ', answer);
        if (answer.anotherOrder) {
            showProducts();
        }
        else {
            console.log('=====================================');
            console.log("Thank You, Come Again!")
            console.log('=====================================');
            process.exit();
        }
    })
}

console.log('=====================================');
console.log('-----  WELCOME TO CLIMB-MART!  ------')
console.log('=====================================');

showProducts();

