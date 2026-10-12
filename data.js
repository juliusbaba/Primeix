// Sample database used by every lesson. Deterministic so answers are stable.
const SEED_SQL = `
CREATE TABLE customers (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT, phone TEXT,
  country TEXT NOT NULL, signup_date TEXT NOT NULL
);
CREATE TABLE products (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL,
  price REAL NOT NULL, stock INTEGER NOT NULL
);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id),
  order_date TEXT NOT NULL, status TEXT NOT NULL
);
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL
);
CREATE TABLE employees (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL,
  salary INTEGER NOT NULL, manager_id INTEGER REFERENCES employees(id)
);

INSERT INTO customers VALUES
 (1,'Alice Johnson','alice@example.com','555-0101','USA','2023-01-15'),
 (2,'Bruno Costa','bruno@example.com',NULL,'Brazil','2023-02-20'),
 (3,'Chen Wei','chen@example.com','555-0103','China','2023-03-05'),
 (4,'Diana Prince','diana@example.com',NULL,'USA','2023-04-18'),
 (5,'Emil Novak','emil@example.com','555-0105','Czechia','2023-05-22'),
 (6,'Fatima Khan','fatima@example.com','555-0106','UAE','2023-06-30'),
 (7,'George Smith','george@example.com',NULL,'UK','2023-07-11'),
 (8,'Hana Sato','hana@example.com','555-0108','Japan','2023-08-09'),
 (9,'Ivan Petrov',NULL,NULL,'Russia','2023-09-14'),
 (10,'Julia Roberts','julia@example.com','555-0110','USA','2023-10-01'),
 (11,'Kofi Mensah','kofi@example.com','555-0111','Ghana','2023-11-12'),
 (12,'Lena Fischer','lena@example.com',NULL,'Germany','2023-12-03');

INSERT INTO products VALUES
 (1,'Laptop','Electronics',999.99,15),
 (2,'Smartphone','Electronics',699.00,40),
 (3,'Headphones','Electronics',149.50,60),
 (4,'Desk Chair','Furniture',189.00,25),
 (5,'Standing Desk','Furniture',429.00,10),
 (6,'Bookshelf','Furniture',99.99,30),
 (7,'Coffee Maker','Kitchen',79.90,45),
 (8,'Blender','Kitchen',59.00,50),
 (9,'Notebook','Stationery',4.50,500),
 (10,'Pen Set','Stationery',12.00,300),
 (11,'Backpack','Accessories',49.99,70),
 (12,'Sunglasses','Accessories',89.00,0);

INSERT INTO orders VALUES
 (1,1,'2024-01-05','delivered'),(2,2,'2024-01-12','delivered'),
 (3,1,'2024-01-20','delivered'),(4,3,'2024-02-02','shipped'),
 (5,4,'2024-02-14','delivered'),(6,5,'2024-02-25','cancelled'),
 (7,6,'2024-03-03','delivered'),(8,1,'2024-03-15','shipped'),
 (9,7,'2024-03-22','delivered'),(10,8,'2024-04-01','pending'),
 (11,2,'2024-04-09','delivered'),(12,10,'2024-04-18','delivered'),
 (13,3,'2024-05-05','pending'),(14,4,'2024-05-17','shipped'),
 (15,10,'2024-05-29','delivered'),(16,6,'2024-06-08','cancelled'),
 (17,1,'2024-06-21','delivered'),(18,8,'2024-07-04','delivered'),
 (19,10,'2024-07-19','pending'),(20,5,'2024-08-02','delivered');

INSERT INTO order_items VALUES
 (1,1,1,1),(2,1,3,2),(3,2,2,1),(4,3,9,10),(5,3,10,3),
 (6,4,4,2),(7,5,5,1),(8,5,6,1),(9,6,7,1),(10,7,8,2),
 (11,7,11,1),(12,8,3,1),(13,8,2,1),(14,9,1,1),(15,10,9,20),
 (16,11,7,1),(17,11,8,1),(18,12,2,2),(19,12,3,2),(20,13,6,3),
 (21,14,4,1),(22,14,11,2),(23,15,1,1),(24,16,12,1),(25,17,10,5),
 (26,17,9,5),(27,18,5,1),(28,19,3,3),(29,20,8,4),(30,20,7,2);

INSERT INTO employees VALUES
 (1,'Grace Hopper','Executive',200000,NULL),
 (2,'Alan Turing','Engineering',150000,1),
 (3,'Ada Lovelace','Engineering',130000,2),
 (4,'Linus Torvalds','Engineering',125000,2),
 (5,'Margaret Hamilton','Engineering',140000,2),
 (6,'Steve Jobs','Sales',120000,1),
 (7,'Peggy Olson','Sales',70000,6),
 (8,'Don Draper','Sales',90000,6),
 (9,'Joan Holloway','HR',80000,1),
 (10,'Pam Beesly','HR',55000,9);
`;
