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
