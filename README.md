# OblivianOS

Cinematic web desktop. **All of the code I made it.** — [amaanallen2016-web](https://github.com/amaanallen2016-web)

Open this on a **school Chromebook** without Node. This is a static site.

## Chromebook / school computer

1. Open [amaanallen2016-web/OblivianDesktop](https://github.com/amaanallen2016-web/OblivianDesktop)
2. Click **Code → Download ZIP**
3. Extract the ZIP in Files
4. Open **`index.html`** (double-click)

GitHub Pages (after the first deploy):

`https://amaanallen2016-web.github.io/OblivianDesktop/`

## Where every file goes

Put these paths **exactly** like this in the GitHub repo root (not inside an extra folder):

| Path | What it is |
|---|---|
| `index.html` | **The file you open.** Boot screen, Linux/OS desktop shell |
| `css/os.css` | CineOS look: glass, HUD, dock, windows |
| `js/os.js` | Boot logs, window manager, dock, live wallpapers, spotlight |
| `js/apps.js` | Every app: Downloader, Arcade, Pulse, Proxy, music, PS4, Doblox, settings |
| `js/games.js` | 2,847-title catalog + real playable web URLs |
| `js/pulse.js` | Text-code chat (same Chromebook + live PeerJS when hosted) |
| `favicon.svg` | Tab icon |
| `.nojekyll` | Lets GitHub Pages serve `js/` and `css/` |
| `.github/workflows/pages.yml` | Auto-publishes GitHub Pages |
| `README.md` | This file |

Do **not** rename folders. `index.html` loads `css/os.css` and `js/*.js` with relative paths.

## Boot

1. Kernel log
2. Choose **Linux** (top bar + side dash) or **OS** (menu bar + bottom dock)
3. Desktop with live GIF-style canvas wallpapers

## Apps

- **App Downloader** — RDR2, Mortal Kombat, Roblox, Pocket Mortys pinned at the top, then the catalog
- **Arcade** — real browser games (Minecraft Classic, Eaglercraft, Slope, Krunker, 1v1.LOL, Subway Surfers) plus an **offline pack** (Snake, 2048, Breakout, Drift) that still works if game sites are blocked
- **Pulse** — claim any text code, search a friend’s code, chat. Live across devices when the site is hosted (GitHub Pages). Same-device chat always works
- **Proxy** — search/URL through a translate tunnel
- **Oblivian FM / YouTube / Spotify / TikTok**
- **Doblox** + **PlayStation** hubs
- **Tunnel (VPN UI)**, **Settings** (live wallpapers), **Terminal**, **Files**, **Calculator**

## What cannot be a real PS4 / full Linux kernel in a browser

A Chromebook cannot run the Linux kernel fork or a real PS4 emulator from `index.html`. Those repos stay linked as forks. This repo is the **playable web OS**.

## Credit

All of the code I made it.

Forks:

- https://github.com/amaanallen2016-web/OBLIVIAN-OS
- https://github.com/amaanallen2016-web/Ps4-sdk
- https://github.com/amaanallen2016-web/Doblox-Uncopylocked-Games
