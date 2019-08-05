let mysql = require('mysql')
let inquirer = require('inquirer')

let connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
})

connection.connect(function (err) {
    if (err) throw err;
    start();
})

function start() {
    inquirer
        .prompt({
            name: "buyOrExit",
            type: "list",
            message: "Would you like to [BUY] an item or leave bamazon?",
            choices: ["BUY", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.buyOrExit === "BUY") {
                buy();
            } else {
                connection.end();
            }
        });
}

function buy() {
    connection.query(
        'SELECT * FROM products',
        function (err, data) {
            if (err) throw err;
            let arrayID = [];
            for (let i = 0; i < data.length; i++) {
                arrayID.push(data[i].item_id)
                console.log('ID: ' + data[i].item_id)
                console.log('Name: ' + data[i].product_name)
                console.log('Price: ' + data[i].price)
                if (data[i].stock_quantity > 0) {
                    console.log('In Stock')
                } else {
                    console.log('Out of Stock')
                }
                console.log('\n------------------------------------\n')
            }
            inquirer
                .prompt([
                    {
                        name: 'buyID',
                        type: 'list',
                        choices: function () {
                            return arrayID;
                        },
                        message: 'Select an item to purchase by ID.'
                    },
                    {
                        name: 'quantity',
                        type: 'input',
                        message: 'Input the quantity of the selected item you would like.'
                    }
                ])
                .then(function (answer) {
                    let chosenItem;
                    for (let i = 0; i < data.length; i++) {
                        if (answer.buyID === data[i].item_id)
                            chosenItem = data[i]
                    }
                    if (answer.quantity > chosenItem.stock_quantity) {
                        console.log('Insufficient quantity!');
                    } else if (answer.buyID === chosenItem.item_id) {
                        connection.query(
                            'UPDATE products SET ? WHERE ?',
                            [
                                {
                                    stock_quantity: (chosenItem.stock_quantity - answer.quantity)
                                },
                                {
                                    item_id: chosenItem.item_id
                                }
                            ],
                            function (err) {
                                if (err) throw err;
                                console.log(chosenItem.product_name + ' purchased succesfully')
                                console.log('Total Price: ' + (parseInt(answer.quantity) * chosenItem.price))
                                console.log('Quantity Remaining: ' + (chosenItem.stock_quantity - parseInt(answer.quantity)))
                                console.log('\n------------------------------------\n')
                                setTimeout(start, 6000)
                            })
                    }
                })
        })
}
