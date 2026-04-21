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
