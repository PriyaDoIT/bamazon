//packages
var mysql = require("mysql");
var inquirer = require("inquirer");

//connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon",
});

connection.connect(function (err) {
    if (err) throw err;
    displayItems();
});


//function to display all items for sale, then run function to ask the questions
function displayItems() {
    connection.query("SELECT * FROM product", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Item ID: " + res[i].item_id +
                " || Product Name: " + res[i].product_name +
                " || Department Name: " + res[i].department_name +
                " || Price: " + res[i].price +
                " || Qty Stock: " + res[i].stock_quantity);
        }
        runSearch();
    })

}

//Prompt with messages
function runSearch() {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Please enter the ID of the product you would like to buy."
    },
    {
        name: "quantity",
        type: "input",
        message: "How many units would you like to buy?"
    }])
        .then(function (answer) {
            connection.query(`SELECT * FROM product WHERE item_id =${answer.id}`,
                function (error, results) {

                    var quantityStock = results[0].stock_quantity;
                    // console.log("quantityStock: " + quantityStock);

                    var quantityWanted = answer.quantity;
                    // console.log("quantitywanted: " + quantityWanted);

                    var price = results[0].price
                    // console.log("price: " + price)

                    var total = price * quantityWanted
                    // console.log("total: $" + total)

                    var updateQty = quantityStock - quantityWanted

                    if (quantityStock > quantityWanted) {
                        //subtract quantity wanted from quantity in stock and update database
                        connection.query('UPDATE product SET stock_quantity = ? WHERE item_id = ?', [updateQty, answer.id], 
                        function (error, results, fields) {
                            if (error) throw error;
                            // ...
                          });
                        //display total price
                        console.log(`Your total is: $${total}`)
                        console.log(`================================UPDATED INVENTORY================================`)
                        displayItems();
                    }
                    else {
                        console.log(`Insufficient quantity! We only have ${quantityStock} in stock.`)
                    }
                    
                })
        })
}


