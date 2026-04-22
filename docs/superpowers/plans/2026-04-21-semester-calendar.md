# Semester Task Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a bookmarkable, zero-install web calendar that reads/writes a local `tasks.csv` via the File System Access API, with a logic layer Coby owns and a presentation layer Melka owns and redesigns at will.

**Architecture:** Static single-page app on GitHub Pages. Vanilla HTML/CSS/JS — no build, no framework, no backend. `app.js` (logic) is an ES module that imports `idb-keyval` from CDN and reads `window.FullCalendar` + `window.Papa` globals loaded via `<script>` tags in `index.html`. A short `design-contract.md` fixes the DOM IDs and CSS classes app.js depends on; everything else in `index.html`/`styles.css` is Melka's to rewrite through Claude.ai artifacts. Syllabus imports happen in Claude Desktop via Filesystem MCP scoped to `~/Documents/semester-calendar/`.

**Tech Stack:** HTML5, CSS3, ES modules. FullCalendar v6 (CDN, UMD). PapaParse (CDN, UMD). idb-keyval 6 (CDN, ESM). File System Access API. GitHub Pages.

---

## Session Context

This plan is executed by Coby **together with Claude in this session**. Every task that the spec labels "Coby" — repo scaffolding, writing app.js, writing the design contract, writing Melka's instruction set — is work we do here, now, in `D:\Melka\Calendar`. Two tasks require actions outside this Claude session and are clearly marked:
- **Task 16** needs Coby to click through github.com to create the repo and enable Pages. The plan gives exact steps; we run them together.
- **Task 13** produces `on-melkas-machine.md`, a checklist Coby *later* executes in person on Melka's laptop (installing Claude Desktop, configuring Filesystem MCP, creating the seed folder, bookmarking the site). We write the checklist now; Coby runs it separately.

No task asks Melka to do anything until Phase 1 — she receives a finished, working (ugly) calendar plus her instruction set.

---

## File Structure

Working tree at `D:\Melka\Calendar` (will become the `semester-calendar/` repo):

```
semester-calendar/
├── index.html                 # Melka owns. Placeholder with all required IDs.
├── styles.css                 # Melka owns. Deliberately plain placeholder.
├── app.js                     # Coby owns. ES module. Pure helpers + FSA/CSV/Calendar glue.
├── tests.html                 # Coby owns. Browser-runnable assertions for pure helpers.
├── design-contract.md         # Stable interface doc (DOM IDs, CSS classes, script-tag rules).
├── README.md                  # Landing page + starter prompts (design + syllabus import).
├── for-melka.md               # User guide written directly to Melka.
├── on-melkas-machine.md       # Checklist Coby runs on Melka's laptop (not deployed — repo doc only).
├── seed/tasks.csv             # Seed CSV. Copied to ~/Documents/semester-calendar/tasks.csv on her machine.
└── .gitignore
```

File responsibilities:
- **app.js** is the single logic module. Pure helpers (top half) are exported so `tests.html` can import them. The bottom half wires DOM events, FSA, PapaParse, and FullCalendar. It is the *only* file that changes when behavior changes.
- **index.html** and **styles.css** are placeholders that Melka will replace. They must satisfy `design-contract.md` but are otherwise minimal and ugly.
- **design-contract.md** is short and stable. Melka hands it to Claude.ai along with the current HTML so artifacts stay compatible.
- **for-melka.md** is the instruction set this plan is required to produce. It is written in the second person to Melka and covers: first-time use, daily task management, redesign loop, syllabus import, troubleshooting, CSV field reference.
- **on-melkas-machine.md** is a Coby-only checklist. It is kept in the repo for durability (so Coby can re-read it next semester) but is never linked from `index.html`.

---

## Task 1: Create project skeleton

**Files:**
- Create: `D:\Melka\Calendar\index.html` (empty)
- Create: `D:\Melka\Calendar\styles.css` (empty)
- Create: `D:\Melka\Calendar\app.js` (empty)
- Create: `D:\Melka\Calendar\tests.html` (empty)
- Create: `D:\Melka\Calendar\design-contract.md` (empty)
- Create: `D:\Melka\Calendar\README.md` (empty)
- Create: `D:\Melka\Calendar\for-melka.md` (empty)
- Create: `D:\Melka\Calendar\on-melkas-machine.md` (empty)
- Create: `D:\Melka\Calendar\seed\tasks.csv` (empty)
- Create: `D:\Melka\Calendar\.gitignore` (empty)

- [ ] **Step 1: Create empty files so later tasks can Edit rather than Write**

Run:
```bash
cd "D:\Melka\Calendar" \
  && mkdir -p seed \
  && : > index.html && : > styles.css && : > app.js && : > tests.html \
  && : > design-contract.md && : > README.md && : > for-melka.md \
  && : > on-melkas-machine.md && : > seed/tasks.csv && : > .gitignore \
  && ls -la
```
Expected: all ten files listed, each 0 bytes.

- [ ] **Step 2: Move the existing spec into the repo for future reference**

Run:
```bash
cd "D:\Melka\Calendar" \
  && mkdir -p docs \
  && mv "semester-calendar-spec.md.docx" docs/ \
  && rm -rf unpacked extracted.txt 2>/dev/null; ls
```
Expected: top-level shows the source files created in Step 1 plus `docs/` and `seed/`. The spec `.docx` now lives under `docs/`.

- [ ] **Step 3: No commit yet — git init happens in Task 18.**

---

## Task 2: Write the design contract

**Files:**
- Modify: `D:\Melka\Calendar\design-contract.md`

- [ ] **Step 1: Write `design-contract.md`**

Write exactly this content to `design-contract.md`:

