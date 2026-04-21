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
