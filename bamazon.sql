-- Create database and table
DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE product (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(250) NULL,
  department_name  VARCHAR(250) NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL(10,4) NULL,

  PRIMARY KEY (item_id)
);

-- display entire table
SELECT * FROM product;

