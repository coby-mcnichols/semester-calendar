// app.js — logic layer for the semester calendar.
// Classic script (not a module) so it runs on file:// for local design previews.
// Globals used: window.FullCalendar, window.Papa, window.idbKeyval.
// Contract: see design-contract.md. Presentation: index.html + styles.css (hers).

// ============================================================
// Pure helpers (exposed via window.CalendarLogic for tests.html)
// ============================================================

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function nextId(rows) {
  let max = 0;
  for (const r of rows) {
    const n = Number.parseInt(r.id, 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max + 1;
}

function isOverdue(row, today = new Date()) {
  if (row.status === 'completed') return false;
  if (!row.due_date) return false;
  const todayStr = today.toISOString().slice(0, 10);
  return row.due_date < todayStr;
}

function taskClassNames(row, today = new Date()) {
  const imp = Math.min(3, Math.max(0, Number.parseInt(row.importance, 10) || 0));
  const cls = [`task-importance-${imp}`];
  if (row.status === 'completed') cls.push('task-completed');
  if (isOverdue(row, today)) cls.push('task-overdue');
  if (row.class) cls.push(`task-class-${slugify(row.class)}`);
  return cls;
}

function csvRowToEvent(row, today = new Date()) {
  return {
    id: String(row.id),
    title: row.title,
    start: row.due_date,
    allDay: true,
    classNames: taskClassNames(row, today),
    extendedProps: { ...row },
  };
}

window.CalendarLogic = { slugify, nextId, isOverdue, taskClassNames, csvRowToEvent };

// ============================================================
// IndexedDB handle persistence (idb-keyval UMD global: window.idbKeyval)
// ============================================================

const HANDLE_KEY = 'tasks-csv-handle';

async function saveHandle(handle) { await idbKeyval.set(HANDLE_KEY, handle); }
async function loadStoredHandle() { return await idbKeyval.get(HANDLE_KEY); }

async function pickFile() {
  const [handle] = await window.showOpenFilePicker({
    types: [{ description: 'CSV', accept: { 'text/csv': ['.csv'] } }],
    multiple: false,
  });
  await saveHandle(handle);
  return handle;
}

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

// ============================================================
// Preview mode (file:// design preview — no CSV, sample data only)
// ============================================================

const PREVIEW_MODE = location.protocol === 'file:';

const PREVIEW_ROWS = [
  { id: '1', title: 'Problem Set 4',     class: 'MATH 301', due_date: '2026-04-14', importance: '1', status: 'pending',   completed_at: '',                     notes: '' },
  { id: '2', title: 'Lab Report',        class: 'CHEM 210', due_date: '2026-04-17', importance: '2', status: 'completed', completed_at: '2026-04-17T10:00:00Z', notes: 'Experiment 4 writeup' },
  { id: '3', title: 'Reading response',  class: 'ENG 205',  due_date: '2026-04-20', importance: '0', status: 'completed', completed_at: '2026-04-20T22:00:00Z', notes: '' },
  { id: '4', title: 'Quiz 3',            class: 'BIOL 220', due_date: '2026-04-22', importance: '1', status: 'pending',   completed_at: '',                     notes: 'Cell biology ch. 5' },
  { id: '5', title: 'Essay draft',       class: 'ENG 205',  due_date: '2026-04-24', importance: '2', status: 'pending',   completed_at: '',                     notes: '' },
  { id: '6', title: 'Midterm',           class: 'CHEM 210', due_date: '2026-04-28', importance: '3', status: 'pending',   completed_at: '',                     notes: 'Chapters 1-7' },
  { id: '7', title: 'Problem Set 5',     class: 'MATH 301', due_date: '2026-04-30', importance: '1', status: 'pending',   completed_at: '',                     notes: '' },
  { id: '8', title: 'Lab Report',        class: 'BIOL 220', due_date: '2026-05-04', importance: '2', status: 'pending',   completed_at: '',                     notes: '' },
  { id: '9', title: 'Final paper',       class: 'ENG 205',  due_date: '2026-05-08', importance: '3', status: 'pending',   completed_at: '',                     notes: '8-10 pages' },
  { id: '10', title: 'Final exam',       class: 'MATH 301', due_date: '2026-05-12', importance: '3', status: 'pending',   completed_at: '',                     notes: '' },
];

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
  if (!calEl) return; // Safe no-op when imported from tests.html.

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

  if (PREVIEW_MODE) {
    rows = PREVIEW_ROWS.map(r => ({ ...r }));
    setStatus('Preview mode — sample data');
    rerender();
    return;
  }

  const stored = await loadStoredHandle();
  if (stored && (await stored.queryPermission({ mode: 'readwrite' })) === 'granted') {
    fileHandle = stored;
    rows = await readCsv(fileHandle);
    setStatus('Connected');
    rerender();
  } else {
    setStatus('Disconnected');
  }
}

async function onReconnect() {
  if (PREVIEW_MODE) {
    window.alert('This is the design preview. Open the real Semester Calendar bookmark to connect a CSV.');
    return;
  }
  try {
    const stored = await loadStoredHandle();
    if (stored && (await stored.requestPermission({ mode: 'readwrite' })) === 'granted') {
      fileHandle = stored;
    } else {
      fileHandle = await pickFile();
    }
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

async function onEventClick(info) {
  if (!fileHandle && !PREVIEW_MODE) return;
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
  if (fileHandle) await writeCsv(fileHandle, rows);
  rerender();
}

async function onEventDrop(info) {
  if (!fileHandle && !PREVIEW_MODE) { info.revert(); return; }
  const row = rows.find(r => String(r.id) === info.event.id);
  if (!row) { info.revert(); return; }
  row.due_date = info.event.start.toISOString().slice(0, 10);
  if (fileHandle) await writeCsv(fileHandle, rows);
  rerender();
}

async function onAddSubmit(e) {
  e.preventDefault();
  if (!fileHandle && !PREVIEW_MODE) {
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
  if (fileHandle) await writeCsv(fileHandle, rows);
  onHideAddForm();
  rerender();
}

init();
