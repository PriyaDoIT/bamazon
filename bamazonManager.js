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
    presentOptions();
});

function presentOptions() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Quit"
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLow();
                    break;

                case "Add to Inventory":
                    addInv();
                    break;

                case "Add New Product":
                    addNew();
                    break;
                case "Quit":
                    connection.end();
                    break;
            }
        });
}

function viewProducts() {
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
        presentOptions();
    });

}


function viewLow() {
    connection.query(`SELECT * FROM product WHERE stock_quantity < 5`,
        function (error, res, fields) {
            if (error) throw error;
            for (var i = 0; i < res.length; i++) {
                console.log(
                    "Item ID: " + res[i].item_id +
                    " || Product Name: " + res[i].product_name +
                    " || Department Name: " + res[i].department_name +
                    " || Price: " + res[i].price +
                    " || Qty Stock: " + res[i].stock_quantity);
            }
            presentOptions();
        })


};


function addInv() {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Enter Item ID of the item you would like to add inventory to."
    },
    {
        name: "amount",
        type: "input",
        message: "How much of this item would you like to have in stock?"
    }]).then(function (answer) {
        connection.query('UPDATE product SET stock_quantity = ? WHERE item_id = ?', [answer.amount, answer.id],
            function (error, results, fields) {
                if (error) throw error;
            })

        console.log(`================================UPDATED INVENTORY================================`)
        viewProducts();
    })
}

function addNew() {
    return inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "Enter name of product."
        },
        {
            name: "department_name",
            type: "input",
            message: "To which department does this item belong?"
        },
        {
            name: "price",
            type: "input",
            message: "How much to sell for?"
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "How many items will be available?"
        }

    ]).then(function (answers) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
            "INSERT INTO product SET ?",
            {
                product_name: answers.product_name,
                department_name: answers.department_name,
                price: answers.price,
                stock_quantity: answers.stock_quantity
            },
            function (err) {
                if (err) throw err;
                console.log("Item added");
                console.log(`================================UPDATED INVENTORY================================`)
                viewProducts();
            });
    });
}

