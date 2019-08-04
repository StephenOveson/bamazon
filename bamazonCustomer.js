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
    connection.query(
        'SELECT * FROM products',
        function (err, data) {
            if (err) throw err;
            for (let i = 0; i < data.length; i++) {
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
                            let arrayID = []
                            for (let i = 0; i < data.length; i++) {
                                arrayID.push(data[i].item_id)
                            }
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
                .then(function(answer){
                    for (let i = 0; i < data.length; i++){
                        if (answer.quantity > data[i].stock_quantity) {
                            console.log('Insufficient quantity!');
                            break;
                        } else if (answer.buyID === data[i].item_id){
                            console.log('Name: ' + data[i].product_name)
                            console.log('Price: ' + (answer.quantity * data[i].price))
                            console.log('Quantity: ' + (data[i].stock_quantity - answer.quantity))
                            console.log('\n------------------------------------\n')                        }
                    }
                })
        })
    connection.end();
}
