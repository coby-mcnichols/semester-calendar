# Your semester calendar — how to use it

Hi. This is a web calendar I made for you. It lives at a bookmark on your laptop. It reads and writes a single file — `tasks.csv` — that sits in `Documents/semester-calendar/` on your machine. No accounts, no sync, no login. Nothing leaves your laptop.

This guide is everything you need. Browse the sections below; the short answer to "how do I X" is probably in one of them.

---

## 1. Opening the calendar

1. Click the **Semester Calendar** bookmark in Chrome (or Edge). It's in your bookmarks bar.
2. **First time ever:** click **Reconnect**, pick `Documents/semester-calendar/tasks.csv`, click **Allow** when Chrome asks.
3. **After that:** if the status ever reads **Disconnected**, click **Reconnect** — one click, no file picker. Chrome remembers which file.
4. Status flips to **Connected**. Your tasks appear on the calendar.

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

1. Click your **Preview** bookmark (next to Semester Calendar on your bookmarks bar). Keep that tab visible.
2. Double-click the **Claude — Calendar** shortcut on your desktop. A terminal opens and Claude starts up inside your calendar folder.
3. Paste the **Redesign prompt** from the sticky note. At the very end, write what vibe you want. Examples: *"warm pastels, serif class labels, rounded everything, gentle shadow."* *"strict grid, mono font, charcoal-on-cream, no color except importance."*
4. Claude rewrites `index.html` and `styles.css` on disk. Switch to the Preview tab and press **F5**. The new design renders — toolbar, calendar grid, form, colors, fonts — live.
5. Ask for tweaks: *"lighter pink"*, *"more space between toolbar buttons"*, *"try a serif for titles."* After each round, F5 the Preview tab.
6. When you love it, tell Claude **"ship it."** Claude commits and pushes to GitHub.
7. Wait ~30 seconds for GitHub Pages to rebuild, then refresh your **Semester Calendar** bookmark. Click Reconnect if it asks. Add a task, complete it, drag one — if all three still work, the new design is live with real data.

> **About the Preview tab:** it renders the design from your local files with ten sample tasks baked in, so you can see how events look across classes and importance levels. Changes you make there (adding, completing, dragging) don't save anywhere — they reset on refresh. The live bookmark is where real data goes in.

### The one rule

Keep the IDs and classes from the design contract (`design-contract.md`). The redesign prompt already tells Claude to preserve them — don't edit that part out. If Claude strips `#calendar` or the **Add task** button, the page will look fine but nothing will work.

### If a ship goes wrong

In the same Claude session: **"revert the last commit and push."** It'll roll back the same way it shipped. Refresh after ~30 seconds and you're back to the previous design. Then describe what went wrong and try again.

---

## 4. When you get a new syllabus

1. Drop the syllabus PDF into your `Documents/semester-calendar/` folder.
2. Double-click the **Claude — Calendar** shortcut.
3. Paste the **Syllabus import prompt** from your desktop sticky note. Edit the class code (`XXX 101`) to match the real one — e.g., `BIOL 220`. Tell Claude the PDF filename.
4. Claude reads your existing `tasks.csv`, reads the syllabus, appends new rows, writes the CSV back. It skips duplicates.
5. Switch to Chrome, refresh the calendar tab. The new assignments are there.

Spot-check a few rows. If an importance level looks off (a quiz marked as critical, say), click the event and adjust — or ask Claude *"set the importance of X to 1"* and it'll fix the CSV.

---

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| "Disconnected" won't go away | Click **Reconnect** — one click, it re-grants permission without asking you to pick the file again. If nothing happens, Chrome blocked the site; open Chrome settings, search for "File editing," add the calendar URL to the allowed list. |
| Changes don't appear in the CSV | Chrome usually prompts once for write permission. If you dismissed it, click **Reconnect** and grant it. |
| Calendar is empty but CSV has tasks | Open DevTools (F12), check the Console tab for errors. Most likely the CSV is malformed — double-click the Claude shortcut and ask Claude to fix the columns. |
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
