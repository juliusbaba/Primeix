(() => {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const STORE_KEY = 'sqldojo.progress.v1';

  let SQL, db;
  let current = -1; // -1 = playground
  let done = new Set();

  const loadProgress = () => { try { done = new Set(JSON.parse(localStorage.getItem(STORE_KEY) || '[]')); } catch { done = new Set(); } };
  const saveProgress = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify([...done])); } catch {} };

  const makeDb = () => { const d = new SQL.Database(); d.run(SEED_SQL); return d; };

  // ---------- Rendering ----------
  function renderSidebar() {
    let html = `<button data-i="-1" class="${current === -1 ? 'active' : ''}"><span class="tick">⌘</span>Playground</button>`;
    let last = '';
    LESSONS.forEach((l, i) => {
      if (l.section !== last) { html += `<h3>${esc(l.section)}</h3>`; last = l.section; }
      html += `<button data-i="${i}" class="${i === current ? 'active' : ''}"><span class="tick">${done.has(i) ? '✓' : ''}</span>${i + 1}. ${esc(l.title)}</button>`;
    });
    $('sidebar').innerHTML = html;
    $('barFill').style.width = (done.size / LESSONS.length * 100) + '%';
    $('progressText').textContent = `${done.size}/${LESSONS.length} done`;
  }

  function renderSchema() {
    const tables = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`);
    const names = tables.length ? tables[0].values.map((r) => r[0]) : [];
    $('schemaBody').innerHTML = names.map((t) => {
      const cols = db.exec(`PRAGMA table_info(${t})`)[0].values;
      const count = db.exec(`SELECT COUNT(*) FROM ${t}`)[0].values[0][0];
      return `<div class="tbl"><h4 data-t="${esc(t)}" title="Click to preview">${esc(t)} <span class="muted">(${count})</span></h4><ul>` +
        cols.map((c) => `<li><span>${c[5] ? '<span class="pk">🔑</span> ' : ''}${esc(c[1])}</span><span>${esc(c[2])}</span></li>`).join('') + `</ul></div>`;
    }).join('');
  }

  function renderLesson() {
    const p = $('lessonPanel');
    const isLesson = current >= 0;
    $('checkBtn').hidden = !isLesson;
    $('hintBtn').hidden = !isLesson;
    $('solutionBtn').hidden = !isLesson;
    if (!isLesson) {
      p.innerHTML = `<span class="crumb">Free practice</span><h2>Playground</h2>
        <p>Write any SQLite query against the sample shop database (see the schema on the right). Click a table name to preview it. Changes you make stay until you hit <b>Reset database</b>.</p>
        <p><b>Ideas:</b> which country has the most customers? What's the best-selling product? Which month had the most revenue?</p>`;
      $('editor').value = 'SELECT * FROM customers;';
      return;
    }
    const l = LESSONS[current];
    p.innerHTML = `<span class="crumb">${esc(l.section)} · Lesson ${current + 1} of ${LESSONS.length}${done.has(current) ? ' · ✓ completed' : ''}</span>
      <h2>${esc(l.title)}</h2>${l.theory}
      <p><b>Example</b></p><pre><code>${esc(l.example)}</code></pre>
      <button class="ghost small try" id="tryBtn">Try this example in the editor</button>
      <div class="task"><b class="label">Your task</b>${l.task}</div>`;
    $('editor').value = l.starter || '';
    $('tryBtn').onclick = () => { $('editor').value = l.example; run(); };
  }

  function setFeedback(kind, html) {
    const f = $('feedback'); f.className = kind; f.innerHTML = html;
  }

  function showResult(res, modified) {
    const box = $('results');
    if (!res || !res.length) {
      box.innerHTML = `<p class="muted">Statement executed${modified != null ? ` — ${modified} row${modified === 1 ? '' : 's'} affected` : ''}.</p>`;
      return;
    }
    const r = res[res.length - 1];
    const head = r.columns.map((c) => `<th>${esc(c)}</th>`).join('');
    const body = r.values.map((row) => '<tr>' + row.map((v) =>
      v === null ? '<td class="null">NULL</td>' : `<td class="${typeof v === 'number' ? 'num' : ''}">${esc(v)}</td>`).join('') + '</tr>').join('');
    box.innerHTML = `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
      <p class="rowcount">${r.values.length} row${r.values.length === 1 ? '' : 's'}</p>`;
  }

  // ---------- Running & checking ----------
  function run() {
    const sql = $('editor').value.trim();
    if (!sql) { setFeedback('info', 'Type a query first.'); return null; }
    try {
      const res = db.exec(sql);
      showResult(res, db.getRowsModified());
      if (/^\s*(insert|update|delete|create|drop|alter)/i.test(sql)) renderSchema();
      $('feedback').className = ''; $('feedback').innerHTML = '';
      return res;
    } catch (e) {
      $('results').innerHTML = '<p class="muted">No results.</p>';
      setFeedback('err', `<b>SQL error:</b> ${esc(e.message)}`);
      return null;
    }
  }

  const norm = (v) => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v);
  function lastSet(res) { return res && res.length ? res[res.length - 1] : { columns: [], values: [] }; }

  function runOn(fresh, sql, check) {
    let res = fresh.exec(sql);
    if (check) res = fresh.exec(check);
    return lastSet(res);
  }

  function checkAnswer() {
    const sql = $('editor').value.trim();
    if (!sql) return setFeedback('info', 'Write your answer in the editor first.');
    const l = LESSONS[current];
    const a = makeDb(), b = makeDb();
    let mine, expected;
    try { mine = runOn(a, sql, l.check); } catch (e) { return setFeedback('err', `<b>SQL error:</b> ${esc(e.message)}`); }
    expected = runOn(b, l.solution, l.check);
    a.close(); b.close();

    const fmt = (r) => r.values.map((row) => JSON.stringify(row.map(norm)));
    let mineRows = fmt(mine), expRows = fmt(expected);
    if (!l.ordered) { mineRows.sort(); expRows.sort(); }

    if (mine.columns.length !== expected.columns.length)
      return setFeedback('err', `Not quite — your query returns <b>${mine.columns.length}</b> column(s) but <b>${expected.columns.length}</b> are expected.`);
    if (mineRows.length !== expRows.length)
      return setFeedback('err', `Not quite — your query returns <b>${mineRows.length}</b> row(s) but <b>${expRows.length}</b> are expected.`);
    for (let i = 0; i < expRows.length; i++) {
      if (mineRows[i] !== expRows[i])
        return setFeedback('err', `Not quite — the right number of rows, but the values differ${l.ordered ? ' (or the order does)' : ''}. Compare your results to the task and try again.`);
    }
    done.add(current); saveProgress(); renderSidebar();
    run();
    const next = current + 1 < LESSONS.length
      ? `<button class="primary small" id="nextBtn">Next lesson →</button>` : '🎉 You finished every lesson! Head to the Playground to keep exploring.';
    setFeedback('ok', `<b>✓ Correct!</b> Nice work. ${next}`);
    const nb = $('nextBtn'); if (nb) nb.onclick = () => go(current + 1);
  }

  // ---------- Navigation ----------
  function go(i) {
    current = i;
    if (db) db.close();
    db = makeDb();
    location.hash = i < 0 ? 'playground' : 'lesson-' + (i + 1);
    renderSidebar(); renderLesson(); renderSchema();
    $('results').innerHTML = '<p class="muted">Run a query to see results here.</p>';
    setFeedback('', '');
    $('sidebar').classList.remove('open');
    window.scrollTo({ top: 0 });
  }

  function fromHash() {
    const m = /lesson-(\d+)/.exec(location.hash);
    if (m && +m[1] >= 1 && +m[1] <= LESSONS.length) return +m[1] - 1;
    if (location.hash === '#playground') return -1;
    const firstTodo = LESSONS.findIndex((_, i) => !done.has(i));
    return firstTodo === -1 ? -1 : firstTodo;
  }

  // ---------- Events ----------
  function bind() {
    $('sidebar').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(+b.dataset.i); });
    $('runBtn').onclick = run;
    $('checkBtn').onclick = checkAnswer;
    $('hintBtn').onclick = () => setFeedback('info', `<b>Hint:</b> ${LESSONS[current].hint || 'Re-read the example above.'}`);
    $('solutionBtn').onclick = () => {
      if (confirm('Show the solution? Try the hint first if you can!'))
        setFeedback('info', `<b>Solution:</b><pre><code>${esc(LESSONS[current].solution)}</code></pre>`);
    };
    $('resetDbBtn').onclick = () => { db.close(); db = makeDb(); renderSchema(); setFeedback('info', 'Database reset to its original state.'); };
    $('resetProgress').onclick = () => { if (confirm('Clear all your completed lessons?')) { done.clear(); saveProgress(); renderSidebar(); renderLesson(); } };
    $('menuBtn').onclick = () => $('sidebar').classList.toggle('open');
    $('schemaBody').addEventListener('click', (e) => {
      const h = e.target.closest('h4'); if (!h) return;
      $('editor').value = `SELECT * FROM ${h.dataset.t};`; run();
    });
    $('editor').addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
      if (e.key === 'Tab') {
        e.preventDefault();
        const t = e.target, s = t.selectionStart;
        t.value = t.value.slice(0, s) + '  ' + t.value.slice(t.selectionEnd);
        t.selectionStart = t.selectionEnd = s + 2;
      }
    });
    window.addEventListener('hashchange', () => { const i = fromHash(); if (i !== current) go(i); });
  }

  // ---------- Boot ----------
  loadProgress();
  initSqlJs({ locateFile: (f) => 'vendor/' + f }).then((S) => {
    SQL = S; bind(); go(fromHash());
  }).catch((e) => {
    $('lessonPanel').innerHTML = `<h2>Couldn't load the SQL engine</h2><p>${esc(e.message || e)}</p><p>Serve this folder over HTTP (e.g. <code>python3 -m http.server</code>) instead of opening the file directly.</p>`;
  });
})();
