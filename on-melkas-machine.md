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
- [ ] Set global git identity so Claude's commits carry her name:
  ```
  git config --global user.name "Her Name"
  git config --global user.email "her-github-email@example.com"
  ```

## 2. Install Claude Code + a desktop shortcut

Claude Code is the CLI version of Claude with native filesystem and shell access — no MCP setup, no JSON config, no Node plumbing. She points it at her calendar folder; it can read files, write files, and run git directly.

- [ ] Install Claude Code on her machine. Current install link: https://claude.com/code. Use the native installer (bundles dependencies).
- [ ] Sign her into her Anthropic account (same login as claude.ai — create one if needed).
- [ ] Create a desktop shortcut she can double-click to launch it in the right folder:
  - Right-click desktop → **New → Shortcut**.
  - Target: `cmd.exe /k claude`
  - Start in: `C:\Users\<her>\Documents\semester-calendar`
  - Name it **Claude — Calendar**.
- [ ] Double-click the shortcut. A terminal opens; Claude Code starts up inside `Documents/semester-calendar`.
- [ ] **First-run permissions.** Claude Code prompts to trust the directory, then asks per-tool (file read, file write, bash). Pick **"always allow in this directory"** for each. These grants are remembered — she never sees the prompts again here.
- [ ] Smoke test inside the session:
  - *"How many tasks are in tasks.csv?"* → a count.
  - *"Run `git status`."* → clean working tree.
- [ ] Type `/exit` or close the terminal window when done.

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
