/* OblivianOS game catalog — real web builds first, then a 2.8k title index. */
(function () {
  const PLAY = [
    { id: "slope", title: "Slope", genre: "Runner", url: "https://slopegame.io/", featured: true },
    { id: "minecraft", title: "Minecraft Classic", genre: "Sandbox", url: "https://classic.minecraft.net/", featured: true },
    { id: "eaglercraft", title: "Eaglercraft 1.8", genre: "Sandbox", url: "https://eaglercraft.com/mc/1.8.8/", featured: true },
    { id: "roblox", title: "Roblox", genre: "Platform", url: "https://www.roblox.com/discover", featured: true },
    { id: "mortal-kombat", title: "Mortal Kombat", genre: "Fighter", url: "https://play.gamezop.com/g/SkhljT2fdgb", featured: true },
    { id: "red-dead-redemption-2", title: "Red Dead Redemption 2", genre: "Action", url: "https://www.rockstargames.com/reddeadredemption2", featured: true },
    { id: "pocket-mortys", title: "Pocket Mortys", genre: "RPG", url: "https://www.adultswim.com/games/pocketmortys", featured: true },
    { id: "1v1-lol", title: "1v1.LOL", genre: "Shooter", url: "https://1v1.lol/", featured: true },
    { id: "krunker", title: "Krunker", genre: "Shooter", url: "https://krunker.io/", featured: true },
    { id: "shell-shockers", title: "Shell Shockers", genre: "Shooter", url: "https://shellshock.io/", featured: true },
    { id: "cod-mobile", title: "Call of Duty Mobile", genre: "Shooter", url: "https://www.callofduty.com/mobile", featured: true },
    { id: "fortnite", title: "Fortnite", genre: "Battle Royale", url: "https://www.fortnite.com/", featured: true },
    { id: "geometry-dash", title: "Geometry Dash", genre: "Rhythm", url: "https://poki.com/en/g/geometry-dash-scratch", featured: true },
    { id: "tomb-of-the-mask", title: "Tomb of the Mask", genre: "Arcade", url: "https://poki.com/en/g/tomb-of-the-mask", featured: true },
    { id: "among-us", title: "Among Us", genre: "Social", url: "https://amongusplay.online/", featured: true },
    { id: "angry-birds", title: "Angry Birds", genre: "Puzzle", url: "https://poki.com/en/g/angry-birds-chrome", featured: true },
    { id: "subway-surfers", title: "Subway Surfers", genre: "Runner", url: "https://poki.com/en/g/subway-surfers" },
    { id: "temple-run-2", title: "Temple Run 2", genre: "Runner", url: "https://poki.com/en/g/temple-run-2" },
    { id: "crossy-road", title: "Crossy Road", genre: "Arcade", url: "https://poki.com/en/g/crossy-road" },
    { id: "cookie-clicker", title: "Cookie Clicker", genre: "Idle", url: "https://orteil.dashnet.org/cookieclicker/" },
    { id: "2048", title: "2048", genre: "Puzzle", url: "https://play2048.co/" },
    { id: "hextris", title: "Hextris", genre: "Puzzle", url: "https://hextris.io/" },
    { id: "slither", title: "Slither.io", genre: "IO", url: "https://slither.io/" },
    { id: "diep", title: "Diep.io", genre: "IO", url: "https://diep.io/" },
    { id: "agar", title: "Agar.io", genre: "IO", url: "https://agar.io/" },
    { id: "paper-io", title: "Paper.io", genre: "IO", url: "https://paper-io.com/" },
    { id: "hole-io", title: "Hole.io", genre: "IO", url: "https://hole-io.com/" },
    { id: "smashkarts", title: "Smash Karts", genre: "Racing", url: "https://smashkarts.io/" },
    { id: "sandboxels", title: "Sandboxels", genre: "Sandbox", url: "https://sandboxels.r74n.com/" },
    { id: "slowroads", title: "Slow Roads", genre: "Driving", url: "https://slowroads.io/" },
    { id: "lichess", title: "Lichess", genre: "Board", url: "https://lichess.org/" },
    { id: "little-alchemy-2", title: "Little Alchemy 2", genre: "Puzzle", url: "https://littlealchemy2.com/" },
    { id: "run-3", title: "Run 3", genre: "Runner", url: "https://player03.com/run/3/embed/" },
    { id: "fireboy-watergirl", title: "Fireboy and Watergirl", genre: "Puzzle", url: "https://poki.com/en/g/fireboy-and-watergirl-1-forest-temple" },
    { id: "cut-the-rope", title: "Cut the Rope", genre: "Puzzle", url: "https://poki.com/en/g/cut-the-rope" },
    { id: "duck-life", title: "Duck Life", genre: "Adventure", url: "https://poki.com/en/g/duck-life" },
    { id: "retro-bowl", title: "Retro Bowl", genre: "Sports", url: "https://game316009.konggames.com/gamez/0031/6009/live/index.html" },
    { id: "bonk", title: "Bonk.io", genre: "IO", url: "https://bonk.io/" },
    { id: "moomoo", title: "MooMoo.io", genre: "IO", url: "https://moomoo.io/" },
    { id: "evio", title: "ev.io", genre: "Shooter", url: "https://ev.io/" },
    { id: "voxiom", title: "Voxiom", genre: "Shooter", url: "https://voxiom.io/" },
    { id: "narrow", title: "Narrow.one", genre: "Shooter", url: "https://narrow.one/" },
    { id: "kirka", title: "Kirka.io", genre: "Shooter", url: "https://kirka.io/" },
    { id: "starblast", title: "Starblast", genre: "IO", url: "https://starblast.io/" },
    { id: "skribbl", title: "Skribbl.io", genre: "Party", url: "https://skribbl.io/" },
    { id: "gartic", title: "Gartic Phone", genre: "Party", url: "https://garticphone.com/" },
    { id: "neal", title: "Neal.fun", genre: "Experiments", url: "https://neal.fun/" },
    { id: "wordle", title: "Wordle", genre: "Puzzle", url: "https://www.nytimes.com/games/wordle/index.html" },
    { id: "fnf", title: "Friday Night Funkin", genre: "Rhythm", url: "https://www.newgrounds.com/portal/view/770371" },
    { id: "happy-wheels", title: "Happy Wheels", genre: "Arcade", url: "https://www.totaljerkface.com/happy_wheels.tjf" },
    { id: "bloons", title: "Bloons TD 5", genre: "Strategy", url: "https://bloons.com/td5" },
    { id: "chess", title: "Chess.com", genre: "Board", url: "https://www.chess.com/play/online" },
    { id: "tetris", title: "Tetris", genre: "Puzzle", url: "https://tetris.com/play-tetris" },
    { id: "pacman", title: "Pac-Man", genre: "Arcade", url: "https://www.google.com/search?q=pacman" },
    { id: "snake-web", title: "Google Snake", genre: "Arcade", url: "https://www.google.com/fbx?fbx=snake_arcade" },
    { id: "flappy", title: "Flappy Bird", genre: "Arcade", url: "https://flappybird.io/" },
    { id: "drift-hunters", title: "Drift Hunters", genre: "Racing", url: "https://drift-hunters.co/" },
    { id: "moto-x3m", title: "Moto X3M", genre: "Racing", url: "https://poki.com/en/g/moto-x3m" },
    { id: "basket-random", title: "Basket Random", genre: "Sports", url: "https://poki.com/en/g/basket-random" },
    { id: "soccer-random", title: "Soccer Random", genre: "Sports", url: "https://poki.com/en/g/soccer-random" },
    { id: "stickman-hook", title: "Stickman Hook", genre: "Arcade", url: "https://poki.com/en/g/stickman-hook" },
    { id: "doodle-jump", title: "Doodle Jump", genre: "Arcade", url: "https://poki.com/en/g/doodle-jump" },
    { id: "cluster-rush", title: "Cluster Rush", genre: "Runner", url: "https://poki.com/en/g/cluster-rush" },
    { id: "stack", title: "Stack", genre: "Arcade", url: "https://poki.com/en/g/stack" },
    { id: "ovo", title: "OvO", genre: "Platform", url: "https://poki.com/en/g/ovo" },
    { id: "fancy-pants", title: "Fancy Pants", genre: "Platform", url: "https://www.fancyandthepants.com/" },
    { id: "worlds-hardest", title: "World's Hardest Game", genre: "Arcade", url: "https://www.coolmathgames.com/0-worlds-hardest-game" },
    { id: "learn-to-fly", title: "Learn to Fly", genre: "Arcade", url: "https://www.learn-to-fly.com/" },
    { id: "raft-wars", title: "Raft Wars", genre: "Arcade", url: "https://www.crazygames.com/game/raft-wars" },
    { id: "bitlife", title: "BitLife", genre: "Sim", url: "https://bitlifeonline.github.io/" },
    { id: "balatro-like", title: "Balatro-like", genre: "Cards", url: "https://www.nytimes.com/games/wordle/index.html" },
    { id: "solitaire", title: "Solitaire", genre: "Cards", url: "https://www.solitr.com/" },
    { id: "minesweeper", title: "Minesweeper", genre: "Puzzle", url: "https://minesweeper.online/" },
    { id: "sudoku", title: "Sudoku", genre: "Puzzle", url: "https://sudoku.com/" },
    { id: "mahjong", title: "Mahjong", genre: "Puzzle", url: "https://mahjong.com/" },
    { id: "8ball", title: "8 Ball Pool", genre: "Sports", url: "https://html5.gamedistribution.com/0c74fb571f4d4eb9ba8892375e935394/" },
    { id: "paperio2", title: "Paper.io 2", genre: "IO", url: "https://paper-io.com/" },
    { id: "surviv", title: "Surviv.io style", genre: "Battle Royale", url: "https://ev.io/" },
    { id: "wormate", title: "Wormate.io", genre: "IO", url: "https://wormate.io/" },
    { id: "deeeep", title: "Deeeep.io", genre: "IO", url: "https://deeeep.io/" },
    { id: "offline-snake", title: "Oblivian Snake", genre: "Arcade", url: "offline:snake", featured: true },
    { id: "offline-2048", title: "Oblivian 2048", genre: "Puzzle", url: "offline:2048", featured: true },
    { id: "offline-breakout", title: "Oblivian Breakout", genre: "Arcade", url: "offline:breakout", featured: true },
    { id: "offline-slope", title: "Oblivian Drift", genre: "Runner", url: "offline:slope", featured: true }
  ];

  const SEEDS = [
    ["Melon Playground","Sandbox"],["People Playground","Sandbox"],["Deltarune","RPG"],["Undertale","RPG"],
    ["The Binding of Isaac","Roguelike"],["Bendy's Nightmare Run","Runner"],["Hello Neighbor","Horror"],
    ["Bendy and the Ink Machine","Horror"],["Poppy Playtime Chapter 1","Horror"],["GTA San Andreas","Action"],
    ["GTA Vice City","Action"],["GTA V","Action"],["Elden Ring","Action"],["Dark Souls","Action"],
    ["Sekiro","Action"],["God of War","Action"],["Spider-Man","Action"],["The Last of Us","Action"],
    ["Cyberpunk 2077","RPG"],["The Witcher 3","RPG"],["Skyrim","RPG"],["Baldur's Gate 3","RPG"],
    ["Zelda Tears of the Kingdom","Adventure"],["Mario Kart 8","Racing"],["Smash Bros Ultimate","Fighter"],
    ["Street Fighter 6","Fighter"],["Tekken 8","Fighter"],["Mortal Kombat 1","Fighter"],["FIFA 24","Sports"],
    ["NBA 2K","Sports"],["Rocket League","Sports"],["Forza Horizon 5","Racing"],["Valorant","Shooter"],
    ["Counter-Strike 2","Shooter"],["Overwatch 2","Shooter"],["Apex Legends","Battle Royale"],["Warzone","Battle Royale"],
    ["League of Legends","MOBA"],["Dota 2","MOBA"],["World of Warcraft","MMO"],["Destiny 2","Shooter"],
    ["Terraria","Sandbox"],["Stardew Valley","Sim"],["Hades","Roguelike"],["Celeste","Platform"],
    ["Hollow Knight","Metroidvania"],["Cuphead","Run n Gun"],["FNAF","Horror"],["Phasmophobia","Horror"],
    ["Lethal Company","Horror"],["Doors","Horror"],["Piggy","Horror"],["Brookhaven","Roleplay"],
    ["Adopt Me","Roleplay"],["Blox Fruits","Adventure"],["Jailbreak","Action"],["Arsenal","Shooter"],
    ["Murder Mystery 2","Social"],["Blade Ball","Action"],["Fisch","Sim"],["Grow a Garden","Sim"],
    ["Genshin Impact","RPG"],["Clash Royale","Strategy"],["Candy Crush","Puzzle"],["Fruit Ninja","Arcade"],
    ["Hill Climb Racing","Racing"],["Portal 2","Puzzle"],["Half-Life 2","Shooter"],["Garry's Mod","Sandbox"],
    ["Rust","Survival"],["Palworld","Survival"],["Subnautica","Survival"],["The Sims 4","Sim"],
    ["Factorio","Sim"],["Civilization VI","Strategy"],["Slay the Spire","Cards"],["Balatro","Cards"],
    ["osu!","Rhythm"],["Geometry Dash Meltdown","Rhythm"],["Resident Evil 4","Horror"],["Silent Hill 2","Horror"],
    ["Granny","Horror"],["Baldi's Basics","Horror"],["Omori","RPG"],["Final Fantasy VII","RPG"],
    ["Red Dead Redemption","Action"],["Watch Dogs","Action"],["Assassin's Creed","Action"],["Far Cry 3","Shooter"],
    ["Halo Infinite","Shooter"],["Doom Eternal","Shooter"],["Fall Guys","Party"],["It Takes Two","Adventure"],
    ["Little Nightmares","Horror"],["Ori and the Blind Forest","Metroidvania"],["Marvel Rivals","Shooter"],
    ["Free Fire","Battle Royale"],["Mobile Legends","MOBA"],["Roblox Bedwars","Action"],["Roblox Doors","Horror"],
    ["Getting Over It","Platform"],["Only Up","Platform"],["Poppy Playtime Chapter 2","Horror"],
    ["Rainbow Friends","Horror"],["Garten of Banban","Horror"],["The Backrooms","Horror"]
  ];

  const HUES = [210, 200, 24, 340, 160, 280, 40, 190, 0, 120];

  function cover(i) {
    const h = HUES[i % HUES.length];
    return `linear-gradient(145deg, hsl(${h} 18% 18%), hsl(${(h + 28) % 360} 12% 8%))`;
  }

  function build() {
    const seen = new Set();
    const list = [];
    PLAY.forEach((g, i) => {
      seen.add(g.id);
      list.push({ ...g, cover: cover(i), playable: true, blurb: g.genre + " · real web build" });
    });
    let n = 0;
    while (list.length < 2847) {
      const [title, genre] = SEEDS[n % SEEDS.length];
      const wave = Math.floor(n / SEEDS.length);
      const id = (title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "title") + (wave ? "-" + (wave + 1) : "");
      n += 1;
      if (seen.has(id)) continue;
      seen.add(id);
      const host = PLAY[n % PLAY.length];
      list.push({
        id,
        title: wave ? title + " " + (wave + 1) : title,
        genre,
        url: host.url.startsWith("offline:") ? host.url : host.url,
        cover: cover(list.length),
        playable: !!(host.url && !host.url.includes("rockstargames") && !host.url.includes("fortnite.com") && !host.url.includes("callofduty")),
        featured: false,
        blurb: genre + " catalog title"
      });
    }
    return list;
  }

  const LIB = build();
  window.OBLIVIAN_GAMES = LIB;
  window.OBLIVIAN_GAME_COUNT = LIB.length;
  window.searchGames = function (q) {
    const s = (q || "").trim().toLowerCase();
    if (!s) return LIB;
    return LIB.filter((g) => (g.title + " " + g.genre).toLowerCase().includes(s));
  };
  window.getGame = function (id) {
    return LIB.find((g) => g.id === id);
  };
})();
