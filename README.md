# bamazon
MySQL/Node store 

# bamazon Store Node App

## OVERVIEW

*bamazon* is a node application that allows the user to be a customer, manager, or supervisor to manipulate product and department data in a MySQL database. The bamazon database is contains two tables, *products* and *departments*, with respective column names of item_id, product_name, product_sales, department_name, price, stock_quantity, AND department_id, department_name, and over_head_costs.
 
## REQUIREMENTS
* latest version on node
* npm install
* MySQL Database *bamazon* with tables *products* and *departments*
	1. The ‘products’ table should have each of the following columns:
		* item_id (unique id for each product)
		* product_name (Name of product)
		* department_name
		* price (cost to customer)
		* stock_quantity(how much of the product is available in stores)
		* product_sales (how much $ made from specific item)
	1. The ‘departments’ table should include the following columns:
		* department_id
		* department_name
		* over_head_costs  (A dummy number you set for each department)

## FUNCTIONALITY

## Customer View

The customer application allows a user to “purchase” items available in the bamazon store.  The user is shown a table of all ‘products (name)’, ‘ID’, and ‘price’, and then prompted to choose the ID of the product desired, and quantity to purchase. The user is notified of an incorrect ID or insufficient stock to fulfill order. Then the total cost is calculated and the user is then asked to confirm purchase. After the purchase is confirmed, or not, they are asked if they would like to buy anything else. If yes, then they will go through he same process, otherwise they will be thanked and exited from the application.

![Customer Image](/readmeImages/customerImage.png)

## Manager View

The manager application provides options for the user to:
    * View Products for Sale
    * View Low Inventory
    * Add to Inventory
    * Add New Product

If a manager selects `View Products for Sale`, the app lists every available item: the item IDs, names, prices, and quantities.

![Manager View Inventory](/readmeImages/managerViewProducts.png)


If a manager selects `View Low Inventory`, then it lists all items with an inventory count lower than five.

![Manager Low Inventory](/readmeImages/managerLowInventory.png)

If a manager selects `Add to Inventory`, the app displays a prompt that will let the manager "add more" of any item currently in the store.

![Manager Add Inventory](/readmeImages/managerAddInventory.png)

If a manager selects `Add New Product`, it allows the manager to add a completely new product to the store.

![Manager Add Product](/readmeImages/managerAddProduct.png)

## Supervisor View
The supervisor application will first will list a set of menu options:
   * View Product Sales by Department
   * Create New Department

If a supervisor selects `View Product Sales by Department`, the app displays a summarized table grouped by department in their terminal/bash window showing the department ID, department name, over head costs, product sales, and total profit

![Supervisor View Sales](/readmeImages/supervisorSummary.png)

If a supervisor selects ‘Create New Department’, it allows the manager to add a completely new department to the store.

![Supervisor View Add Department](/readmeImages/supervisorAddDepartment.png)

## BUILT WITH

* node
* MySQL
* JavaScript

## CONTRIBUTING

* GUI interface
* user authentication
* refactor code to have a cart with all products at checkout instead of completing order for each product
* Any other awesome ideas

## Contributors

Dominic Gonzalez-Padron

