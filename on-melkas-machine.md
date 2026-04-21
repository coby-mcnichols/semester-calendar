# Coby's one-afternoon setup on Melka's laptop

Run this on her machine after the repo is live on GitHub Pages. ~30 minutes.

## 0. Confirm the browser

- [ ] Open Chrome or Microsoft Edge. Note which one she uses day-to-day; use that.
- [ ] If she uses Firefox or Safari, stop and tell her she needs Chrome/Edge for this to work. This is the one hard dependency in the spec.

## 1. Clone the repo + drop in the seed CSV

- [ ] Install **GitHub Desktop** on her machine. Sign her into GitHub (create the account if she doesn't have one — free).
- [ ] Add her as a collaborator on the `semester-calendar` repo (GitHub.com → repo → Settings → Collaborators). She needs push access so Claude can `git push` on her behalf.
- [ ] In GitHub Desktop: **File → Clone repository → URL** → paste the repo URL → set **Local path** to `Documents/semester-calendar`. The folder *is* the repo clone.
- [ ] Copy `seed/tasks.csv` from inside the cloned repo into the same folder: `Documents/semester-calendar/tasks.csv`. It's already gitignored — it lives next to the code but won't get committed.
- [ ] Open the CSV in Notepad. Confirm she can read it.
- [ ] Open a terminal, `cd` into `Documents/semester-calendar`, run `git push`. It should succeed with no prompt (GitHub Desktop stored her credentials on sign-in). Resolve any credential prompt now so she never hits one later.

## 2. Install + configure Claude Desktop

- [ ] Install Claude Desktop from claude.ai/desktop. Sign her in.
- [ ] Configure **two** MCP servers in Claude Desktop's config JSON. Path:
  - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
  - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

  Servers:
  - **`filesystem`** — scoped to `Documents/semester-calendar/`. Gives Claude read/write access to `tasks.csv`, `index.html`, and `styles.css`.
  - **A shell-capable server** (e.g. `desktop-commander`) — lets Claude run `git add / commit / push` when Melka approves a redesign.

  Example fragment:
  ```json
  {
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\<her>\\Documents\\semester-calendar"]
      },
      "shell": {
        "command": "npx",
        "args": ["-y", "@wonderwhy-er/desktop-commander"]
      }
    }
  }
  ```
- [ ] In Claude Desktop settings, flip the shell-server tools to **auto-approve**. Rationale: this repo has no secrets, no production users, and the worst-case damage is a broken page she reverts in one sentence. Save her the confirmation clicks.
- [ ] Restart Claude Desktop. Confirm both MCPs show connected (icon in the input bar).
- [ ] Smoke test:
  - *"Read `tasks.csv` and tell me how many tasks are in it."* → count.
  - *"Run `git status` in the project folder."* → clean working tree.

  If either fails, the MCP is not wired up.

## 3. Bookmark the live site

- [ ] Open her browser, navigate to the GitHub Pages URL.
- [ ] Click **Reconnect**, pick `Documents/semester-calendar/tasks.csv`. Grant permission.
- [ ] Add a test task via the UI. Confirm it lands in the CSV.
- [ ] Delete the test task. Confirm it's gone from the CSV.
- [ ] **Kill the "Reconnect every session" friction.** In Chrome: open settings → search for "file" → find **File editing** (or **File system access**) under site permissions → add the Pages URL to the *allowed* list. On Edge the setting has the same name under `edge://settings/content`. After this, her stored permission survives across sessions — she clicks Reconnect once, grants, and it sticks.
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
