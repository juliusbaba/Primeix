// Each lesson: theory (HTML), example SQL, a task, a reference solution, and an optional hint.
// `ordered: true` means row order matters. `check` is a SELECT run after DML to verify state.
const LESSONS = [
{ section: 'The Basics', title: 'SELECT everything',
  theory: `<p>A <b>table</b> stores rows of data in columns. <code>SELECT</code> reads data from a table, and <code>*</code> means "all columns".</p>
  <pre>SELECT * FROM table_name;</pre>`,
  example: `SELECT * FROM customers;`,
  task: `Select all columns and rows from the <code>products</code> table.`,
  starter: ``, solution: `SELECT * FROM products;`,
  hint: `Replace the table name in the example with <code>products</code>.` },

{ section: 'The Basics', title: 'Choosing columns',
  theory: `<p>List only the columns you need, separated by commas. It's faster and easier to read than <code>*</code>.</p>
  <pre>SELECT col1, col2 FROM table_name;</pre>`,
  example: `SELECT name, country FROM customers;`,
  task: `Show only the <code>name</code> and <code>price</code> of every product.`,
  starter: `SELECT `, solution: `SELECT name, price FROM products;`,
  hint: `Two columns, separated by a comma.` },

{ section: 'The Basics', title: 'Filtering with WHERE',
  theory: `<p><code>WHERE</code> keeps only rows that match a condition. Comparison operators: <code>=</code>, <code>&lt;&gt;</code> (or <code>!=</code>), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Text values go in single quotes.</p>
  <pre>SELECT * FROM table_name WHERE column = 'value';</pre>`,
  example: `SELECT * FROM customers WHERE country = 'USA';`,
  task: `Find all products that cost more than <b>100</b>. Return every column.`,
  starter: `SELECT * FROM products\n`, solution: `SELECT * FROM products WHERE price > 100;`,
  hint: `<code>WHERE price &gt; 100</code>` },

{ section: 'The Basics', title: 'AND, OR, NOT',
  theory: `<p>Combine conditions with <code>AND</code> (both true), <code>OR</code> (either true) and <code>NOT</code>. Use parentheses when mixing them.</p>
  <pre>WHERE (a = 1 OR a = 2) AND b &gt; 10</pre>`,
  example: `SELECT * FROM products\nWHERE category = 'Electronics' AND price < 500;`,
  task: `Find products in the <code>Furniture</code> category that cost <b>less than 200</b>. Return all columns.`,
  starter: `SELECT * FROM products\nWHERE `, solution: `SELECT * FROM products WHERE category = 'Furniture' AND price < 200;`,
  hint: `Join the two conditions with <code>AND</code>.` },

{ section: 'The Basics', title: 'Pattern matching with LIKE',
  theory: `<p><code>LIKE</code> matches text patterns. <code>%</code> matches any number of characters, <code>_</code> matches exactly one.</p>
  <pre>WHERE name LIKE 'A%'   -- starts with A\nWHERE name LIKE '%er'  -- ends with er</pre>`,
  example: `SELECT name FROM customers WHERE name LIKE 'A%';`,
  task: `Return the <code>name</code> of every product whose name <b>contains the letters "ch"</b> (case-insensitive in SQLite).`,
  starter: `SELECT name FROM products\nWHERE `, solution: `SELECT name FROM products WHERE name LIKE '%ch%';`,
  hint: `Put a <code>%</code> on both sides: <code>'%ch%'</code>.` },

{ section: 'The Basics', title: 'IN and BETWEEN',
  theory: `<p><code>IN (...)</code> checks against a list of values; <code>BETWEEN a AND b</code> checks an inclusive range.</p>
  <pre>WHERE country IN ('USA', 'UK')\nWHERE price BETWEEN 10 AND 100</pre>`,
  example: `SELECT * FROM products WHERE price BETWEEN 50 AND 150;`,
  task: `Return the <code>name</code> and <code>country</code> of customers from <b>USA, UK or Germany</b>.`,
  starter: `SELECT name, country FROM customers\nWHERE `, solution: `SELECT name, country FROM customers WHERE country IN ('USA','UK','Germany');`,
  hint: `<code>country IN ('USA', 'UK', 'Germany')</code>` },

{ section: 'The Basics', title: 'Sorting and limiting',
  theory: `<p><code>ORDER BY</code> sorts results (<code>ASC</code> is the default, <code>DESC</code> reverses). <code>LIMIT n</code> returns only the first n rows.</p>
  <pre>SELECT * FROM t ORDER BY col DESC LIMIT 3;</pre>`,
  example: `SELECT name, price FROM products ORDER BY price DESC LIMIT 3;`,
  task: `Return the <code>name</code> and <code>price</code> of the <b>5 cheapest</b> products, cheapest first.`,
  starter: `SELECT name, price FROM products\n`, solution: `SELECT name, price FROM products ORDER BY price ASC LIMIT 5;`, ordered: true,
  hint: `<code>ORDER BY price</code> then <code>LIMIT 5</code>.` },

{ section: 'The Basics', title: 'DISTINCT and aliases',
  theory: `<p><code>DISTINCT</code> removes duplicate rows. <code>AS</code> renames a column or expression in the output. You can also compute values with arithmetic.</p>
  <pre>SELECT DISTINCT country FROM customers;\nSELECT price * 1.2 AS price_with_tax FROM products;</pre>`,
  example: `SELECT name, price * 0.9 AS sale_price FROM products;`,
  task: `List each product <code>category</code> exactly once, sorted alphabetically.`,
  starter: `SELECT `, solution: `SELECT DISTINCT category FROM products ORDER BY category;`, ordered: true,
  hint: `<code>SELECT DISTINCT category ... ORDER BY category</code>` },

{ section: 'The Basics', title: 'Working with NULL',
  theory: `<p><code>NULL</code> means "unknown / missing". You can't use <code>= NULL</code>; use <code>IS NULL</code> or <code>IS NOT NULL</code>. <code>COALESCE(x, fallback)</code> returns the first non-null value.</p>
  <pre>WHERE phone IS NULL\nSELECT COALESCE(phone, 'n/a') FROM customers;</pre>`,
  example: `SELECT name, COALESCE(phone, 'no phone') AS phone FROM customers;`,
  task: `Return the <code>name</code> of customers who <b>have no phone number</b>.`,
  starter: `SELECT name FROM customers\nWHERE `, solution: `SELECT name FROM customers WHERE phone IS NULL;`,
  hint: `<code>WHERE phone IS NULL</code>` },

{ section: 'Aggregation', title: 'COUNT, SUM, AVG, MIN, MAX',
  theory: `<p>Aggregate functions collapse many rows into one value. <code>COUNT(*)</code> counts rows; the others work on a column.</p>
  <pre>SELECT COUNT(*), AVG(price), MAX(price) FROM products;</pre>`,
  example: `SELECT COUNT(*) AS n, AVG(price) AS avg_price FROM products;`,
  task: `Return a single row with the <b>total stock</b> (<code>SUM(stock)</code>) across all products.`,
  starter: `SELECT `, solution: `SELECT SUM(stock) FROM products;`,
  hint: `<code>SELECT SUM(stock) FROM products;</code>` },

{ section: 'Aggregation', title: 'GROUP BY',
  theory: `<p><code>GROUP BY</code> splits rows into groups and applies aggregates to each group separately.</p>
  <pre>SELECT col, COUNT(*) FROM t GROUP BY col;</pre>`,
  example: `SELECT country, COUNT(*) AS customers FROM customers GROUP BY country;`,
  task: `For each product <code>category</code>, return the category and the <b>average price</b>.`,
  starter: `SELECT category, `, solution: `SELECT category, AVG(price) FROM products GROUP BY category;`,
  hint: `<code>SELECT category, AVG(price) FROM products GROUP BY category</code>` },

{ section: 'Aggregation', title: 'HAVING',
  theory: `<p><code>WHERE</code> filters rows <i>before</i> grouping; <code>HAVING</code> filters groups <i>after</i> aggregation.</p>
  <pre>SELECT col, COUNT(*) FROM t GROUP BY col HAVING COUNT(*) &gt; 1;</pre>`,
  example: `SELECT customer_id, COUNT(*) AS orders\nFROM orders GROUP BY customer_id HAVING COUNT(*) >= 2;`,
  task: `Return each <code>customer_id</code> and their number of orders, but only customers with <b>3 or more orders</b>.`,
  starter: `SELECT customer_id, COUNT(*)\nFROM orders\n`, solution: `SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id HAVING COUNT(*) >= 3;`,
  hint: `Group by <code>customer_id</code>, then <code>HAVING COUNT(*) &gt;= 3</code>.` },

{ section: 'Joins', title: 'INNER JOIN',
  theory: `<p>Tables are linked by keys. <code>JOIN</code> combines rows from two tables where the <code>ON</code> condition is true. Use table aliases to keep it short.</p>
  <pre>SELECT a.col, b.col\nFROM a JOIN b ON a.id = b.a_id;</pre>`,
  example: `SELECT o.id, c.name, o.order_date\nFROM orders o\nJOIN customers c ON c.id = o.customer_id;`,
  task: `Return each order's <code>id</code> alongside the customer's <code>name</code> for all <b>delivered</b> orders.`,
  starter: `SELECT o.id, c.name\nFROM orders o\n`, solution: `SELECT o.id, c.name FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = 'delivered';`,
  hint: `Join <code>customers c ON c.id = o.customer_id</code>, then filter <code>o.status = 'delivered'</code>.` },

{ section: 'Joins', title: 'LEFT JOIN',
  theory: `<p><code>LEFT JOIN</code> keeps <i>every</i> row from the left table, filling in <code>NULL</code> where the right table has no match. Great for finding "things with no related rows".</p>
  <pre>SELECT ... FROM a LEFT JOIN b ON ... WHERE b.id IS NULL;</pre>`,
  example: `SELECT c.name, o.id AS order_id\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id;`,
  task: `Find the <code>name</code> of customers who have <b>never placed an order</b>.`,
  starter: `SELECT c.name\nFROM customers c\n`, solution: `SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;`,
  hint: `LEFT JOIN orders, then keep rows where <code>o.id IS NULL</code>.` },

{ section: 'Joins', title: 'Joining many tables',
  theory: `<p>Chain several joins to follow relationships: <code>customers → orders → order_items → products</code>.</p>`,
  example: `SELECT c.name, p.name AS product, oi.quantity\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nJOIN order_items oi ON oi.order_id = o.id\nJOIN products p ON p.id = oi.product_id\nLIMIT 10;`,
  task: `For each customer <code>name</code>, compute the <b>total money spent</b> (<code>SUM(price * quantity)</code>) on non-cancelled orders. Only include customers with at least one such order. Name the second column <code>total</code>.`,
  starter: `SELECT c.name, SUM(p.price * oi.quantity) AS total\nFROM customers c\n`,
  solution: `SELECT c.name, SUM(p.price * oi.quantity) AS total FROM customers c JOIN orders o ON o.customer_id = c.id JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id WHERE o.status <> 'cancelled' GROUP BY c.id, c.name;`,
  hint: `Join customers → orders → order_items → products, filter <code>o.status &lt;&gt; 'cancelled'</code>, <code>GROUP BY c.id, c.name</code>.` },

{ section: 'Advanced', title: 'Subqueries',
  theory: `<p>A query can contain another query in parentheses. Scalar subqueries return one value; <code>IN (SELECT ...)</code> returns a list.</p>
  <pre>WHERE price &gt; (SELECT AVG(price) FROM products)</pre>`,
  example: `SELECT name, price FROM products\nWHERE price > (SELECT AVG(price) FROM products);`,
  task: `Return the <code>name</code> of products that have <b>never been ordered</b> (not in <code>order_items</code>).`,
  starter: `SELECT name FROM products\nWHERE id NOT IN (`, solution: `SELECT name FROM products WHERE id NOT IN (SELECT product_id FROM order_items);`,
  hint: `<code>WHERE id NOT IN (SELECT product_id FROM order_items)</code>` },

{ section: 'Advanced', title: 'CASE expressions',
  theory: `<p><code>CASE</code> is SQL's if/else, producing a value per row.</p>
  <pre>CASE WHEN cond THEN a WHEN cond2 THEN b ELSE c END</pre>`,
  example: `SELECT name, price,\n  CASE WHEN price < 50 THEN 'cheap'\n       WHEN price < 300 THEN 'mid'\n       ELSE 'premium' END AS tier\nFROM products;`,
  task: `Return product <code>name</code> and a column <code>availability</code> that is <code>'out of stock'</code> when stock is 0, <code>'low'</code> when stock is under 20, otherwise <code>'ok'</code>.`,
  starter: `SELECT name,\n  CASE `,
  solution: `SELECT name, CASE WHEN stock = 0 THEN 'out of stock' WHEN stock < 20 THEN 'low' ELSE 'ok' END AS availability FROM products;`,
  hint: `Check <code>stock = 0</code> first, then <code>stock &lt; 20</code>, then <code>ELSE 'ok'</code>.` },

{ section: 'Advanced', title: 'Common Table Expressions',
  theory: `<p>A <code>WITH</code> clause names a subquery so you can build queries step by step and read them top-down.</p>
  <pre>WITH step1 AS (SELECT ...) SELECT * FROM step1;</pre>`,
  example: `WITH totals AS (\n  SELECT order_id, SUM(quantity) AS items FROM order_items GROUP BY order_id\n)\nSELECT * FROM totals WHERE items > 5;`,
  task: `Using a CTE named <code>order_totals</code> (order id and <code>SUM(p.price * oi.quantity)</code> as <code>total</code>), return the <code>order_id</code> and <code>total</code> of orders worth <b>more than 500</b>.`,
  starter: `WITH order_totals AS (\n  SELECT oi.order_id, SUM(p.price * oi.quantity) AS total\n  FROM order_items oi\n  JOIN products p ON p.id = oi.product_id\n  GROUP BY oi.order_id\n)\n`,
  solution: `WITH order_totals AS (SELECT oi.order_id, SUM(p.price * oi.quantity) AS total FROM order_items oi JOIN products p ON p.id = oi.product_id GROUP BY oi.order_id) SELECT order_id, total FROM order_totals WHERE total > 500;`,
  hint: `Finish with <code>SELECT order_id, total FROM order_totals WHERE total &gt; 500;</code>` },

{ section: 'Advanced', title: 'Self joins',
  theory: `<p>A table can be joined to itself to follow hierarchies. Here each employee has a <code>manager_id</code> pointing at another employee.</p>`,
  example: `SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON m.id = e.manager_id;`,
  task: `Return each employee's <code>name</code> and their manager's name (as <code>manager</code>), only for employees <b>who have a manager</b>.`,
  starter: `SELECT e.name, m.name AS manager\nFROM employees e\n`,
  solution: `SELECT e.name, m.name AS manager FROM employees e JOIN employees m ON m.id = e.manager_id;`,
  hint: `Use an inner <code>JOIN employees m ON m.id = e.manager_id</code>.` },

{ section: 'Advanced', title: 'Window functions',
  theory: `<p>Window functions compute across related rows <i>without</i> collapsing them. <code>OVER (PARTITION BY ... ORDER BY ...)</code> defines the window. Common: <code>ROW_NUMBER()</code>, <code>RANK()</code>, <code>SUM() OVER</code>.</p>
  <pre>RANK() OVER (PARTITION BY dept ORDER BY salary DESC)</pre>`,
  example: `SELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk\nFROM employees;`,
  task: `Return the <code>name</code>, <code>department</code> and <code>salary</code> of the <b>highest-paid employee in each department</b> (use <code>RANK()</code> or <code>ROW_NUMBER()</code> in a subquery/CTE).`,
  starter: `WITH ranked AS (\n  SELECT name, department, salary,\n    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk\n  FROM employees\n)\n`,
  solution: `WITH ranked AS (SELECT name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk FROM employees) SELECT name, department, salary FROM ranked WHERE rnk = 1;`,
  hint: `Select from <code>ranked</code> where <code>rnk = 1</code>.` },

{ section: 'Changing Data', title: 'INSERT',
  theory: `<p><code>INSERT INTO</code> adds rows. Name the columns, then give <code>VALUES</code> in the same order.</p>
  <pre>INSERT INTO t (a, b) VALUES (1, 'x');</pre>`,
  example: `INSERT INTO products (name, category, price, stock)\nVALUES ('Mouse', 'Electronics', 25.00, 100);\nSELECT * FROM products ORDER BY id DESC LIMIT 2;`,
  task: `Insert a new customer: name <code>'Maya Lin'</code>, email <code>'maya@example.com'</code>, country <code>'USA'</code>, signup_date <code>'2024-01-01'</code>.`,
  starter: `INSERT INTO customers (name, email, country, signup_date)\nVALUES (`,
  solution: `INSERT INTO customers (name, email, country, signup_date) VALUES ('Maya Lin','maya@example.com','USA','2024-01-01');`,
  check: `SELECT name, email, phone, country, signup_date FROM customers WHERE name = 'Maya Lin'`,
  hint: `Four values in order: name, email, country, signup_date.` },

{ section: 'Changing Data', title: 'UPDATE',
  theory: `<p><code>UPDATE</code> changes existing rows. <b>Always use <code>WHERE</code></b>, or every row is changed!</p>
  <pre>UPDATE t SET col = value WHERE condition;</pre>`,
  example: `UPDATE products SET price = price * 1.1 WHERE category = 'Kitchen';\nSELECT name, price FROM products WHERE category = 'Kitchen';`,
  task: `Set the <code>stock</code> of the product named <code>'Sunglasses'</code> to <b>25</b>.`,
  starter: `UPDATE products\n`,
  solution: `UPDATE products SET stock = 25 WHERE name = 'Sunglasses';`,
  check: `SELECT id, name, stock FROM products ORDER BY id`,
  hint: `<code>UPDATE products SET stock = 25 WHERE name = 'Sunglasses';</code>` },

{ section: 'Changing Data', title: 'DELETE',
  theory: `<p><code>DELETE FROM</code> removes rows. Like <code>UPDATE</code>, forgetting <code>WHERE</code> affects the whole table.</p>
  <pre>DELETE FROM t WHERE condition;</pre>`,
  example: `DELETE FROM order_items WHERE quantity > 10;\nSELECT COUNT(*) FROM order_items;`,
  task: `Delete all orders whose <code>status</code> is <code>'cancelled'</code>.`,
  starter: `DELETE FROM orders\n`,
  solution: `DELETE FROM orders WHERE status = 'cancelled';`,
  check: `SELECT id, status FROM orders ORDER BY id`,
  hint: `<code>DELETE FROM orders WHERE status = 'cancelled';</code>` },
];
