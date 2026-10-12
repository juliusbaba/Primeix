# SQL Dojo

An interactive website for learning and practicing SQL. Everything runs in your browser using
[sql.js](https://github.com/sql-js/sql.js) (SQLite compiled to WebAssembly) — no server or database needed.

- **23 guided lessons**: SELECT, WHERE, sorting, NULLs, aggregates, GROUP BY/HAVING, joins, subqueries, CASE, CTEs, window functions, INSERT/UPDATE/DELETE
- **Answer checking** that compares your result to a reference solution (any valid query that gives the right result passes)
- **Playground** to run any SQLite query against a sample shop database
- Progress saved in your browser (localStorage)

## Run it

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

It's fully static, so it also works on GitHub Pages, Netlify, etc.

## Adding lessons

Edit `lessons.js` — each lesson has `theory`, `example`, `task`, `solution`, and optional `hint`, `ordered`, and `check` (a SELECT used to verify the table state after INSERT/UPDATE/DELETE).
