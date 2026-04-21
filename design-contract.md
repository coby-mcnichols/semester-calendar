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
