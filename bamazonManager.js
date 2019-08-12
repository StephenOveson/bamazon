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
        .prompt(
            {
                name: 'options',
                type: 'list',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'EXIT']
            }
        ).then(function (answer) {
            console.log(answer)
            switch (answer.options) {
                case 'View Products for Sale':
                    viewProducts();
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
                case 'EXIT':
                    connection.end();
                    break;
            }
        })
}

function viewProducts() {
    connection.query(
        'SELECT * FROM products',
        function (err, data) {
            if (err) throw err;
            for (let i = 0; i < data.length; i++) {
                console.log('ID: ' + data[i].item_id)
                console.log('Name: ' + data[i].product_name)
                console.log('Price: ' + data[i].price)
                console.log('Quantity: ' + data[i].stock_quantity)
                console.log('\n------------------------------------\n')
            }
            start();
        }
    )
}

function lowInventory() {
    connection.query(
        'SELECT * FROM products WHERE stock_quantity < 5;',
        function (err, data) {
            if (err) throw err;
            console.log(data)
            start();
        }
    )
}

function addInventory() {
    connection.query(
        'select * from products',
        function (err, data) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: 'add',
                        type: 'list',
                        choices: function () {
                            let arrayChoice = []
                            for (let i = 0; i < data.length; i++) {
                                arrayChoice.push(data[i].product_name)
                            }
                            return arrayChoice;
                        },
                        message: 'Select a product to add more inventory'
                    },
                    {
                        name: 'amount',
                        type: 'input',
                        message: 'Input the amount of inventory to add'
                    }
                ]).then(function (answer) {
                    let chosenItem;
                    for (let i = 0; i < data.length; i++) {
                        if (answer.add === data[i].product_name) {
                            chosenItem = data[i];
                        }
                    }
                    connection.query(
                        'UPDATE products SET ? WHERE ?',
                        [
                            {
                                stock_quantity: (chosenItem.stock_quantity + parseInt(answer.amount))
                            },
                            {
                                product_name: answer.add
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log(answer.add + ' has had added ' + answer.amount + ' to inventory')
                            start();
                        }
                    )
                })
        })
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: 'product_name',
                type: 'input',
                message: 'Input the name of the product you wish to add'
            },
            {
                name: 'department_name',
                type: 'input',
                message: 'Input the category for the product'
            },
            {
                name: 'price',
                type: 'input',
                message: 'Input the price of the product'
            },
            {
                name: 'stock_quantity',
                type: 'input',
                message: 'Input the quantity'
            },
        ]).then(function(answer){
            connection.query(
                'INSERT INTO products SET ?', answer,
                function(err, results){
                    if (err) throw err;
                    console.log('Added ' + results.affectedRows + ' new product')
                    start();
                }
            )
        })
}