```markdown
# Semester Calendar — Design Contract

This is the contract between the HTML/CSS (yours) and the logic in `app.js` (Coby's). As long as your page keeps the things on this list, the app works. Everything else is yours.

## Required script tags (do not remove or reorder)

Place these three tags in `<head>` or at the end of `<body>`, in this order:

```html
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
<script type="module" src="./app.js"></script>
```

## Required DOM IDs

| ID | Element | Purpose |
|---|---|---|
| `#calendar` | `<div>` | FullCalendar mounts here. |
| `#add-task-btn` | `<button>` | Opens the add-task form. |
| `#reconnect-btn` | `<button>` | Reconnects the CSV file handle. |
| `#file-status` | any inline element | Text indicator ("Connected" / "Disconnected"). |
| `#class-filter` | `<select>` | Filter calendar by class. Options populated by app.js. |
| `#add-task-form` | `<form>` | The task entry form. Any visual layout. |

## Required form fields (inside `#add-task-form`)

| ID | Element | Type |
|---|---|---|
| `#task-title` | `<input>` | text, required |
| `#task-class` | `<input>` | text, optional (datalist for autocomplete is nice) |
| `#task-due-date` | `<input type="date">` | required |
| `#task-importance` | `<input>` or `<select>` | value `0`–`3` |
| `#task-notes` | `<textarea>` | optional |
| `#add-task-submit` | `<button type="submit">` | — |
| `#add-task-cancel` | `<button type="button">` | — |

## CSS classes applied to calendar events

Style these however you like. `app.js` applies them; your CSS decides what they look like.

| Class | When |
|---|---|
| `.task-importance-0` through `.task-importance-3` | Always. Reflects the `importance` column. |
| `.task-completed` | Task `status` is `completed`. |
| `.task-overdue` | Pending task past its due date. |
| `.task-class-{slug}` | Slugified class name. E.g., `"CHEM 210"` → `task-class-chem-210`. |

## What you can change freely

Everything else. Layout, colors, fonts, spacing, animations, modal vs. sidebar vs. inline form, empty states, backgrounds, the overall vibe. Put the form anywhere. Rearrange the toolbar. Switch to a serif. Go wild.

## Smoke test after a redesign

1. Open the page in Chrome.
2. Click **Reconnect**, pick `tasks.csv`.
3. Confirm the calendar renders your existing tasks.
4. Click **Add task**, fill in the form, submit — the task appears.
5. Click an event, mark complete — the event's appearance changes.
6. Drag an event to another day — it moves.

If all six work, the contract is satisfied.
```

- [ ] **Step 2: Verify by reading it back**

Run:
```bash
head -40 "D:\Melka\Calendar\design-contract.md"
```
Expected: the top of the contract, starting with `# Semester Calendar — Design Contract`.

---

## Task 3: Scaffold `tests.html`

**Files:**
- Modify: `D:\Melka\Calendar\tests.html`

We write the test harness before the helpers so we can run failing assertions first (TDD).

- [ ] **Step 1: Write the test harness**

Write to `tests.html`:

```html
<!doctype html>
<meta charset="utf-8">
<title>app.js tests</title>
<style>
  body { font: 14px/1.4 system-ui, sans-serif; padding: 16px; }
  .pass { color: #0a7a2f; }
  .fail { color: #a10000; font-weight: bold; }
  pre { background: #f4f4f4; padding: 6px 10px; }
</style>
<h1>app.js pure-helper tests</h1>
<div id="out"></div>
<script type="module">
  import * as app from './app.js';

  const out = document.getElementById('out');
  let passed = 0, failed = 0;

  function check(label, actual, expected) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    const div = document.createElement('div');
    div.className = ok ? 'pass' : 'fail';
    div.textContent = (ok ? '✓ ' : '✗ ') + label;
    if (!ok) {
      const pre = document.createElement('pre');
      pre.textContent = `expected: ${JSON.stringify(expected)}\nactual:   ${JSON.stringify(actual)}`;
      div.appendChild(pre);
    }
    out.appendChild(div);
    ok ? passed++ : failed++;
  }

  // --- slugify ---
  check('slugify: CHEM 210', app.slugify('CHEM 210'), 'chem-210');
  check('slugify: empty',    app.slugify(''),          '');
  check('slugify: punctuation', app.slugify('Bio/Chem 101!'), 'bio-chem-101');

  // --- nextId ---
  check('nextId: empty list', app.nextId([]), 1);
  check('nextId: sparse',     app.nextId([{id:'1'},{id:'5'},{id:'3'}]), 6);
  check('nextId: non-numeric ids ignored', app.nextId([{id:'abc'},{id:'2'}]), 3);

  // --- isOverdue ---
  const today = new Date('2026-04-21T12:00:00Z');
  check('isOverdue: past pending', app.isOverdue({status:'pending', due_date:'2026-04-01'}, today), true);
  check('isOverdue: future pending', app.isOverdue({status:'pending', due_date:'2026-05-01'}, today), false);
  check('isOverdue: same day pending', app.isOverdue({status:'pending', due_date:'2026-04-21'}, today), false);
  check('isOverdue: past completed', app.isOverdue({status:'completed', due_date:'2026-04-01'}, today), false);

  // --- taskClassNames ---
  check('classNames: base importance',
    app.taskClassNames({importance:'2', status:'pending', due_date:'2026-05-01', class:'CHEM 210'}, today),
    ['task-importance-2', 'task-class-chem-210']);
  check('classNames: completed',
    app.taskClassNames({importance:'0', status:'completed', due_date:'2026-04-01', class:''}, today),
    ['task-importance-0', 'task-completed']);
  check('classNames: overdue',
    app.taskClassNames({importance:'3', status:'pending', due_date:'2026-04-01', class:'MATH 301'}, today),
    ['task-importance-3', 'task-overdue', 'task-class-math-301']);

  // --- csvRowToEvent ---
  check('csvRowToEvent: basic',
    app.csvRowToEvent({id:'7', title:'Lab 4', class:'CHEM 210', due_date:'2026-05-01', importance:'2', status:'pending', completed_at:'', notes:''}, today),
    {
      id: '7',
      title: 'Lab 4',
      start: '2026-05-01',
      allDay: true,
      classNames: ['task-importance-2', 'task-class-chem-210'],
      extendedProps: {id:'7', title:'Lab 4', class:'CHEM 210', due_date:'2026-05-01', importance:'2', status:'pending', completed_at:'', notes:''},
    });

  const summary = document.createElement('h2');
  summary.textContent = `${passed} passed, ${failed} failed`;
  summary.className = failed ? 'fail' : 'pass';
  out.appendChild(summary);
</script>
```

