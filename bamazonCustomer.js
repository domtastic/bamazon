const inquirer = require('inquirer');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bamazon'
});

function showProducts() {
    // show the products available in the database
    connection.query(
        'SELECT * FROM `products`',
        function (err, results) {
            for (i = 0; i < results.length; i++) {
                // only if in stock....
                if (results[i].stock_quantity > 0) {
                    console.log(
                        `ID: ${results[i].item_id}, Item: ${results[i].product_name}, Price: $${results[i].price}, `
                    )
                }

            }
            // ask what product the customer would like to purchase
            // buySomething();
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
                console.log('answers: ', answers);
                // get the chosen product
                let customerProduct = +answers.product_id;
                let customerQuantity = +answers.product_quantity;
                let chosenItem;
                // console.log(results);
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id === customerProduct) {
                        chosenItem = results[i];
                    }
                }
                // check if there is enough stock for the order
                if (chosenItem.stock_quantity >= customerQuantity) {
                    console.log("We have enough in stock for this order.")
                    // determine total cost
                    let totalCost = chosenItem.price * customerQuantity;
                    console.log(totalCost);
                    let newQuantity = chosenItem.stock_quantity - customerQuantity;
                    console.log('newQuantity: ', newQuantity);
                    // ask if total coast is okay and to confirm order
                    inquirer.prompt([
                        {
                            name: "confirmOrder",
                            type: "confirm",
                            message: `Your total cost is $${totalCost}. Do you wish to complete this purchase?`
                        }
                    ]).then(answer => {
                        console.log('answer: ', answer);
                        if (answer.confirmOrder) {
                            console.log("order confirmed")
                            // update stock in database

                            connection.query(
                                'UPDATE `products` SET ? WHERE ?',
                                [
                                    { stock_quantity: newQuantity },
                                    { item_id: chosenItem.item_id }
                                ],
                                function (err, results) {
                                    console.log('Results', results); // results contains rows returned by server
                                    console.log(err);
                                }
                            );
                        }
                        else {
                            console.log("order canceled")
                            // start over?????
                        }
                    })
                } else {
                    console.log("Insufficient quantity in stock!");
                    // START OVER???

                }
                // console.log(chosenItem);

            });
        }
    );
}


showProducts();