# Semester Calendar

A single-page web calendar that reads and writes a local `tasks.csv`. No backend, no accounts, no sync — just a bookmark, a file picker, and a calendar.

- **User guide:** see [for-melka.md](./for-melka.md).
- **Design contract (for redesigns):** see [design-contract.md](./design-contract.md).
- **On-site setup checklist (Coby):** see [on-melkas-machine.md](./on-melkas-machine.md).

## Starter prompts

### Redesign prompt (paste into Claude Code)

> Read `design-contract.md`, `index.html`, and `styles.css` in this folder. First run `git pull --ff-only` so we're on latest. I'll describe a visual vibe; rewrite the HTML and CSS to match while preserving every ID and CSS class listed in the design contract. Change everything else freely. Iterate with me. When I say "ship it," write the updated files to disk, then run `git add index.html styles.css && git commit -m "redesign: <short description>" && git push`.
>
> The vibe I want:

### Syllabus import prompt (paste into Claude Code)

> Read `tasks.csv` in this folder. Read the syllabus PDF at `<filename.pdf>` (in the same folder). Append every graded assignment as new rows. Use class code **XXX 101** (replace with the real code). `id = max(existing)+1`. Date format `YYYY-MM-DD`. Default `importance = 1`; use `3` for midterms, finals, and major projects; use `1` for quizzes and homework. `status = pending`, leave `completed_at` empty, copy meaningful one-liners into `notes` (empty otherwise). Don't duplicate anything already in the file. Write the updated CSV back.

## Repo layout

| File | Owner | Purpose |
|---|---|---|
| `index.html`, `styles.css` | Melka | Everything visible. Replace freely. |
| `app.js`, `tests.html` | Coby | Logic. Rarely changes. |
| `design-contract.md` | Coby | Stable interface between the two layers. |
| `README.md`, `for-melka.md`, `on-melkas-machine.md` | Coby | Docs. |
| `seed/tasks.csv` | Coby | Starter CSV. Copied to `~/Documents/semester-calendar/tasks.csv` during setup. |