- [ ] **Step 2: Try to run it — it should fail because app.js is empty**

Start a local static server and open the page:

```bash
cd "D:\Melka\Calendar" && python -m http.server 8000
```

Open `http://localhost:8000/tests.html` in Chrome/Edge. Expected: the page shows a JS module-loading error (empty app.js has no exports) — the test summary never renders. That's the expected "failing test" baseline.

Stop the server with Ctrl+C.

---

## Task 4: Implement pure helpers in `app.js`

**Files:**
- Modify: `D:\Melka\Calendar\app.js`

- [ ] **Step 1: Add the pure helpers at the top of `app.js`**

Write to `app.js`:

```js
// app.js — logic layer for the semester calendar.
// Contract: see design-contract.md. Presentation: index.html + styles.css (hers).

// ============================================================
// Pure helpers (exported for tests.html)
// ============================================================

export function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function nextId(rows) {
  let max = 0;
  for (const r of rows) {
    const n = Number.parseInt(r.id, 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max + 1;
}

export function isOverdue(row, today = new Date()) {
  if (row.status === 'completed') return false;
  if (!row.due_date) return false;
  const todayStr = today.toISOString().slice(0, 10);
  return row.due_date < todayStr;
}

export function taskClassNames(row, today = new Date()) {
  const imp = Math.min(3, Math.max(0, Number.parseInt(row.importance, 10) || 0));
  const cls = [`task-importance-${imp}`];
  if (row.status === 'completed') cls.push('task-completed');
  if (isOverdue(row, today)) cls.push('task-overdue');
  if (row.class) cls.push(`task-class-${slugify(row.class)}`);
  return cls;
}

export function csvRowToEvent(row, today = new Date()) {
  return {
    id: String(row.id),
    title: row.title,
    start: row.due_date,
    allDay: true,
    classNames: taskClassNames(row, today),
    extendedProps: { ...row },
  };
}
```

- [ ] **Step 2: Re-run `tests.html` — all 14 assertions should pass**

```bash
cd "D:\Melka\Calendar" && python -m http.server 8000
```

Open `http://localhost:8000/tests.html`. Expected: every line prefixed with `✓`, summary reads `14 passed, 0 failed` in green.

Stop the server.

---

## Task 5: Add the handle-persistence + FSA layer to `app.js`

**Files:**
- Modify: `D:\Melka\Calendar\app.js`

- [ ] **Step 1: Append the FSA/IDB block after the pure helpers**

Append to `app.js` (after the pure helpers block):

```js
// ============================================================
// IndexedDB handle persistence (idb-keyval from CDN, ESM)
// ============================================================

import { get as idbGet, set as idbSet } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6.2.1/+esm';

const HANDLE_KEY = 'tasks-csv-handle';

async function saveHandle(handle) { await idbSet(HANDLE_KEY, handle); }
async function loadStoredHandle() { return await idbGet(HANDLE_KEY); }

async function verifyPermission(handle) {
  const opts = { mode: 'readwrite' };
  if ((await handle.queryPermission(opts)) === 'granted') return true;
  return (await handle.requestPermission(opts)) === 'granted';
}

async function pickFile() {
  const [handle] = await window.showOpenFilePicker({
    types: [{ description: 'CSV', accept: { 'text/csv': ['.csv'] } }],
    multiple: false,
  });
  await saveHandle(handle);
  return handle;
}
```

> **Why the top-level `import`:** ES modules require imports at the top. It's visually "after" the helpers in source but executes before either block runs. That's fine — both blocks only define things.

- [ ] **Step 2: Move the `import` to the top of the file**

Edit `app.js` so the `idb-keyval` import sits above the pure-helpers block (ES module rule). The file's structure should now be:

```
// app.js ...
import { get as idbGet, set as idbSet } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6.2.1/+esm';

// ============================================================
// Pure helpers ...
// ============================================================
export function slugify(...) ...
...

// ============================================================
// IndexedDB handle persistence
// ============================================================

const HANDLE_KEY = ...
async function saveHandle(...) ...
async function loadStoredHandle(...) ...
async function verifyPermission(...) ...
async function pickFile(...) ...
```

Use the Edit tool to remove the duplicate `import` line from the middle and confirm only one `import` remains, at the top of the file.

- [ ] **Step 3: Re-run `tests.html` — should still show 14 passed**

```bash
cd "D:\Melka\Calendar" && python -m http.server 8000
```

Open `http://localhost:8000/tests.html`. Expected: still `14 passed, 0 failed`. The new code is reachable but unused by the tests; we're just confirming we didn't break module loading.

Stop the server.

---

## Task 6: Add CSV I/O to `app.js`

**Files:**
- Modify: `D:\Melka\Calendar\app.js`

- [ ] **Step 1: Append the CSV I/O block**

Append to `app.js`:

```js
// ============================================================
// CSV I/O (PapaParse UMD global: window.Papa)
// ============================================================

const CSV_COLUMNS = ['id','title','class','due_date','importance','status','completed_at','notes'];

async function readCsv(handle) {
  const file = await handle.getFile();
  const text = await file.text();
  const parsed = window.Papa.parse(text, { header: true, skipEmptyLines: true });
  return parsed.data.map(row => {
    const clean = {};
    for (const col of CSV_COLUMNS) clean[col] = (row[col] ?? '').trim();
    return clean;
  });
}

async function writeCsv(handle, rows) {
  const text = window.Papa.unparse(rows, { columns: CSV_COLUMNS });
  const writable = await handle.createWritable();
  await writable.write(text + '\n');
  await writable.close();
}
```

- [ ] **Step 2: Re-run `tests.html` — should still show 14 passed**

Expected: `14 passed, 0 failed`. (Again: we're just confirming nothing broke.)

---

## Task 7: Write the placeholder `index.html` and `styles.css`

**Files:**
- Modify: `D:\Melka\Calendar\index.html`
- Modify: `D:\Melka\Calendar\styles.css`

- [ ] **Step 1: Write `index.html` with every required ID, deliberately plain**

Write to `index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Semester Calendar</title>
  <link rel="stylesheet" href="./styles.css">
  <!-- FullCalendar v6's global bundle injects its own CSS; no separate stylesheet needed. -->
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
  <script type="module" src="./app.js"></script>
</head>
<body>
  <header class="toolbar">
    <strong>Semester Calendar</strong>
    <span id="file-status">Disconnected</span>
    <button id="reconnect-btn" type="button">Reconnect</button>
    <button id="add-task-btn" type="button">Add task</button>
    <label>
      Class:
      <select id="class-filter"><option value="">All classes</option></select>
    </label>
  </header>

  <main>
    <div id="calendar"></div>

    <form id="add-task-form" hidden>
      <h2>Add a task</h2>
      <label>Title <input id="task-title" type="text" required></label>
      <label>Class <input id="task-class" type="text" list="class-options"></label>
      <datalist id="class-options"></datalist>
      <label>Due date <input id="task-due-date" type="date" required></label>
      <label>Importance
        <select id="task-importance">
          <option value="0">0 — low</option>
          <option value="1" selected>1 — normal</option>
          <option value="2">2 — high</option>
          <option value="3">3 — critical</option>
        </select>
      </label>
      <label>Notes <textarea id="task-notes"></textarea></label>
      <div>
        <button id="add-task-submit" type="submit">Save</button>
        <button id="add-task-cancel" type="button">Cancel</button>
      </div>
    </form>
  </main>
</body>
</html>
```

- [ ] **Step 2: Write `styles.css` — deliberately plain**

Write to `styles.css`:

```css
/* styles.css — placeholder. This will be replaced by Melka. */

body { font-family: system-ui, sans-serif; margin: 0; color: #111; }
.toolbar { display: flex; gap: 12px; align-items: center; padding: 12px; border-bottom: 1px solid #ddd; }
main { padding: 16px; }
#calendar { max-width: 1000px; margin: 0 auto; }

#add-task-form { border: 1px solid #ccc; padding: 16px; margin-top: 16px; max-width: 500px; }
#add-task-form label { display: block; margin-bottom: 8px; }
#add-task-form input, #add-task-form select, #add-task-form textarea { width: 100%; box-sizing: border-box; }

/* The four classes app.js attaches to calendar events. Minimal styling — hers to replace. */
.task-importance-0 { background: #9aa0a6; border-color: #9aa0a6; }
.task-importance-1 { background: #4285f4; border-color: #4285f4; }
.task-importance-2 { background: #f9a825; border-color: #f9a825; color: #111; }
.task-importance-3 { background: #d93025; border-color: #d93025; }
.task-completed    { opacity: 0.4; text-decoration: line-through; }
.task-overdue      { outline: 2px solid #d93025; }
```

- [ ] **Step 3: Load `index.html` locally to confirm it renders an empty calendar**

```bash
cd "D:\Melka\Calendar" && python -m http.server 8000
```

Open `http://localhost:8000/`. Expected: a FullCalendar month view renders. The **Add task** form is hidden. Status shows "Disconnected". No JS errors in the DevTools console.

Stop the server.

---

## Task 8: Wire FullCalendar initialization and rendering in `app.js`

**Files:**
- Modify: `D:\Melka\Calendar\app.js`

- [ ] **Step 1: Append state + boot block**

Append to `app.js`:

```js
// ============================================================
// State + rendering
// ============================================================

let fileHandle = null;
let rows = [];
let calendar = null;

function setStatus(text) {
  const el = document.getElementById('file-status');
  if (el) el.textContent = text;
}

function rerender() {
  if (!calendar) return;
  const today = new Date();
  calendar.removeAllEvents();
  for (const row of rows) calendar.addEvent(csvRowToEvent(row, today));
  populateClassFilter();
}

function populateClassFilter() {
  const sel = document.getElementById('class-filter');
  const dl = document.getElementById('class-options');
  const classes = [...new Set(rows.map(r => r.class).filter(Boolean))].sort();
  if (sel) {
    const current = sel.value;
    sel.innerHTML = '<option value="">All classes</option>' +
      classes.map(c => `<option value="${c}">${c}</option>`).join('');
    sel.value = current;
  }
  if (dl) dl.innerHTML = classes.map(c => `<option value="${c}">`).join('');
}

// ============================================================
// Boot
// ============================================================

async function init() {
  const calEl = document.getElementById('calendar');
  if (!calEl) { console.error('Missing #calendar'); return; }

  calendar = new window.FullCalendar.Calendar(calEl, {
    initialView: 'dayGridMonth',
    editable: true,
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
    eventClick: onEventClick,
    eventDrop: onEventDrop,
  });
  calendar.render();

  document.getElementById('reconnect-btn')?.addEventListener('click', onReconnect);
  document.getElementById('add-task-btn')?.addEventListener('click', onShowAddForm);
  document.getElementById('add-task-form')?.addEventListener('submit', onAddSubmit);
  document.getElementById('add-task-cancel')?.addEventListener('click', onHideAddForm);
  document.getElementById('class-filter')?.addEventListener('change', onClassFilterChange);

  const stored = await loadStoredHandle();
  if (stored && await verifyPermission(stored)) {
    fileHandle = stored;
    rows = await readCsv(fileHandle);
    setStatus('Connected');
    rerender();
  } else {
    setStatus('Disconnected');
  }
}

async function onReconnect() {
  try {
    fileHandle = await pickFile();
    rows = await readCsv(fileHandle);
    setStatus('Connected');
    rerender();
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
      setStatus('Error — see console');
    }
  }
}

function onShowAddForm() {
  const f = document.getElementById('add-task-form');
  if (f) f.hidden = false;
}

function onHideAddForm() {
  const f = document.getElementById('add-task-form');
  if (f) { f.reset(); f.hidden = true; }
}

function onClassFilterChange(e) {
  const val = e.target.value;
  for (const ev of calendar.getEvents()) {
    const klass = ev.extendedProps.class || '';
    ev.setProp('display', !val || klass === val ? 'auto' : 'none');
  }
}

// Placeholders — filled in Task 9.
async function onEventClick(_info) {}
async function onEventDrop(_info) {}
async function onAddSubmit(e) { e.preventDefault(); }

init();
```

- [ ] **Step 2: Smoke test — load the page, click Reconnect, pick a CSV**

First create a test CSV:
```bash
cd "D:\Melka\Calendar" && cat > seed/tasks.csv <<'EOF'
id,title,class,due_date,importance,status,completed_at,notes
1,Chem Lab Report,CHEM 210,2026-04-25,2,pending,,Writeup for experiment 4
2,Problem Set 4,MATH 301,2026-04-28,1,pending,,
3,Midterm Exam,PHYS 221,2026-05-02,3,pending,,Chapters 1-7
EOF
```

Start server:
```bash
python -m http.server 8000
```

Open `http://localhost:8000/`. Click **Reconnect**. Pick `D:\Melka\Calendar\seed\tasks.csv`. Grant read/write permission when Chrome asks.

Expected:
- Status flips to "Connected".
- Three events appear on the calendar in April/May 2026.
- The Class dropdown now lists `CHEM 210`, `MATH 301`, `PHYS 221`.
- Events are color-coded by importance (grey/blue/orange/red).
- The MATH 301 event at 2026-04-28 is pending and in the future → no red outline. The others likewise match their states.

Stop the server.

---

## Task 9: Implement add / complete / delete / reschedule handlers

**Files:**
- Modify: `D:\Melka\Calendar\app.js`

- [ ] **Step 1: Replace the three placeholder handlers**

In `app.js`, replace the three placeholder lines:

```js
async function onEventClick(_info) {}
async function onEventDrop(_info) {}
async function onAddSubmit(e) { e.preventDefault(); }
```

with:

```js
async function onEventClick(info) {
  if (!fileHandle) return;
  const id = info.event.id;
  const row = rows.find(r => String(r.id) === id);
  if (!row) return;
  const action = window.prompt(
    `"${row.title}" (${row.class || 'no class'})\n\n` +
    `1 — toggle complete/pending\n` +
    `2 — delete\n\n` +
    `Type 1 or 2, or cancel to close.`
  );
  if (action === '1') {
    if (row.status === 'completed') {
      row.status = 'pending';
      row.completed_at = '';
    } else {
      row.status = 'completed';
      row.completed_at = new Date().toISOString();
    }
  } else if (action === '2') {
    if (!window.confirm(`Delete "${row.title}"? This is permanent.`)) return;
    rows = rows.filter(r => r !== row);
  } else {
    return;
  }
  await writeCsv(fileHandle, rows);
  rerender();
}

async function onEventDrop(info) {
  if (!fileHandle) { info.revert(); return; }
  const row = rows.find(r => String(r.id) === info.event.id);
  if (!row) { info.revert(); return; }
  row.due_date = info.event.start.toISOString().slice(0, 10);
  await writeCsv(fileHandle, rows);
  rerender();
}

async function onAddSubmit(e) {
  e.preventDefault();
  if (!fileHandle) {
    window.alert('Connect a CSV first (click Reconnect).');
    return;
  }
  const newRow = {
    id: String(nextId(rows)),
    title: document.getElementById('task-title').value.trim(),
    class: document.getElementById('task-class').value.trim(),
    due_date: document.getElementById('task-due-date').value,
    importance: String(document.getElementById('task-importance').value || '1'),
    status: 'pending',
    completed_at: '',
    notes: (document.getElementById('task-notes')?.value || '').trim(),
  };
  if (!newRow.title || !newRow.due_date) {
    window.alert('Title and due date are required.');
    return;
  }
  rows.push(newRow);
  await writeCsv(fileHandle, rows);
  onHideAddForm();
  rerender();
}
```

- [ ] **Step 2: Smoke test — full interaction loop**

```bash
cd "D:\Melka\Calendar" && python -m http.server 8000
```

Open `http://localhost:8000/`, click Reconnect, pick `seed/tasks.csv`.

Walk through:
1. Click **Add task**. Fill in title "Test task", class "TEST 100", date 2026-05-10, importance 2. Submit. Expected: event appears on May 10, the form hides, the class dropdown now includes `TEST 100`.
2. Click the new event. Type `1`, press OK. Expected: event gains `.task-completed` (dim + strikethrough).
3. Click it again. Type `2`, confirm. Expected: event disappears.
4. Drag the "Chem Lab Report" from Apr 25 to Apr 27. Expected: event moves.
5. Change the class filter to `MATH 301`. Expected: only MATH events visible.
6. Open `seed/tasks.csv` in a text editor. Expected: every change above is reflected in the file — `Chem Lab Report` now has `due_date=2026-04-27`, `Test task` is gone, and the other rows are intact.

Stop the server. Reset the seed:
```bash
cat > seed/tasks.csv <<'EOF'
id,title,class,due_date,importance,status,completed_at,notes
1,Chem Lab Report,CHEM 210,2026-04-25,2,pending,,Writeup for experiment 4
2,Problem Set 4,MATH 301,2026-04-28,1,pending,,
3,Midterm Exam,PHYS 221,2026-05-02,3,pending,,Chapters 1-7
EOF
```

---

## Task 10: Write the `.gitignore`

**Files:**
- Modify: `D:\Melka\Calendar\.gitignore`

- [ ] **Step 1: Write a minimal gitignore**

Write to `.gitignore`:

```gitignore
# OS junk
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/

# Dev artifacts
unpacked/
extracted.txt

# Never commit a user's real CSV — seed/tasks.csv is the only CSV in the repo.
tasks.csv
!seed/tasks.csv
```

---

## Task 11: Write `README.md` (landing + starter prompts)

**Files:**
- Modify: `D:\Melka\Calendar\README.md`

- [ ] **Step 1: Write the README**

Write to `README.md`:

```markdown
# Semester Calendar

A single-page web calendar that reads and writes a local `tasks.csv`. No backend, no accounts, no sync — just a bookmark, a file picker, and a calendar.

- **User guide:** see [for-melka.md](./for-melka.md).
- **Design contract (for redesigns):** see [design-contract.md](./design-contract.md).
- **On-site setup checklist (Coby):** see [on-melkas-machine.md](./on-melkas-machine.md).

## Starter prompts

### Redesign prompt (paste into claude.ai)

> I'm redesigning a calendar web app. The HTML must keep specific IDs and classes so the logic keeps working — design contract attached. Here's my current version: [paste `index.html` and `styles.css`]. Produce a new version that is **[describe vibe in plain English — colors, typography, mood]**. Return the full updated `index.html` and `styles.css` as artifacts I can copy.

### Syllabus import prompt (paste into Claude Desktop)

> Read `~/Documents/semester-calendar/tasks.csv`, then add every graded assignment from the attached syllabus as new rows. Use class code **XXX 101** (replace with the real code). `id = max(existing)+1`. Date format `YYYY-MM-DD`. Default `importance = 1`; use `3` for midterms, finals, and major projects; use `1` for quizzes and homework. `status = pending`, leave `completed_at` empty, copy meaningful one-liners into `notes` (empty otherwise). Don't duplicate anything already in the file. Write the updated CSV back.

## Repo layout

| File | Owner | Purpose |
|---|---|---|
| `index.html`, `styles.css` | Melka | Everything visible. Replace freely. |
| `app.js`, `tests.html` | Coby | Logic. Rarely changes. |
| `design-contract.md` | Coby | Stable interface between the two layers. |
| `README.md`, `for-melka.md`, `on-melkas-machine.md` | Coby | Docs. |
| `seed/tasks.csv` | Coby | Starter CSV. Copied to `~/Documents/semester-calendar/tasks.csv` during setup. |
```

---

## Task 12: Write `for-melka.md` — the instruction set for Melka

**Files:**
- Modify: `D:\Melka\Calendar\for-melka.md`

- [ ] **Step 1: Write Melka's user guide**

Write to `for-melka.md`:

```markdown
# Your semester calendar — how to use it

Hi. This is a web calendar I made for you. It lives at a bookmark on your laptop. It reads and writes a single file — `tasks.csv` — that sits in `Documents/semester-calendar/` on your machine. No accounts, no sync, no login. Nothing leaves your laptop.

This guide is everything you need. Browse the sections below; the short answer to "how do I X" is probably in one of them.

---

## 1. Opening the calendar

1. Click the **Semester Calendar** bookmark in Chrome (or Edge). It's in your bookmarks bar.
2. The first time you open it each session, click **Reconnect** and pick `Documents/semester-calendar/tasks.csv`. Chrome will ask for permission — click **Allow** (and tick "remember" if it offers).
3. The status text at the top flips to **Connected**. Your tasks appear on the calendar.

> If the bookmark doesn't work, the site's URL is saved in a sticky note on your desktop labeled **Calendar URL**.

> **Must be Chrome or Microsoft Edge.** Firefox and Safari don't support the file-saving feature this app depends on. If you open it in the wrong browser you'll see the calendar but can't save changes.

---

## 2. Day-to-day task management

Everything happens right on the calendar.

- **Add a task.** Click **Add task** in the toolbar. Fill in title, class, due date, importance (0 = background, 3 = critical), optional notes. Click **Save**. The event appears on the calendar.
- **Mark a task complete.** Click the event. A little prompt pops up. Type `1` and press OK. The event dims and gets a strikethrough. Click again and type `1` to un-complete if you marked it by mistake.
- **Delete a task.** Click the event. Type `2` and press OK. Confirm. The event disappears from the calendar and the file.
- **Reschedule.** Drag an event to another day. It moves. That's it.
- **Filter by class.** Pick a class in the **Class** dropdown. Everything else hides. Pick "All classes" to restore.

Every one of those actions writes straight through to `tasks.csv`. There is no save button. If you see the event change on the calendar, the file has been updated.

---

## 3. When you want to redesign

The aesthetic of the calendar is entirely yours. Colors, fonts, layout, mood — all of it. Here's the loop:

1. Open [claude.ai](https://claude.ai) and start a new conversation. Free tier is fine.
2. Paste the **Redesign prompt** from the sticky note on your desktop (or from `README.md` in the repo). The prompt asks Claude to produce new HTML and CSS that match a vibe you describe.
3. Attach three things to the conversation:
   - The current `index.html` (copy-paste its text).
   - The current `styles.css` (copy-paste its text).
   - The **design contract** (also in `README.md` / `design-contract.md`). This is the short list of IDs and CSS classes the logic needs. Keep them; change everything else.
4. Describe your vibe in plain English. Examples: *"warm pastels, serif class labels, rounded everything, gentle shadow."* *"strict grid, mono font, charcoal-on-cream, no color except importance."*
5. Claude produces an artifact that live-renders in the chat. Iterate: *"lighter pink"*, *"softer completed state"*, *"more space between toolbar items"*. As many rounds as you want.
6. When you love it, send the final `index.html` and `styles.css` to Coby. He'll paste them into GitHub; the live site updates in about 30 seconds. Refresh your browser.
   - *(Or, if you've learned GitHub's web editor, push them yourself — takes about a minute.)*
7. After the site updates: click Reconnect (it forgets the file handle on each deploy in some browsers), confirm the calendar loads, try adding + completing a task. If all three work, the new design is solid.

### The one rule

Keep the IDs and classes from the design contract. If you ask Claude to remove the **Add task** button, or rename `#calendar` to something else, the calendar stops working — you'll just see an empty page. The contract is a short list; paste it into every redesign conversation so Claude respects it.

---

## 4. When you get a new syllabus

1. Save the syllabus PDF somewhere you can find it.
2. Open **Claude Desktop** on your laptop.
3. Upload the PDF.
4. Paste the **Syllabus import prompt** from your desktop sticky note. Edit the class code (`XXX 101`) to match the real one — e.g., `BIOL 220`.
5. Claude reads your existing `tasks.csv`, reads the syllabus, appends new rows, and writes the CSV back. It will skip duplicates.
6. Switch to Chrome, refresh the calendar tab. The new assignments are there.

Spot-check a few rows. If an importance level looks off (a quiz marked as critical, say), click the event and adjust — or edit the CSV directly in a text editor (VS Code or Notepad both work; keep the column order).

---

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| "Disconnected" won't go away | Click **Reconnect** and pick the CSV again. If Chrome doesn't show a file picker at all, the browser blocked the permission — open Chrome settings → Privacy → Site settings → the calendar URL → allow File System. |
| Changes don't appear in the CSV | Chrome usually prompts once for write permission. If you dismissed it, click **Reconnect** and grant it. |
| Calendar is empty but CSV has tasks | Open DevTools (F12), check the Console tab for errors. Most likely the CSV is malformed — paste it back into Claude Desktop and ask it to fix the columns. |
| Events are in the wrong place | Dates must be `YYYY-MM-DD`. If Claude wrote `April 25, 2026` into the file, that won't render. Ask it to reformat. |
| You opened it on your phone and nothing works | This app is Chrome/Edge on a laptop only. Your phone doesn't support the file API. |
| You accidentally deleted a task | Undo lives inside the CSV's version history. Right-click `tasks.csv` in File Explorer → Properties → Previous Versions. (Windows keeps snapshots if File History is on.) Or ask Coby to help recover. |

---

## 6. CSV field reference

The file has eight columns. Column order matters — don't rearrange.

| Column | Type | Required | Meaning |
|---|---|---|---|
| `id` | integer | yes | Unique. New tasks use max(existing)+1. |
| `title` | text | yes | Short. Shown on the calendar. |
| `class` | text | no | Class code like `CHEM 210`. Drives the class filter. |
| `due_date` | `YYYY-MM-DD` | yes | All-day. |
| `importance` | 0–3 | yes | 0 = background, 1 = normal, 2 = high, 3 = critical. |
| `status` | `pending` or `completed` | yes | Defaults to `pending`. |
| `completed_at` | ISO datetime | no | Set automatically when you mark complete. Leave blank otherwise. |
| `notes` | text | no | Anything useful. Commas and quotes are fine. |

That's everything. If something in here is wrong or confusing, tell Coby — the guide is easy to update.
```

---

## Task 13: Write `on-melkas-machine.md` (Coby's on-site checklist)

**Files:**
- Modify: `D:\Melka\Calendar\on-melkas-machine.md`

- [ ] **Step 1: Write the on-site checklist**

Write to `on-melkas-machine.md`:

```markdown
# Coby's one-afternoon setup on Melka's laptop

Run this on her machine after the repo is live on GitHub Pages. ~30 minutes.

## 0. Confirm the browser

- [ ] Open Chrome or Microsoft Edge. Note which one she uses day-to-day; use that.
- [ ] If she uses Firefox or Safari, stop and tell her she needs Chrome/Edge for this to work. This is the one hard dependency in the spec.

## 1. Create the seed folder + CSV

- [ ] Create `Documents/semester-calendar/`.
- [ ] Copy `seed/tasks.csv` from the repo into `Documents/semester-calendar/tasks.csv`.
- [ ] Open the CSV in Notepad. Confirm she can read it. (Prepares her for the fallback "edit in a text editor" trick.)

## 2. Install + configure Claude Desktop

- [ ] Install Claude Desktop from claude.ai/desktop.
- [ ] Sign her in (or set up her account if she doesn't have one).
- [ ] Configure the Filesystem MCP server, scoped to `Documents/semester-calendar/` (read + write). Config lives in Claude Desktop's settings JSON; path:
  - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
  - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

  Example fragment:
  ```json
  {
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\<her>\\Documents\\semester-calendar"]
      }
    }
  }
  ```
- [ ] Restart Claude Desktop. Confirm the MCP is connected (icon in the input bar).
- [ ] Ask Claude: *"Read `tasks.csv` and tell me how many tasks are in it."* It should respond with the count. If it can't, the MCP is not wired up.

## 3. Bookmark the live site

- [ ] Open her browser, navigate to the GitHub Pages URL.
- [ ] Click **Reconnect**, pick `Documents/semester-calendar/tasks.csv`. Grant permission.
- [ ] Add a test task via the UI. Confirm it lands in the CSV.
- [ ] Delete the test task. Confirm it's gone from the CSV.
- [ ] Bookmark the URL. Pin the bookmark to the bookmarks bar. Name it **Semester Calendar**.

## 4. Sticky notes on her desktop

Create three text files on her desktop — she will reach for them by name:

- [ ] `Calendar URL.txt` — the Pages URL.
- [ ] `Redesign prompt.txt` — the redesign prompt from `README.md`.
- [ ] `Syllabus import prompt.txt` — the syllabus prompt from `README.md`.

## 5. Walk her through `for-melka.md`

- [ ] Open `for-melka.md` in her browser (link from the live site, or the GitHub README).
- [ ] Walk through sections 1–4 with her in person. Have her do each action herself while you watch. Don't skip — watching her add a task, complete one, and drag one is the only way you'll catch a contract gap.
- [ ] Leave the guide open in a pinned tab.

## 6. Done

- [ ] Confirm she knows where to find the guide (pinned tab + GitHub link).
- [ ] Confirm she knows where the sticky notes are.
- [ ] Confirm she can repeat the full loop once without you prompting.
```

---

## Task 14: Final local smoke test

**Files:** none — manual verification.

- [ ] **Step 1: Re-run all tests and a full UI pass**

```bash
cd "D:\Melka\Calendar" && python -m http.server 8000
```

- [ ] Open `http://localhost:8000/tests.html`. Expected: `14 passed, 0 failed`.
- [ ] Open `http://localhost:8000/`. Click Reconnect → pick `seed/tasks.csv`.
- [ ] Run the full interaction loop from Task 9, Step 2. Every step passes.
- [ ] DevTools console shows no errors at any point.

Stop the server. Reset `seed/tasks.csv` to the canonical three-row seed if needed.

---

## Task 15: Initialize git and commit the scaffold

**Files:** none — git operations.

- [ ] **Step 1: Initialize and make the first commit**

```bash
cd "D:\Melka\Calendar" && git init -b main \
  && git add .gitignore README.md for-melka.md on-melkas-machine.md \
         design-contract.md index.html styles.css app.js tests.html \
         seed/tasks.csv docs/ \
  && git status
```

Expected: all ten scaffolded files and the `docs/` tree staged. Nothing unexpected (no `unpacked/`, no `extracted.txt`).

- [ ] **Step 2: Commit**

```bash
git commit -m "Scaffold semester calendar: logic, placeholder UI, docs, instruction set"
```

Expected: one commit, ~10 files.

---

## Task 16: Create the GitHub repo and enable Pages

This task requires Coby to click through github.com. Exact steps below.

**Files:** none — GitHub UI operations.

- [ ] **Step 1: Create the repo**

- Go to https://github.com/new.
- Owner: Coby's account. Name: `semester-calendar`. Visibility: Public (Pages on free accounts requires public, unless Coby has Pro).
- Do **not** initialize with a README, .gitignore, or license — the local repo already has these.
- Click **Create repository**.

- [ ] **Step 2: Push the local repo**

Copy the exact remote URL GitHub shows on the empty-repo page. Then:

```bash
cd "D:\Melka\Calendar" \
  && git remote add origin <paste URL here> \
  && git push -u origin main
```

Expected: a successful push, one commit on `main`.

- [ ] **Step 3: Enable Pages**

- In the repo's **Settings → Pages**:
  - Source: **Deploy from a branch**.
  - Branch: `main` / root (`/`). Save.
- Wait 30–60 seconds for the first build. The Pages page will show the live URL, of the form `https://<coby-user>.github.io/semester-calendar/`.

- [ ] **Step 4: Record the URL**

Note the URL. You'll use it in Task 17 and for Melka's bookmark.

---

## Task 17: Live smoke test on GitHub Pages

**Files:** none — manual verification.

- [ ] **Step 1: Open the live URL in Chrome on Coby's machine**

Open the Pages URL. Expected: the calendar page loads, FullCalendar renders an empty month view, status says **Disconnected**, no console errors.

- [ ] **Step 2: Run `tests.html` live**

Open `<pages-url>/tests.html`. Expected: `14 passed, 0 failed`.

- [ ] **Step 3: Reconnect flow on live site**

- Click **Reconnect**.
- Pick a test CSV — a copy of `seed/tasks.csv` anywhere on disk (the real one will live in Melka's Documents folder later).
- Grant read/write permission.
- Expected: status flips to **Connected**, three events render.

- [ ] **Step 4: Full interaction pass on the live site**

Repeat the six-step interaction loop from Task 9, Step 2. Every step passes. The test CSV on disk reflects every change.

- [ ] **Step 5: If anything fails**

Open DevTools. Check the Network tab for failed CDN loads (wrong version, etc). Check the Console for module-loading errors. Fix, commit, push, re-test.

---

## Self-review checklist

After the plan is executed end-to-end, the following must all be true. This is a post-execution checklist, not pre-execution; flag anything that isn't true as a bug.

- [ ] Every item in spec Section 7 ("Design Contract") is also in `design-contract.md`.
- [ ] `app.js` implements read, write, add, complete, delete, reschedule, class-filter — one function each, exactly one place.
- [ ] `for-melka.md` covers: first use, daily task management, redesign loop, syllabus import, troubleshooting, CSV field reference. (Spec Sections 3, 8, 9 plus the CSV schema from Section 4.)
- [ ] `README.md` includes both starter prompts (spec Sections 8, 9).
- [ ] `on-melkas-machine.md` covers the Phase 0 items that can only happen on her laptop: Claude Desktop install, Filesystem MCP config, seed folder, bookmark, sticky notes. (Spec Section 10, Phase 0.)
- [ ] GitHub Pages is live and HTTPS (spec Section 6: FSA API requires HTTPS).
- [ ] Spec's "no npm install, no build" rule is upheld — no `package.json`, no bundler config in the repo.
- [ ] Firefox / Safari / mobile are not mentioned as supported anywhere in the app or docs. (Spec Section 1 non-goals.)

---

## Execution order for this session

Tasks 1–15 are work we'll do together in `D:\Melka\Calendar`. Task 16 needs Coby to click through github.com (3–5 minutes of UI work); the plan has exact steps. Task 17 runs against the deployed URL.

After Task 17 passes, the only remaining work is Coby executing `on-melkas-machine.md` in person on Melka's laptop — that is out of this session's scope but fully documented.
