const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  pingTimeout: 90000,
  pingInterval: 20000,
  transports: ['websocket', 'polling'] // websocket first, polling fallback
});

app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────
// WORD CATEGORIES
// ─────────────────────────────────────────────
const CATEGORIES = {
  movies: {
    name: "🎬 Movies",
    items: [
      "The Avengers", "Titanic", "The Dark Knight", "Star Wars", "Jurassic Park",
      "Harry Potter", "The Lion King", "Forrest Gump", "Inception", "The Godfather",
      "Pulp Fiction", "The Matrix", "Interstellar", "The Lord of the Rings",
      "Gladiator", "Toy Story", "Finding Nemo", "WALL-E", "Up", "Frozen",
      "Moana", "Coco", "Encanto", "Black Panther", "Spider-Man",
      "Iron Man", "Captain America", "Thor", "Guardians of the Galaxy",
      "Doctor Strange", "The Silence of the Lambs", "Goodfellas",
      "Schindler's List", "Fight Club", "The Shawshank Redemption",
      "Mad Max: Fury Road", "Get Out", "A Quiet Place", "Parasite", "Joker",
      "Dune", "Top Gun: Maverick", "Avatar", "Bohemian Rhapsody", "La La Land",
      "Whiplash", "The Social Network", "The Wolf of Wall Street",
      "Django Unchained", "Inglourious Basterds", "No Country for Old Men",
      "Birdman", "The Grand Budapest Hotel", "Moonlight", "The Shape of Water",
      "Green Book", "Nomadland", "Everything Everywhere All at Once",
      "Oppenheimer", "Barbie", "Poor Things", "The Menu", "Glass Onion",
      "Knives Out", "Don't Look Up", "Bird Box", "Us", "Hereditary",
      "Midsommar", "It", "The Conjuring", "Halloween", "Scream",
      "Ghostbusters", "Men in Black", "Independence Day", "Armageddon",
      "Gravity", "The Martian", "Ad Astra", "Alien", "Aliens",
      "Terminator", "Back to the Future", "E.T. the Extra-Terrestrial",
      "Jaws", "Raiders of the Lost Ark", "Die Hard", "Home Alone",
      "The Truman Show", "American Beauty", "A Beautiful Mind",
      "The Departed", "Catch Me If You Can", "Saving Private Ryan",
      "Braveheart", "The Sixth Sense", "Memento", "Se7en", "Zodiac",
      "Gone Girl", "Prisoners", "Annihilation", "Black Swan",
      "Requiem for a Dream", "Pan's Labyrinth", "Life of Pi",
      "Cast Away", "The Revenant", "Dunkirk", "Tenet",
      "John Wick", "The Hunger Games", "Shrek", "The Incredibles",
      "Mean Girls", "The Hangover", "Superbad", "Crazy Rich Asians",
      "Grease", "Despicable Me", "Kung Fu Panda", "Ratatouille",
      "The Notebook", "A Star Is Born", "Elvis", "Casino Royale",
      "Mission: Impossible", "Good Will Hunting", "Dead Poets Society",
      "Shutter Island", "Blade Runner 2049", "Ready Player One",
      "The Breakfast Club", "Ferris Bueller's Day Off", "Legally Blonde",
      "Love Actually", "The Nightmare Before Christmas", "Coraline",
      "Monsters, Inc.", "Beauty and the Beast", "Mulan", "Tangled",
      "Zootopia", "Big Hero 6", "Rocky", "Arrival", "Train to Busan",
      "Ocean's Eleven", "Elf", "Anchorman", "The Fast and the Furious",
      "Step Brothers", "500 Days of Summer", "Clueless", "The Prestige",
      "Lilo & Stitch", "Spirited Away", "Princess Mononoke", "Your Name",
      "Uncut Gems", "The Lighthouse", "The Banshees of Inisherin"
    ]
  },

  tvShows: {
    name: "📺 TV Shows",
    items: [
      "Breaking Bad", "Game of Thrones", "Friends", "The Office", "Stranger Things",
      "The Crown", "Black Mirror", "Peaky Blinders", "Squid Game", "The Witcher",
      "Money Heist", "Narcos", "Ozark", "The Boys", "Succession",
      "Ted Lasso", "Euphoria", "Yellowstone", "The Mandalorian", "Cobra Kai",
      "Bridgerton", "Emily in Paris", "Sex Education", "Dark", "Mindhunter",
      "The Queen's Gambit", "Schitt's Creek", "Brooklyn Nine-Nine",
      "Grey's Anatomy", "This Is Us", "The Handmaid's Tale", "Better Call Saul",
      "Fargo", "True Detective", "Westworld", "Dexter", "House of Cards",
      "Seinfeld", "How I Met Your Mother", "Big Bang Theory", "Modern Family",
      "Parks and Recreation", "Community", "30 Rock", "Curb Your Enthusiasm",
      "It's Always Sunny in Philadelphia", "Rick and Morty", "BoJack Horseman",
      "Archer", "The Simpsons", "South Park", "Family Guy", "Futurama",
      "King of the Hill", "Avatar: The Last Airbender", "The Legend of Korra",
      "Attack on Titan", "Death Note", "Naruto", "One Piece", "Bleach",
      "Demon Slayer", "Jujutsu Kaisen", "My Hero Academia", "Hunter x Hunter",
      "One Punch Man", "Fullmetal Alchemist: Brotherhood", "Sword Art Online",
      "Dragon Ball Z", "Pokemon", "Gravity Falls", "Steven Universe",
      "Adventure Time", "Regular Show", "We Bare Bears", "American Dad",
      "Bob's Burgers", "Arrested Development", "Veep", "Silicon Valley",
      "Entourage", "The Sopranos", "The Wire", "Boardwalk Empire",
      "Mad Men", "Lost", "24", "Prison Break", "Heroes", "House",
      "Suits", "Homeland", "Mr. Robot", "Killing Eve", "Fleabag",
      "Downton Abbey", "The Great British Bake Off", "Love Island",
      "The Bachelor", "Survivor", "Big Brother", "Amazing Race",
      "RuPaul's Drag Race", "American Idol", "America's Got Talent",
      "Dancing with the Stars", "The Voice", "MasterChef", "Hell's Kitchen",
      "Wednesday", "The Last of Us", "House of the Dragon", "The Bear",
      "Severance", "Abbott Elementary", "Only Murders in the Building",
      "Yellowjackets", "Outer Banks", "Ginny & Georgia", "Never Have I Ever",
      "Elite", "Gossip Girl", "One Tree Hill", "Skins", "Shameless",
      "Desperate Housewives", "Sex and the City", "The Good Place", "New Girl",
      "Criminal Minds", "CSI", "Law & Order", "NCIS", "Sherlock",
      "The X-Files", "Supernatural", "Buffy the Vampire Slayer",
      "The Vampire Diaries", "Pretty Little Liars", "Riverdale",
      "Gilmore Girls", "That '70s Show", "Scrubs", "American Horror Story",
      "The Haunting of Hill House", "Invincible", "WandaVision", "Loki",
      "Andor", "The Expanse", "Firefly", "13 Reasons Why", "Atlanta",
      "Insecure", "Big Little Lies", "Mare of Easttown", "Slow Horses",
      "Industry", "The Rings of Power", "Star Trek: The Next Generation",
      "Battlestar Galactica", "Arcane", "Cyberpunk: Edgerunners",
      "Heartstopper", "Maid", "The Watcher", "Dahmer"
    ]
  },

  videoGames: {
    name: "🎮 Video Games",
    items: [
      "Minecraft", "Fortnite", "Among Us", "Roblox", "Grand Theft Auto V",
      "Call of Duty", "FIFA", "Halo", "The Legend of Zelda", "Super Mario Bros",
      "Pokemon", "Valorant", "Apex Legends", "League of Legends", "Dota 2",
      "Counter-Strike", "Overwatch", "Rocket League", "Fall Guys", "Warzone",
      "PUBG", "Sea of Thieves", "Subnautica", "Terraria", "Stardew Valley",
      "Animal Crossing", "Splatoon", "Super Smash Bros", "Mario Kart",
      "The Witcher 3", "Red Dead Redemption 2", "Cyberpunk 2077", "Elden Ring",
      "Dark Souls", "God of War", "The Last of Us", "Assassin's Creed",
      "Far Cry", "The Elder Scrolls V: Skyrim", "Fallout 4", "Mass Effect",
      "BioShock", "Portal", "Half-Life", "Team Fortress 2", "Left 4 Dead",
      "Borderlands", "Destiny 2", "World of Warcraft", "Final Fantasy VII",
      "Kingdom Hearts", "Metal Gear Solid", "Silent Hill", "Resident Evil",
      "Tomb Raider", "Uncharted", "Horizon Zero Dawn", "Death Stranding",
      "Marvel's Spider-Man", "Batman: Arkham Knight", "Mortal Kombat",
      "Street Fighter", "Tekken", "Forza Horizon", "Gran Turismo",
      "Need for Speed", "Tony Hawk's Pro Skater", "Guitar Hero", "Just Dance",
      "Wii Sports", "Tetris", "Pac-Man", "Donkey Kong", "Kirby",
      "Metroid", "Star Fox", "Fire Emblem", "Xenoblade Chronicles",
      "Bayonetta", "Pikmin", "DOOM", "Hades", "Celeste", "Hollow Knight",
      "Cuphead", "Undertale", "Ori and the Blind Forest", "Shovel Knight",
      "Five Nights at Freddy's", "Geometry Dash", "Clash of Clans",
      "Clash Royale", "Candy Crush", "Angry Birds", "Temple Run",
      "Subway Surfers", "Hearthstone", "Genshin Impact", "Honkai: Star Rail",
      "The Sims", "Baldur's Gate 3", "Sekiro: Shadows Die Twice",
      "Persona 5", "Nier: Automata", "Monster Hunter: World",
      "Dragon Age: Origins", "Crash Bandicoot", "Spyro the Dragon",
      "Ratchet & Clank", "Banjo-Kazooie", "Super Mario Odyssey",
      "Super Mario Galaxy", "Luigi's Mansion", "Paper Mario", "Mario Party",
      "Jak and Daxter", "Sly Cooper", "Fable", "Age of Empires",
      "Civilization", "StarCraft", "Diablo", "RuneScape",
      "Rainbow Six Siege", "Disco Elysium", "Valheim", "Little Nightmares",
      "Limbo", "Inside", "Okami", "Chrono Trigger", "Final Fantasy XIV",
      "Yakuza: Like a Dragon", "Dishonored", "Sifu", "Psychonauts",
      "Outer Wilds", "Return of the Obra Dinn", "Firewatch",
      "Helldivers 2", "Palworld", "NBA 2K", "WWE 2K", "Madden NFL"
    ]
  },

  gameCharacters: {
    name: "👾 Game Characters",
    items: [
      "Mario", "Luigi", "Princess Peach", "Bowser", "Yoshi", "Wario", "Waluigi",
      "Link", "Zelda", "Ganondorf", "Samus Aran", "Pikachu", "Charizard",
      "Mewtwo", "Lucario", "Gengar", "Snorlax", "Eevee", "Bulbasaur",
      "Master Chief", "Cortana", "Kratos", "Atreus", "Sonic the Hedgehog",
      "Tails", "Knuckles", "Shadow the Hedgehog", "Amy Rose", "Mega Man",
      "Pac-Man", "Lara Croft", "Nathan Drake", "Joel", "Ellie",
      "Arthur Morgan", "John Marston", "Trevor Philips", "Michael De Santa",
      "Commander Shepard", "Garrus Vakarian", "Geralt of Rivia", "Ciri",
      "Yennefer", "Triss Merigold", "V (Cyberpunk 2077)", "Johnny Silverhand",
      "The Dovahkiin", "Sora", "Cloud Strife", "Tifa Lockhart",
      "Aerith Gainsborough", "Sephiroth", "Zack Fair",
      "Ryu", "Ken", "Chun-Li", "M. Bison",
      "Sub-Zero", "Scorpion", "Kazuya Mishima", "Jin Kazama",
      "Ezio Auditore", "Altair", "Connor Kenway", "Bayek", "Kassandra",
      "Aloy", "Steve", "Creeper", "Herobrine", "Enderman",
      "Tracer", "Genji", "Hanzo", "D.Va", "Mercy", "Widowmaker",
      "Wraith", "Pathfinder", "Bloodhound", "Lifeline", "Bangalore",
      "Sans", "Toriel", "Papyrus", "Frisk",
      "The Knight (Hollow Knight)", "Hornet", "Zagreus",
      "Kirby", "Meta Knight", "King Dedede", "Doomguy",
      "Crash Bandicoot", "Spyro the Dragon", "Ratchet", "Clank",
      "Jak", "Daxter", "Sly Cooper", "Banjo", "Kazooie",
      "Donkey Kong", "Diddy Kong", "Rosalina", "Captain Toad",
      "Isabelle", "Tom Nook",
      "2B (Nier: Automata)", "9S", "A2",
      "Solid Snake", "Big Boss", "Raiden (Metal Gear)",
      "Leon S. Kennedy", "Jill Valentine", "Chris Redfield", "Claire Redfield",
      "Lady Dimitrescu", "Ethan Winters", "Pyramid Head",
      "Agent 47", "Sam Fisher",
      "Noctis Lucis Caelum", "Tidus", "Yuna", "Lightning (FFXIII)",
      "Joker (Persona 5)", "Ryuji Sakamoto", "Morgana",
      "Ichiban Kasuga", "Kazuma Kiryu",
      "Dante (Devil May Cry)", "Vergil", "Nero",
      "GLaDOS", "Chell", "Wheatley", "Gordon Freeman", "Alyx Vance",
      "Viktor (Arcane)", "Jinx (Arcane)", "Vi (Arcane)",
      "Ahri", "Yasuo", "Thresh", "Lux", "Teemo",
      "Denji (Chainsaw Man)", "Power (Chainsaw Man)",
      "Anya Forger", "Loid Forger", "Yor Forger",
      "Monika (DDLC)", "Amaterasu (Okami)"
    ]
  },

  athletes: {
    name: "⚽ Athletes",
    items: [
      "Cristiano Ronaldo", "Lionel Messi", "LeBron James", "Michael Jordan",
      "Serena Williams", "Tiger Woods", "Usain Bolt", "Muhammad Ali",
      "Pele", "Roger Federer", "Rafael Nadal", "Novak Djokovic",
      "Tom Brady", "Michael Phelps", "Simone Biles", "Neymar Jr.",
      "Kylian Mbappe", "Erling Haaland", "Kevin Durant", "Stephen Curry",
      "Giannis Antetokounmpo", "Luka Doncic", "Nikola Jokic", "Patrick Mahomes",
      "Ronaldinho", "Zinedine Zidane", "David Beckham", "Wayne Rooney",
      "Thierry Henry", "Andres Iniesta", "Xavi", "Roberto Carlos",
      "Zlatan Ibrahimovic", "Didier Drogba", "Mohamed Salah", "Sadio Mane",
      "Kevin De Bruyne", "Harry Kane", "Virgil van Dijk", "Bukayo Saka",
      "Jude Bellingham", "Phil Foden", "Marcus Rashford", "Jack Grealish",
      "Kobe Bryant", "Shaquille O'Neal", "Magic Johnson", "Larry Bird",
      "Kareem Abdul-Jabbar", "Wilt Chamberlain", "Bill Russell", "Charles Barkley",
      "Scottie Pippen", "Dennis Rodman", "Allen Iverson", "Dwyane Wade",
      "Dirk Nowitzki", "Tim Duncan", "Steve Nash", "Yao Ming", "Hakeem Olajuwon",
      "Babe Ruth", "Mickey Mantle", "Willie Mays", "Hank Aaron",
      "Derek Jeter", "Ken Griffey Jr.", "Barry Bonds", "Jackie Robinson",
      "Wayne Gretzky", "Sidney Crosby", "Alexander Ovechkin", "Mario Lemieux",
      "Gordie Howe", "Bobby Orr", "Patrick Roy", "Martin Brodeur",
      "Conor McGregor", "Jon Jones", "Anderson Silva", "Georges St-Pierre",
      "Floyd Mayweather", "Manny Pacquiao", "Mike Tyson", "Oscar De La Hoya",
      "Ronda Rousey", "Amanda Nunes", "Israel Adesanya", "Dustin Poirier",
      "Jerry Rice", "Joe Montana", "Jim Brown", "Walter Payton",
      "Barry Sanders", "Lawrence Taylor", "Peyton Manning",
      "Aaron Rodgers", "Lamar Jackson", "Josh Allen",
      "Vinicius Jr.", "Pedri", "Gavi", "Rodri", "Lamine Yamal",
      "Son Heung-min", "Bruno Fernandes", "Trent Alexander-Arnold",
      "Robert Lewandowski", "Karim Benzema",
      "Jayson Tatum", "Jaylen Brown", "Devin Booker", "Donovan Mitchell",
      "Ja Morant", "Trae Young", "Zion Williamson", "Victor Wembanyama",
      "Anthony Davis", "Jimmy Butler", "Joel Embiid", "James Harden",
      "Kawhi Leonard", "Caitlin Clark", "Angel Reese", "A'ja Wilson",
      "Naomi Osaka", "Coco Gauff", "Emma Raducanu", "Iga Swiatek",
      "Carlos Alcaraz", "Jannik Sinner", "Andy Murray",
      "Max Verstappen", "Lewis Hamilton", "Charles Leclerc", "Lando Norris",
      "Eliud Kipchoge", "Noah Lyles", "Sha'Carri Richardson",
      "Sydney McLaughlin-Levrone", "Mondo Duplantis", "Leon Marchand",
      "Katie Ledecky", "Caeleb Dressel",
      "Travis Kelce", "Justin Jefferson", "Tyreek Hill", "Ja'Marr Chase",
      "Jalen Hurts", "Joe Burrow", "Dak Prescott", "Christian McCaffrey",
      "Saquon Barkley", "Khabib Nurmagomedov", "Canelo Alvarez",
      "Tyson Fury", "Anthony Joshua", "Oleksandr Usyk",
      "Virat Kohli", "Ben Stokes", "MS Dhoni", "Rohit Sharma",
      "Rory McIlroy", "Jon Rahm", "Scottie Scheffler"
    ]
  },

  musicians: {
    name: "🎵 Musicians",
    items: [
      "Taylor Swift", "Drake", "Beyonce", "Jay-Z", "Eminem", "Kanye West",
      "Rihanna", "Ed Sheeran", "Adele", "Bruno Mars", "The Weeknd",
      "Billie Eilish", "Ariana Grande", "Dua Lipa", "Harry Styles",
      "Justin Bieber", "Lady Gaga", "Katy Perry", "Nicki Minaj", "Cardi B",
      "Post Malone", "Travis Scott", "Bad Bunny", "J Balvin", "Daddy Yankee",
      "Shakira", "Jennifer Lopez", "Madonna", "Michael Jackson", "Prince",
      "Elvis Presley", "Frank Sinatra", "John Lennon", "Paul McCartney",
      "Bob Dylan", "David Bowie", "Freddie Mercury", "Kurt Cobain",
      "Jimi Hendrix", "Jim Morrison", "Mick Jagger", "Bruce Springsteen",
      "Elton John", "Billy Joel", "Stevie Wonder", "Marvin Gaye",
      "Aretha Franklin", "Whitney Houston", "Celine Dion", "Mariah Carey",
      "Dolly Parton", "Johnny Cash", "Willie Nelson", "Garth Brooks",
      "Sam Smith", "Shawn Mendes", "Charlie Puth", "Khalid", "Lizzo",
      "Olivia Rodrigo", "Doja Cat", "SZA", "Kendrick Lamar", "J. Cole",
      "Lil Wayne", "Snoop Dogg", "Dr. Dre", "Ice Cube", "Tupac Shakur",
      "The Notorious B.I.G.", "Nas", "Wu-Tang Clan", "Run-DMC", "LL Cool J",
      "BTS", "BLACKPINK", "EXO", "Stray Kids", "TWICE",
      "Metallica", "Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains",
      "Red Hot Chili Peppers", "Foo Fighters", "Linkin Park", "Green Day",
      "Blink-182", "Fall Out Boy", "Panic! at the Disco", "My Chemical Romance",
      "Twenty One Pilots", "Imagine Dragons", "Coldplay", "Radiohead",
      "The Beatles", "The Rolling Stones", "Led Zeppelin", "Pink Floyd",
      "Queen", "AC/DC", "Fleetwood Mac", "Eagles", "ABBA", "Bee Gees",
      "Daft Punk", "The Chainsmokers", "Marshmello", "Calvin Harris",
      "Avicii", "David Guetta", "Tiesto", "Martin Garrix", "Zedd",
      "Alicia Keys", "John Legend", "H.E.R.", "Jazmine Sullivan",
      "Sabrina Carpenter", "Chappell Roan", "Charli XCX", "Troye Sivan",
      "Selena Gomez", "Miley Cyrus", "Halsey", "Lorde", "Lana Del Rey",
      "Childish Gambino", "Frank Ocean", "Tyler the Creator", "Mac Miller",
      "Juice WRLD", "Future", "Lil Baby", "Gunna", "Polo G", "Rod Wave",
      "Megan Thee Stallion", "Summer Walker", "Jhene Aiko", "Kehlani",
      "Anderson Paak", "Silk Sonic",
      "Arctic Monkeys", "The 1975", "Gorillaz", "Tame Impala",
      "Paramore", "Bring Me the Horizon", "Sleep Token",
      "Rex Orange County", "Hozier", "Lewis Capaldi", "George Ezra",
      "Phoebe Bridgers", "boygenius", "Mitski", "beabadoobee",
      "Rina Sawayama", "Caroline Polachek",
      "NewJeans", "aespa", "IVE", "Le Sserafim", "ENHYPEN",
      "Peso Pluma", "Feid", "Karol G", "Rosalia",
      "Central Cee", "Dave", "Stormzy", "Little Simz",
      "Ice Spice", "GloRilla", "Doechii"
    ]
  },

  actors: {
    name: "🎭 Actors & Actresses",
    items: [
      "Leonardo DiCaprio", "Tom Hanks", "Meryl Streep", "Dwayne Johnson",
      "Robert Downey Jr.", "Scarlett Johansson", "Chris Evans", "Chris Hemsworth",
      "Chris Pratt", "Mark Ruffalo", "Samuel L. Jackson", "Ryan Reynolds",
      "Brad Pitt", "Johnny Depp", "Will Smith", "Denzel Washington",
      "Morgan Freeman", "Al Pacino", "Robert De Niro", "Jack Nicholson",
      "Marlon Brando", "Clint Eastwood", "Harrison Ford", "Tom Cruise",
      "Keanu Reeves", "Jim Carrey", "Robin Williams", "Eddie Murphy",
      "Adam Sandler", "Russell Crowe", "Hugh Jackman", "Christian Bale",
      "Matt Damon", "Ben Affleck", "George Clooney", "Angelina Jolie",
      "Jennifer Aniston", "Sandra Bullock", "Julia Roberts", "Reese Witherspoon",
      "Charlize Theron", "Cate Blanchett", "Kate Winslet", "Nicole Kidman",
      "Emma Stone", "Jennifer Lawrence", "Natalie Portman", "Keira Knightley",
      "Amy Adams", "Jessica Chastain", "Viola Davis", "Octavia Spencer",
      "Lupita Nyong'o", "Halle Berry", "Zendaya", "Florence Pugh",
      "Margot Robbie", "Ana de Armas", "Pedro Pascal", "Oscar Isaac",
      "Timothee Chalamet", "Tom Holland", "Jacob Elordi", "Austin Butler",
      "Andrew Garfield", "Idris Elba", "Michael B. Jordan", "Daniel Kaluuya",
      "Chadwick Boseman", "Anthony Mackie", "Paul Rudd", "Jeremy Renner",
      "Benedict Cumberbatch", "Tilda Swinton", "Rachel McAdams",
      "Saoirse Ronan", "Anya Taylor-Joy", "Sydney Sweeney", "Hunter Schafer",
      "Millie Bobby Brown", "Jenna Ortega", "Sadie Sink",
      "Gal Gadot", "Brie Larson", "Tessa Thompson", "Simu Liu", "Awkwafina",
      "Ali Wong", "Ken Jeong", "Steven Yeun", "John Cho",
      "Jason Momoa", "Vin Diesel", "Michelle Rodriguez",
      "Tobey Maguire", "Kirsten Dunst", "Willem Dafoe", "Alfred Molina",
      "Jamie Foxx", "Marisa Tomei", "Jon Favreau",
      "Cillian Murphy", "Paul Mescal", "Barry Keoghan", "Andrew Scott",
      "Jeremy Allen White", "Michelle Yeoh", "Ke Huy Quan", "Jamie Lee Curtis",
      "Carey Mulligan", "Olivia Colman", "Emma Thompson",
      "Helena Bonham Carter", "Gary Oldman", "Ian McKellen", "Patrick Stewart",
      "Anthony Hopkins", "Colin Firth", "Hugh Grant", "Ralph Fiennes",
      "Daniel Craig", "Judi Dench", "Christopher Walken", "Jeff Bridges",
      "Joaquin Phoenix", "Jason Statham", "Liam Neeson",
      "Bruce Willis", "Sylvester Stallone", "Arnold Schwarzenegger",
      "Jackie Chan", "Jet Li", "Donnie Yen",
      "Seth Rogen", "Jonah Hill", "Michael Cera", "Jesse Eisenberg",
      "Melissa McCarthy", "Kristen Wiig", "Amy Poehler", "Tina Fey",
      "Rebel Wilson", "Kate McKinnon",
      "Quinta Brunson", "Natasha Lyonne", "Bella Ramsey",
      "Emilia Clarke", "Kit Harington", "Maisie Williams", "Sophie Turner",
      "Elijah Wood", "Orlando Bloom", "Viggo Mortensen",
      "Daniel Radcliffe", "Emma Watson", "Rupert Grint", "Tom Felton",
      "Paul Walker", "Tobey Maguire"
    ]
  },

  fictionalCharacters: {
    name: "🦸 Fictional Characters",
    items: [
      "Spider-Man", "Batman", "Superman", "Iron Man", "Captain America",
      "Thor", "The Hulk", "Black Widow", "Hawkeye", "Doctor Strange",
      "Black Panther", "Ant-Man", "Scarlet Witch", "Vision", "Falcon",
      "Winter Soldier", "Groot", "Rocket Raccoon", "Star-Lord", "Gamora",
      "Drax", "Thanos", "Loki", "Nick Fury", "Captain Marvel",
      "Joker", "Lex Luthor", "The Penguin", "The Riddler", "Catwoman",
      "Harley Quinn", "Green Lantern", "The Flash", "Wonder Woman", "Aquaman",
      "Harry Potter", "Hermione Granger", "Ron Weasley", "Dumbledore",
      "Voldemort", "Snape", "Draco Malfoy", "Sirius Black", "Dobby",
      "Frodo Baggins", "Samwise Gamgee", "Gandalf", "Aragorn", "Legolas",
      "Gimli", "Sauron", "Gollum", "Bilbo Baggins", "Elrond",
      "Darth Vader", "Luke Skywalker", "Princess Leia", "Han Solo",
      "Yoda", "Obi-Wan Kenobi", "Anakin Skywalker", "Rey", "Kylo Ren",
      "The Mandalorian", "Grogu (Baby Yoda)",
      "Daenerys Targaryen", "Jon Snow", "Tyrion Lannister", "Cersei Lannister",
      "Arya Stark", "Sansa Stark", "Ned Stark", "Joffrey Baratheon",
      "Walter White", "Jesse Pinkman", "Saul Goodman", "Gus Fring",
      "Michael Scott", "Dwight Schrute", "Jim Halpert", "Pam Beesly",
      "Ross Geller", "Rachel Green", "Monica Geller", "Chandler Bing",
      "Joey Tribbiani", "Phoebe Buffay", "Sheldon Cooper", "Leonard Hofstadter",
      "Bart Simpson", "Homer Simpson", "Marge Simpson", "Lisa Simpson",
      "Sherlock Holmes", "John Watson", "James Bond", "Indiana Jones",
      "Jack Sparrow", "Hannibal Lecter", "Dexter Morgan",
      "Shrek", "Fiona (Shrek)", "Donkey (Shrek)", "Puss in Boots",
      "Buzz Lightyear", "Woody", "Jessie (Toy Story)",
      "Simba", "Mufasa", "Scar", "Timon", "Pumbaa",
      "Elsa", "Anna (Frozen)", "Olaf",
      "Aladdin", "Genie", "Jasmine", "Jafar",
      "Mulan", "Mushu",
      "Belle", "Gaston", "The Beast",
      "Ariel", "Ursula", "Sebastian (Little Mermaid)",
      "Moana", "Maui",
      "Rapunzel", "Flynn Rider",
      "Stitch", "Lilo",
      "Mr. Incredible", "Elastigirl", "Dash", "Violet", "Edna Mode",
      "Mike Wazowski", "James P. Sullivan", "Boo (Monsters Inc.)",
      "Nemo", "Dory", "Marlin",
      "Remy (Ratatouille)", "WALL-E", "EVE (WALL-E)",
      "Gru", "The Minions",
      "SpongeBob SquarePants", "Patrick Star", "Squidward", "Mr. Krabs", "Sandy",
      "Scooby-Doo", "Shaggy", "Velma Dinkley", "Fred Jones", "Daphne Blake",
      "Tom Cat", "Jerry Mouse",
      "Bugs Bunny", "Daffy Duck", "Tweety", "Porky Pig",
      "Optimus Prime", "Bumblebee (Transformers)", "Megatron",
      "Leonardo (TMNT)", "Donatello", "Michelangelo (TMNT)", "Raphael", "Shredder",
      "Goku", "Vegeta", "Gohan", "Piccolo", "Frieza",
      "Naruto Uzumaki", "Sasuke Uchiha", "Sakura Haruno", "Kakashi Hatake", "Itachi Uchiha",
      "Monkey D. Luffy", "Roronoa Zoro", "Nami", "Sanji", "Ace (One Piece)",
      "Light Yagami", "L (Death Note)", "Ryuk",
      "Eren Yeager", "Levi Ackerman", "Mikasa Ackerman",
      "Edward Elric", "Alphonse Elric",
      "Tanjiro Kamado", "Nezuko Kamado", "Zenitsu", "Inosuke",
      "Izuku Midoriya", "All Might", "Bakugo Katsuki", "Shoto Todoroki",
      "Gojo Satoru", "Yuji Itadori",
      "Winnie the Pooh", "Piglet", "Tigger", "Eeyore",
      "Paddington Bear",
      "Wednesday Addams",
      "Eleven (Stranger Things)", "Jim Hopper",
      "Anya Forger", "Denji (Chainsaw Man)",
      "Sailor Moon", "Gon Freecss", "Killua Zoldyck"
    ]
  }
};


// ─────────────────────────────────────────────
// VIDEO CATEGORIES
// ─────────────────────────────────────────────
const VIDEO_CATEGORIES = {
  funny:      { name: "😂 Funny",         queries: ["funny viral shorts", "hilarious shorts comedy"] },
  animals:    { name: "🐾 Animals",        queries: ["funny animals shorts", "cute animals viral shorts"] },
  fails:      { name: "💥 Fails",          queries: ["epic fail shorts", "fail compilation shorts"] },
  sports:     { name: "⚽ Sports",         queries: ["amazing sports moments shorts", "sports highlights shorts"] },
  food:       { name: "🍔 Food",           queries: ["satisfying food shorts", "cooking viral shorts"] },
  satisfying: { name: "✨ Satisfying",     queries: ["oddly satisfying shorts", "satisfying video shorts"] },
  gaming:     { name: "🎮 Gaming",         queries: ["funny gaming shorts", "gaming moments shorts"] },
  dance:      { name: "💃 Dance",          queries: ["viral dance shorts", "dance challenge shorts"] },
  pranks:     { name: "😈 Pranks",         queries: ["prank shorts funny", "prank reaction shorts"] },
  nature:     { name: "🌿 Nature",         queries: ["nature shorts beautiful", "wildlife shorts amazing"] }
};

// Cache YouTube results to preserve API quota
const _videoCache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function parseISO8601Duration(d) {
  const m = (d || '').match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || 0) * 3600) + (parseInt(m[2] || 0) * 60) + parseInt(m[3] || 0);
}

async function fetchYouTubeVideos(query) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('YOUTUBE_API_KEY not set');
  if (_videoCache[query] && Date.now() - _videoCache[query].ts < CACHE_TTL) {
    return _videoCache[query].videos;
  }
  // Step 1: search for short videos
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=short&maxResults=30&key=${apiKey}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  if (!searchData.items) throw new Error('YouTube API error: ' + JSON.stringify(searchData.error || searchData));

  const ids = searchData.items.filter(i => i.id && i.id.videoId).map(i => i.id.videoId);
  if (!ids.length) throw new Error('No videos found');

  // Step 2: fetch durations so we can filter to a consistent length (20–90 seconds)
  const detailUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${ids.join(',')}&key=${apiKey}`;
  const detailRes = await fetch(detailUrl);
  const detailData = await detailRes.json();

  let videos = (detailData.items || [])
    .filter(item => {
      const secs = parseISO8601Duration(item.contentDetails.duration);
      return secs >= 20 && secs <= 90;
    })
    .map(item => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : ''
    }));

  // If strict filter yields too few, relax to anything under 3 minutes
  if (videos.length < 4) {
    videos = (detailData.items || [])
      .filter(item => parseISO8601Duration(item.contentDetails.duration) <= 180)
      .map(item => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : ''
      }));
  }

  _videoCache[query] = { videos, ts: Date.now() };
  return videos;
}

async function pickTwoVideos(categoryKey, usedIds = new Set()) {
  const cat = VIDEO_CATEGORIES[categoryKey] || VIDEO_CATEGORIES.funny;

  // Fetch from ALL queries for this category and merge/deduplicate
  const allVideos = [];
  const seenIds = new Set();
  for (const query of cat.queries) {
    try {
      const vids = await fetchYouTubeVideos(query);
      for (const v of vids) {
        if (!seenIds.has(v.id)) { seenIds.add(v.id); allVideos.push(v); }
      }
    } catch (e) {
      console.error('fetchYouTubeVideos error for query:', query, e.message);
    }
  }

  if (allVideos.length < 2) throw new Error('Not enough videos returned');

  // Prefer videos that haven't been shown in this room yet
  const fresh = allVideos.filter(v => !usedIds.has(v.id));
  const pool = fresh.length >= 2 ? fresh : allVideos;

  // Proper Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { playerVideo: shuffled[0], imposterVideo: shuffled[1] };
}

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWordFromCategories(selectedCategories) {
  const catKey = pickRandom(selectedCategories);
  const cat = CATEGORIES[catKey];
  return {
    word: pickRandom(cat.items),
    category: cat.name,
    categoryKey: catKey
  };
}

function pickDifferentWord(selectedCategories, mainWord, categoryKey) {
  // Same category, different item (so discussion still makes sense)
  const items = CATEGORIES[categoryKey].items.filter(w => w !== mainWord);
  if (items.length > 0) return pickRandom(items);
  // Fallback: different category
  const otherCats = selectedCategories.filter(c => c !== categoryKey);
  if (otherCats.length > 0) return pickRandom(CATEGORIES[pickRandom(otherCats)].items);
  return 'Unknown';
}

function sanitizeRoom(room) {
  return {
    code: room.code,
    gameState: room.gameState,
    host: room.host,
    settings: room.settings,
    players: room.players.map(p => ({ id: p.id, name: p.name, isHost: p.isHost })),
    eliminatedPlayers: room.eliminatedPlayers || [],
    lastEliminated: room.lastEliminated || null,
    readyCount: room.readyPlayers ? room.readyPlayers.size : 0,
    voteCount: Object.keys(room.votes || {}).length,
    result: room.result || null,
    speakingOrder: room.speakingOrder || [],
    gameMode: room.settings ? room.settings.gameMode : 'word',
    spyfallVoteCount: room.spyfallData ? Object.keys(room.spyfallData.votes || {}).length : 0
  };
}

function tallyVotes(votes) {
  const tally = {};
  Object.values(votes).forEach(id => {
    tally[id] = (tally[id] || 0) + 1;
  });
  return tally;
}

// ─────────────────────────────────────────────
// GAME ROOMS
// ─────────────────────────────────────────────
const rooms = {};

// ─────────────────────────────────────────────
// SPYFALL — LOCATIONS
// ─────────────────────────────────────────────
const SPYFALL_LOCS = [
  { name:"Hospital",        emoji:"🏥", roles:["Doctor","Nurse","Patient","Surgeon","Receptionist","Paramedic","Cleaner","Visitor"] },
  { name:"Beach",           emoji:"🏖️", roles:["Lifeguard","Surfer","Vendor","Tourist","Swimmer","Volleyball Player","Sunbather","Photographer"] },
  { name:"Airplane",        emoji:"✈️", roles:["Pilot","Flight Attendant","Passenger","Co-Pilot","Air Marshal","Mechanic","Businessman","Tourist"] },
  { name:"Casino",          emoji:"🎰", roles:["Dealer","Security Guard","High Roller","Cocktail Waitress","Manager","Card Counter","Gambler","Cashier"] },
  { name:"School",          emoji:"🏫", roles:["Teacher","Student","Headteacher","Janitor","Dinner Lady","Sports Coach","New Kid","Supply Teacher"] },
  { name:"Police Station",  emoji:"🚔", roles:["Detective","Uniformed Officer","Suspect","Lawyer","Desk Sergeant","Informant","Crime Scene Tech","Prisoner"] },
  { name:"Supermarket",     emoji:"🛒", roles:["Cashier","Stock Stocker","Security Guard","Customer","Store Manager","Delivery Driver","Baker","Self-Checkout User"] },
  { name:"Restaurant",      emoji:"🍽️", roles:["Head Chef","Waiter","Food Critic","Manager","Dishwasher","Sommelier","Regular Customer","First Date"] },
  { name:"Movie Set",       emoji:"🎬", roles:["Director","Actor","Stuntperson","Camera Operator","Make-Up Artist","Producer","Extra","Screenwriter"] },
  { name:"Space Station",   emoji:"🚀", roles:["Commander","Engineer","Scientist","Pilot","Mission Control","Medic","Botanist","New Recruit"] },
  { name:"Circus",          emoji:"🎪", roles:["Ringmaster","Clown","Acrobat","Lion Tamer","Trapeze Artist","Ticket Seller","Magician","Audience Member"] },
  { name:"Submarine",       emoji:"🤿", roles:["Captain","Navigator","Engineer","Cook","Sonar Operator","New Recruit","First Mate","Weapons Officer"] },
  { name:"Bank",            emoji:"🏦", roles:["Bank Manager","Teller","Security Guard","Loan Officer","Customer","Robber","Accountant","Trainee"] },
  { name:"University",      emoji:"🎓", roles:["Professor","Student","Librarian","Janitor","Security Guard","Dean","Research Assistant","Fresher"] },
  { name:"Prison",          emoji:"⛓️", roles:["Prison Guard","Inmate","Warden","Lawyer","Chaplain","Informant","New Inmate","Cook"] },
  { name:"Cruise Ship",     emoji:"🛳️", roles:["Captain","Passenger","Entertainer","Chef","Bartender","Cleaner","Tour Guide","Doctor"] },
  { name:"Gym",             emoji:"💪", roles:["Personal Trainer","Regular Member","Receptionist","New Member","Competitive Bodybuilder","Yoga Instructor","Manager","Cleaning Staff"] },
  { name:"Haunted House",   emoji:"👻", roles:["Scared Tourist","Ghost Actor","Tour Guide","Security","Manager","Daredevil","Photographer","Screamer"] },
  { name:"Pirate Ship",     emoji:"🏴‍☠️", roles:["Captain","First Mate","Cook","Navigator","Lookout","Prisoner","Cannoneer","Deckhand"] },
  { name:"Spy HQ",          emoji:"🕵️", roles:["Head of Intelligence","Field Agent","Analyst","Tech Expert","Double Agent","Receptionist","Trainee","Handler"] },
  { name:"Sports Stadium",  emoji:"🏟️", roles:["Star Player","Coach","Referee","Commentator","Mascot","Groundskeeper","Supporter","Hot Dog Vendor"] },
  { name:"Art Gallery",     emoji:"🖼️", roles:["Curator","Artist","Security Guard","Critic","Tourist","Auctioneer","Restorer","Wealthy Collector"] },
  { name:"Ski Resort",      emoji:"⛷️", roles:["Ski Instructor","Skier","Snowboarder","Lift Operator","Chalet Maid","Patrol Officer","Après-Ski Regular","Beginner"] },
  { name:"TV Studio",       emoji:"📺", roles:["Presenter","Director","Camera Operator","Makeup Artist","Floor Manager","Guest","Audience Member","Intern"] },
  { name:"Zoo",             emoji:"🦁", roles:["Zookeeper","Vet","Tour Guide","Animal Trainer","Visitor","Security Guard","Cleaner","Manager"] }
];

// ─────────────────────────────────────────────
// WHO AM I — CATEGORIES
// ─────────────────────────────────────────────
const WHOAMI_CATS = {
  famous: { name: "Famous People", items: [
    // Musicians
    "Taylor Swift","Beyonce","Drake","Rihanna","Ed Sheeran","Adele","Justin Bieber","Ariana Grande",
    "Harry Styles","Billie Eilish","Post Malone","The Weeknd","Doja Cat","Olivia Rodrigo","Dua Lipa",
    "Cardi B","Nicki Minaj","Travis Scott","Kendrick Lamar","Bad Bunny","Shakira","Lady Gaga",
    "Bruno Mars","Eminem","Kanye West","Jay-Z","Miley Cyrus","Selena Gomez","Sam Smith",
    "Sabrina Carpenter","Chappell Roan","Charli XCX","SZA","Michael Jackson","Elvis Presley",
    "Freddie Mercury","David Bowie","Madonna","Prince","Amy Winehouse","Bob Marley","Tupac",
    "Notorious B.I.G.","Lil Wayne","Snoop Dogg","Elton John","Whitney Houston","Frank Sinatra",
    "Kurt Cobain","Jimi Hendrix","John Lennon","Paul McCartney","Lana Del Rey","Stormzy","Dave",
    "Central Cee","21 Savage","Lil Baby","Future","Tyler the Creator","Childish Gambino","J. Cole",
    "Lizzo","Meghan Thee Stallion","Ice Spice","Gracie Abrams","Benson Boone","Noah Kahan",
    "Morgan Wallen","Luke Combs","Zach Bryan","ABBA","The Beatles","The Rolling Stones",
    "Led Zeppelin","Radiohead","Coldplay","Oasis","Arctic Monkeys","Linkin Park","Green Day",
    "Mariah Carey","Celine Dion","Katy Perry","Mick Jagger","Ozzy Osbourne","Bob Dylan","Jennifer Lopez",
    // Actors
    "Zendaya","Timothee Chalamet","Tom Holland","Ryan Reynolds","Dwayne Johnson","Leonardo DiCaprio",
    "Brad Pitt","Margot Robbie","Scarlett Johansson","Chris Hemsworth","Robert Downey Jr",
    "Will Smith","Keanu Reeves","Tom Hanks","Florence Pugh","Pedro Pascal","Austin Butler",
    "Meryl Streep","Angelina Jolie","Jennifer Lawrence","Cate Blanchett","Natalie Portman",
    "Johnny Depp","Jim Carrey","Eddie Murphy","Samuel L. Jackson","Morgan Freeman",
    "Denzel Washington","Al Pacino","Robert De Niro","Jack Nicholson","Cillian Murphy",
    "Paul Mescal","Barry Keoghan","Andrew Garfield","Jacob Elordi","Sydney Sweeney",
    "Anya Taylor-Joy","Ana de Armas","Emma Stone","Emma Watson","Daniel Radcliffe",
    "Chris Pratt","Chris Evans","Mark Ruffalo","Jeremy Renner","Benedict Cumberbatch",
    "Matt Damon","Ben Affleck","George Clooney","Adam Sandler","Will Ferrell","Seth Rogen",
    "Tom Cruise","Ryan Gosling","Joaquin Phoenix","Heath Ledger","Robin Williams","Arnold Schwarzenegger","Sylvester Stallone",
    // Footballers
    "Lionel Messi","Cristiano Ronaldo","Kylian Mbappe","Neymar","Harry Kane","Mohamed Salah",
    "Erling Haaland","Vinicius Jr","Jude Bellingham","Luka Modric","Kevin De Bruyne",
    "Phil Foden","Pedri","Bukayo Saka","Marcus Rashford","Jack Grealish","Wayne Rooney",
    "David Beckham","Zinedine Zidane","Ronaldinho","Thierry Henry","Didier Drogba",
    "Zlatan Ibrahimovic","Son Heung-min","Virgil van Dijk","Trent Alexander-Arnold",
    "Andres Iniesta","Xavi","Pele","Maradona","Roberto Carlos","Ronaldo R9",
    "Gareth Bale","Roberto Firmino","Paul Pogba","Raheem Sterling","Jamie Vardy",
    // Boxers
    "Muhammad Ali","Mike Tyson","Floyd Mayweather","Anthony Joshua","Tyson Fury",
    "Canelo Alvarez","Manny Pacquiao","Lennox Lewis","George Foreman","Oleksandr Usyk",
    "Ryan Garcia","Deontay Wilder","Oscar De La Hoya","Sugar Ray Leonard","Joe Frazier",
    "KSI","Jake Paul","Logan Paul",
    // Other athletes
    "LeBron James","Michael Jordan","Kobe Bryant","Stephen Curry","Giannis Antetokounmpo",
    "Serena Williams","Roger Federer","Rafael Nadal","Novak Djokovic","Tiger Woods",
    "Usain Bolt","Tom Brady","Michael Phelps","Simone Biles","Lewis Hamilton","Max Verstappen",
    "Caitlin Clark","Naomi Osaka","Ben Stokes","Virat Kohli","Conor McGregor","Ronda Rousey",
    "Alex Ovechkin","Wayne Gretzky","Andy Murray","Ronnie O'Sullivan","Carl Lewis",
    "Venus Williams","Maria Sharapova","Neymar Jr","Kevin Durant","Shaquille O'Neal",
    "Patrick Mahomes","Lionel Hamilton","Michael Schumacher","Ayrton Senna",
    // Youtubers / internet
    "MrBeast","PewDiePie","Markiplier","Jacksepticeye","Ninja","Pokimane","David Dobrik",
    "James Charles","Dude Perfect","KSI","Sidemen","Miniminter","Wroetoshaw","Behzinga",
    "Calfreezy","Vikk","Tobi","Ethan Payne","W2S","Charli D'Amelio","Addison Rae",
    // Politicians / leaders
    "Barack Obama","Donald Trump","Joe Biden","Emmanuel Macron","Boris Johnson",
    "Vladimir Putin","Xi Jinping","Angela Merkel","Volodymyr Zelensky","Justin Trudeau",
    "Jacinda Ardern","Narendra Modi","Kim Jong-un","Keir Starmer","Rishi Sunak",
    "Tony Blair","George W Bush","Bill Clinton","George H W Bush","Richard Nixon",
    "JFK","Margaret Thatcher","Ronald Reagan","Adolf Hitler","Joseph Stalin",
    "Winston Churchill","Abraham Lincoln","Nelson Mandela","Mahatma Gandhi",
    "Martin Luther King Jr","Malcolm X","Fidel Castro","Che Guevara","Mao Zedong",
    "Napoleon Bonaparte","Julius Caesar","Cleopatra","Alexander the Great","Genghis Khan",
    // Scientists / inventors / historical
    "Albert Einstein","Isaac Newton","Charles Darwin","Marie Curie","Nikola Tesla",
    "Thomas Edison","Leonardo da Vinci","Galileo Galilei","Stephen Hawking","Alan Turing",
    "Ada Lovelace","Sigmund Freud","Karl Marx","Charles Dickens","William Shakespeare",
    "Mozart","Beethoven","Michelangelo","Picasso","Vincent van Gogh","Frida Kahlo",
    "Anne Frank","Joan of Arc","Henry VIII","Queen Elizabeth I","Christopher Columbus",
    // Business / tech
    "Elon Musk","Jeff Bezos","Bill Gates","Mark Zuckerberg","Steve Jobs","Oprah Winfrey",
    "Kim Kardashian","Kylie Jenner","Kanye West","Cristiano Ronaldo"
  ]},
  fictional: { name: "Fictional Characters", items: [
    // Movies
    "Darth Vader","Luke Skywalker","Princess Leia","Yoda","Han Solo","Obi-Wan Kenobi",
    "Hermione Granger","Harry Potter","Ron Weasley","Voldemort","Dumbledore","Snape",
    "Frodo Baggins","Gandalf","Aragorn","Legolas","Gimli","Gollum","Samwise Gamgee",
    "Jack Sparrow","Katniss Everdeen","Thanos","Iron Man","Batman","Superman","Wonder Woman",
    "The Joker","Hannibal Lecter","James Bond","Indiana Jones","Forrest Gump","The Terminator",
    "Shrek","Donkey","Buzz Lightyear","Woody","Simba","Elsa","Anna","Moana","Mulan","Rapunzel",
    "Jack Skellington","Neo","Tyler Durden","Don Corleone","John Wick","Captain America",
    "Black Widow","Thor","Spider-Man","Deadpool","Wolverine","Magneto","Jason Bourne",
    "Ethan Hunt","Patrick Bateman","Amy Dunne","Elle Woods","WALL-E","Nemo","Dory",
    "Mike Wazowski","Sulley","Remy the Rat","Merida","Pinocchio","Paddington Bear",
    "Edward Scissorhands","Ace Ventura","Austin Powers","Borat","The Mask","Beetlejuice",
    "Freddy Krueger","Jason Voorhees","Michael Myers","Pennywise","Chucky","Ghostface",
    "Optimus Prime","Bumblebee","Megatron","Godzilla","King Kong",
    // TV
    "Walter White","Jesse Pinkman","Jon Snow","Daenerys Targaryen","Tyrion Lannister",
    "Cersei Lannister","Arya Stark","Joffrey Baratheon","Ned Stark","Jaime Lannister",
    "Sherlock Holmes","Watson","Ted Lasso","Eleven","Jim Halpert","Dwight Schrute",
    "Michael Scott","Joey Tribbiani","Chandler Bing","Ross Geller","Rachel Green","Phoebe Buffay",
    "Sheldon Cooper","George Costanza","Cosmo Kramer","Tony Soprano","Saul Goodman",
    "Harvey Specter","Mike Ross","Don Draper","Dexter Morgan","Carrie Bradshaw",
    "Eric Cartman","Homer Simpson","Bart Simpson","Marge Simpson","Lisa Simpson",
    "Rick Sanchez","Morty Smith","Patrick Star","SpongeBob SquarePants","Sandy Cheeks",
    "Peter Griffin","Stewie Griffin","Brian Griffin","Meg Griffin","Bojack Horseman",
    "Barney Stinson","Ted Mosby","Marshall Eriksen","Lily Aldrin","Robin Scherbatsky",
    "Leslie Knope","Ron Swanson","Andy Dwyer","April Ludgate","Ben Wyatt",
    "Wednesday Addams","Morticia Addams","Gomez Addams","Cousin Itt",
    "Aang","Zuko","Katara","Sokka","Toph","Azula","Iroh",
    "Daffy Duck","Bugs Bunny","Tom Cat","Jerry Mouse","Tweety Bird","Sylvester",
    "Scooby-Doo","Shaggy","Fred Flintstone","Barney Rubble","George Jetson",
    "Jack Bauer","Frank Underwood","Raymond Reddington","Fleabag","Will Graham",
    "The Mandalorian","Grogu (Baby Yoda)",
    // Video games
    "Mario","Luigi","Princess Peach","Bowser","Yoshi","Donkey Kong","Wario","Waluigi",
    "Link","Zelda","Ganondorf","Sonic the Hedgehog","Tails","Knuckles","Shadow",
    "Pikachu","Mewtwo","Charizard","Master Chief","Cortana","Kratos","Atreus",
    "Arthur Morgan","Dutch van der Linde","Geralt of Rivia","Ciri","Yennefer",
    "Lara Croft","Nathan Drake","Joel","Ellie","Abby","Aloy","Cloud Strife",
    "Sephiroth","Tifa Lockhart","Aerith","Kirby","Samus Aran","Mega Man","Pac-Man",
    "Ryu","Chun-Li","Sub-Zero","Scorpion","Liu Kang","Agent 47","Ezio Auditore",
    "Altair","Niko Bellic","Trevor Philips","Michael De Santa","Franklin Clinton",
    "Gordon Freeman","Chell","GLaDOS","The Dragonborn","Commander Shepard",
    "Steve (Minecraft)","Creeper","Enderman","Tom Nook","Isabelle","Villager",
    "V (Cyberpunk 2077)","Solid Snake","Raiden","Crash Bandicoot","Spyro",
    // Anime
    "Naruto Uzumaki","Sasuke Uchiha","Sakura Haruno","Kakashi Hatake","Itachi Uchiha",
    "Madara Uchiha","Minato Namikaze","Goku","Vegeta","Gohan","Piccolo","Frieza","Cell",
    "Luffy","Zoro","Nami","Sanji","Chopper","Ace","Whitebeard",
    "Ichigo Kurosaki","Rukia Kuchiki","Byakuya Kuchiki","Aizen",
    "Eren Yeager","Mikasa Ackerman","Levi Ackerman","Armin Arlert","Zeke Yeager",
    "Tanjiro Kamado","Nezuko Kamado","Zenitsu Agatsuma","Inosuke Hashibira",
    "Deku (Izuku Midoriya)","All Might","Bakugo","Todoroki","Endeavor",
    "Gon Freecss","Killua Zoldyck","Hisoka","Kurapika","Leorio",
    "Light Yagami","L Lawliet","Ryuk","Near","Mello",
    "Edward Elric","Alphonse Elric","Roy Mustang","Riza Hawkeye",
    "Spike Spiegel","Jet Black","Faye Valentine","Ein","Radical Ed",
    "Saitama","Genos","Speed-o'-Sound Sonic","Boros",
    "Sailor Moon","Tuxedo Mask","Sailor Venus","Sailor Mars",
    "Ash Ketchum","Misty","Brock","Team Rocket Jesse","Team Rocket James",
    // Books / classic fiction
    "Sherlock Holmes","Dracula","Frankenstein","Elizabeth Bennet","Mr Darcy",
    "Jay Gatsby","Ebenezer Scrooge","Long John Silver","Bilbo Baggins","Robinson Crusoe",
    "Count of Monte Cristo","Huckleberry Finn","Tom Sawyer","Atticus Finch","Scout Finch",
    "Holden Caulfield","Big Brother","Winston Smith","Alex DeLarge","Patrick Bateman",
    "Dorian Gray","Captain Ahab","Heathcliff","Jane Eyre","Mr Rochester"
  ]}
};

// ─────────────────────────────────────────────
// WHO AM I — ROOMS
// ─────────────────────────────────────────────
const whoamiRooms = {};

function sanitizeWhoamiRoom(room) {
  return {
    code: room.code,
    host: room.host,
    gameState: room.gameState,
    settings: room.settings,
    players: room.players.map(p => ({ id: p.id, name: p.name, isHost: p.isHost }))
  };
}

// ─────────────────────────────────────────────
// SOCKET.IO
// ─────────────────────────────────────────────
io.on('connection', (socket) => {
  // Create room
  socket.on('create-room', ({ name }) => {
    if (!name || !name.trim()) return socket.emit('error', { message: 'Please enter your name' });
    let code;
    let attempts = 0;
    do { code = generateCode(); attempts++; } while (rooms[code] && attempts < 100);

    rooms[code] = {
      code,
      host: socket.id,
      players: [{ id: socket.id, name: name.trim(), isHost: true }],
      gameState: 'lobby',
      settings: {
        gameType: 'imposter',
        imposterCount: 1,
        blindImposter: false,
        gameMode: 'word',
        videoCategory: 'funny',
        selectedCategories: ['movies', 'tvShows', 'videoGames', 'gameCharacters'],
        whoamiCategory: 'famous'
      },
      currentWord: null,
      currentCategory: null,
      currentCategoryKey: null,
      imposters: [],
      votes: {},
      readyPlayers: new Set(),
      eliminatedPlayers: [],
      lastEliminated: null,
      result: null
    };

    socket.join(code);
    socket.roomCode = code;
    socket.playerName = name.trim();
    socket.emit('room-created', { code, playerId: socket.id });
    io.to(code).emit('room-update', sanitizeRoom(rooms[code]));
  });

  // Join room
  socket.on('join-room', ({ code, name }) => {
    const upperCode = (code || '').trim().toUpperCase();
    const room = rooms[upperCode];
    if (!room) return socket.emit('error', { message: 'Room not found. Check the code and try again.' });
    if (room.gameState !== 'lobby') return socket.emit('error', { message: 'Game already in progress. Try again when it ends.' });
    if (room.players.length >= 15) return socket.emit('error', { message: 'Room is full (max 15 players).' });
    if (!name || !name.trim()) return socket.emit('error', { message: 'Please enter your name.' });
    const cleanName = name.trim();
    if (room.players.find(p => p.name.toLowerCase() === cleanName.toLowerCase())) {
      return socket.emit('error', { message: 'That name is taken. Pick another.' });
    }

    room.players.push({ id: socket.id, name: cleanName, isHost: false });
    socket.join(upperCode);
    socket.roomCode = upperCode;
    socket.playerName = cleanName;
    socket.emit('room-joined', { code: upperCode, playerId: socket.id });
    io.to(upperCode).emit('room-update', sanitizeRoom(room));
    io.to(upperCode).emit('player-joined', { name: cleanName });
  });

  // Update settings (host only)
  socket.on('update-settings', ({ settings }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    if (settings.selectedCategories && settings.selectedCategories.length === 0) {
      return socket.emit('error', { message: 'Select at least one category.' });
    }
    room.settings = { ...room.settings, ...settings };
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Start game (host only)
  socket.on('start-game', async () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;

    // ── SPYFALL MODE ──
    if (room.settings.gameType === 'spyfall') {
      if (room.players.length < 3) return socket.emit('error', { message: 'Need at least 3 players for Spyfall.' });
      const loc = SPYFALL_LOCS[Math.floor(Math.random() * SPYFALL_LOCS.length)];
      const spyIdx = Math.floor(Math.random() * room.players.length);
      const shuffledRoles = [...loc.roles].sort(() => Math.random() - 0.5);
      let ri = 0;
      room.spyfallData = {
        locationName: loc.name, locationEmoji: loc.emoji,
        spyId: room.players[spyIdx].id, spyName: room.players[spyIdx].name,
        roles: {}, votes: {}
      };
      room.players.forEach((p, i) => {
        room.spyfallData.roles[p.id] = i === spyIdx ? null : shuffledRoles[ri++ % shuffledRoles.length];
      });
      room.gameState = 'spyfall-playing';
      room.players.forEach(p => {
        const isSpy = p.id === room.spyfallData.spyId;
        io.to(p.id).emit('spyfall-started', {
          isSpy,
          locationName: isSpy ? null : loc.name,
          locationEmoji: isSpy ? null : loc.emoji,
          role: room.spyfallData.roles[p.id],
          playerNames: room.players.map(pl => ({ id: pl.id, name: pl.name }))
        });
      });
      io.to(room.code).emit('room-update', sanitizeRoom(room));
      return;
    }

    // ── WHO AM I MODE ──
    if (room.settings.gameType === 'whoami') {
      if (room.players.length < 2) return socket.emit('error', { message: 'Need at least 2 players.' });
      const cat = WHOAMI_CATS[room.settings.whoamiCategory || 'celebrities'] || WHOAMI_CATS.celebrities;
      const pool = [...cat.items];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      room.whoamiAssignments = {};
      room.players.forEach((p, i) => { room.whoamiAssignments[p.id] = pool[i % pool.length]; });
      room.gameState = 'whoami-playing';
      room.players.forEach(player => {
        const others = room.players
          .filter(p => p.id !== player.id)
          .map(p => ({ name: p.name, word: room.whoamiAssignments[p.id] }));
        io.to(player.id).emit('whoami-game-started', { others, categoryName: cat.name });
      });
      io.to(room.code).emit('room-update', sanitizeRoom(room));
      return;
    }

    // ── IMPOSTER MODE ──
    if (room.players.length < 3) return socket.emit('error', { message: 'Need at least 3 players to start.' });
    const maxImposters = Math.floor((room.players.length - 1) / 2);
    if (room.settings.imposterCount > maxImposters) {
      return socket.emit('error', { message: `Too many imposters for ${room.players.length} players. Max is ${maxImposters}.` });
    }

    const isVideoMode = room.settings.gameMode === 'video';

    if (isVideoMode) {
      // ── VIDEO MODE ──
      try {
        if (!room.usedVideoIds) room.usedVideoIds = new Set();
        const { playerVideo, imposterVideo } = await pickTwoVideos(room.settings.videoCategory || 'funny', room.usedVideoIds);
        room.usedVideoIds.add(playerVideo.id);
        room.usedVideoIds.add(imposterVideo.id);
        room.currentWord = null;
        room.currentCategory = (VIDEO_CATEGORIES[room.settings.videoCategory] || VIDEO_CATEGORIES.funny).name;
        room.currentPlayerVideo = playerVideo;   // { id, title, thumbnail }
        room.currentImposterVideo = imposterVideo;
      } catch (e) {
        console.error('Video fetch error:', e.message);
        return socket.emit('error', { message: 'Could not fetch videos. Check the API key is set on Render, then try again.' });
      }
    } else {
      // ── WORD MODE ──
      const { word, category, categoryKey } = pickWordFromCategories(room.settings.selectedCategories);
      room.currentWord = word;
      room.currentCategory = category;
      room.currentCategoryKey = categoryKey;
      room.currentPlayerVideo = null;
      room.currentImposterVideo = null;
    }

    // Assign imposters — proper Fisher-Yates shuffle for fair distribution
    const shuffledPlayers = [...room.players];
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
    }
    room.imposters = shuffledPlayers.slice(0, room.settings.imposterCount).map(p => p.id);

    // Reset state
    room.gameState = 'role-reveal';
    room.votes = {};
    room.readyPlayers = new Set();
    room.eliminatedPlayers = [];
    room.lastEliminated = null;
    room.result = null;
    room.votingHistory = [];
    room.speakingOrder = [...room.players].sort(() => Math.random() - 0.5).map(p => p.id);

    // Send each player their private role
    room.imposterWords = {};
    room.players.forEach(player => {
      const isImposter = room.imposters.includes(player.id);
      let roleData;

      if (isVideoMode) {
        // Video mode: everyone gets a video — imposter silently gets a different one
        const video = isImposter ? room.currentImposterVideo : room.currentPlayerVideo;
        room.imposterWords[player.id] = isImposter ? (room.currentImposterVideo ? room.currentImposterVideo.title : null) : null;
        roleData = {
          role: isImposter ? 'imposter' : 'player',
          gameMode: 'video',
          videoId: video.id,
          videoTitle: video.title,
          category: room.currentCategory,
          blindMode: false
        };
      } else if (isImposter) {
        if (room.settings.blindImposter) {
          const imposterWord = pickDifferentWord(room.settings.selectedCategories, room.currentWord, room.currentCategoryKey);
          room.imposterWords[player.id] = imposterWord;
          roleData = { role: 'unknown', word: imposterWord, category: room.currentCategory, blindMode: true, gameMode: 'word' };
        } else {
          room.imposterWords[player.id] = null;
          roleData = { role: 'imposter', word: null, category: room.currentCategory, blindMode: false, gameMode: 'word' };
        }
      } else {
        roleData = { role: 'player', word: room.currentWord, category: room.currentCategory, blindMode: room.settings.blindImposter, gameMode: 'word' };
      }

      io.to(player.id).emit('your-role', roleData);
    });

    io.to(room.code).emit('room-update', sanitizeRoom(room));
    io.to(room.code).emit('game-started');
  });

  // Player confirmed they've seen their role
  socket.on('player-ready', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'role-reveal') return;
    room.readyPlayers.add(socket.id);
    const activePlayers = room.players.filter(p => !room.eliminatedPlayers.includes(p.id));
    io.to(room.code).emit('ready-update', {
      readyCount: room.readyPlayers.size,
      totalCount: activePlayers.length
    });
    if (room.readyPlayers.size >= activePlayers.length) {
      room.gameState = 'discussion';
      room.readyPlayers = new Set();
      io.to(room.code).emit('room-update', sanitizeRoom(room));
    }
  });

  // Start voting (host only)
  socket.on('start-voting', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    if (room.gameState !== 'discussion') return;
    room.gameState = 'voting';
    room.votes = {};
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Cast vote
  socket.on('vote', ({ targetId }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'voting') return;
    if (room.eliminatedPlayers.includes(socket.id)) return; // eliminated can't vote
    room.votes[socket.id] = targetId;

    const activePlayers = room.players.filter(p => !room.eliminatedPlayers.includes(p.id));
    io.to(room.code).emit('vote-update', {
      voteCount: Object.keys(room.votes).length,
      totalCount: activePlayers.length
    });

    // All active players voted?
    if (Object.keys(room.votes).length >= activePlayers.length) {
      try { resolveVotes(room); } catch(e) {
        console.error('resolveVotes error:', e);
        // Emergency fallback: end the game so players aren't stuck
        room.gameState = 'game-over';
        room.result = 'players-win';
        io.to(room.code).emit('game-over', buildResultPayload(room));
        io.to(room.code).emit('room-update', sanitizeRoom(room));
      }
    }
  });

  // Imposter submits word guess
  socket.on('imposter-guess', ({ guess }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'imposter-guess') return;

    const correct = (guess || '').trim().toLowerCase() === (room.currentWord || '').toLowerCase();
    room.gameState = 'game-over';
    room.result = correct ? 'imposters-win-guess' : 'players-win';

    const resultPayload = buildResultPayload(room, {
      guess: (guess || '').trim(),
      correct
    });

    io.to(room.code).emit('game-over', resultPayload);
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Continue game after non-imposter eliminated
  socket.on('continue-game', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    room.gameState = 'discussion';
    room.votes = {};
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Store a player's Who Am I guess
  socket.on('whoami-guess', ({ guess }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'whoami-playing') return;
    if (!room.whoamiGuesses) room.whoamiGuesses = {};
    room.whoamiGuesses[socket.id] = (guess || '').trim();
  });

  // End Who Am I game (host only)
  socket.on('whoami-end-game', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    const guesses = room.whoamiGuesses || {};
    const all = room.players.map(p => {
      const word = (room.whoamiAssignments || {})[p.id] || '?';
      const guess = guesses[p.id] || null;
      const correct = guess ? guess.toLowerCase().trim() === word.toLowerCase().trim() : false;
      return { name: p.name, word, guess, correct };
    });
    room.gameState = 'whoami-ended';
    io.to(room.code).emit('whoami-game-ended', { all });
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // ─────────────────────────────────────────────
  // SPYFALL — SOCKET HANDLERS
  // ─────────────────────────────────────────────

  // Host ends discussion, moves to voting
  socket.on('spyfall-end-discussion', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id || room.gameState !== 'spyfall-playing') return;
    room.gameState = 'spyfall-voting';
    room.spyfallData.votes = {};
    io.to(room.code).emit('spyfall-vote-started', {
      playerNames: room.players.map(p => ({ id: p.id, name: p.name }))
    });
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Player casts their spy vote
  socket.on('spyfall-vote', ({ targetId }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'spyfall-voting') return;
    room.spyfallData.votes[socket.id] = targetId;
    io.to(room.code).emit('room-update', sanitizeRoom(room));

    // Check if all have voted
    if (Object.keys(room.spyfallData.votes).length >= room.players.length) {
      // Tally votes
      const tally = {};
      Object.values(room.spyfallData.votes).forEach(id => { tally[id] = (tally[id] || 0) + 1; });
      const maxVotes = Math.max(...Object.values(tally));
      const topIds = Object.keys(tally).filter(id => tally[id] === maxVotes);
      const spyCaught = topIds.length === 1 && topIds[0] === room.spyfallData.spyId;
      const suspectedId = topIds.length === 1 ? topIds[0] : null;
      const suspectedName = suspectedId ? (room.players.find(p => p.id === suspectedId) || {}).name : null;

      if (spyCaught) {
        // Spy gets to guess the location
        room.gameState = 'spyfall-spy-guessing';
        io.to(room.code).emit('spyfall-caught', {
          spyId: room.spyfallData.spyId,
          spyName: room.spyfallData.spyName,
          suspectedName,
          votes: tally
        });
      } else {
        // Spy wins — reveal
        room.gameState = 'spyfall-ended';
        const roles = room.players.map(p => ({ name: p.name, role: room.spyfallData.roles[p.id] || 'SPY', isSpy: p.id === room.spyfallData.spyId }));
        io.to(room.code).emit('spyfall-game-ended', {
          spyWon: true, reason: 'tie',
          locationName: room.spyfallData.locationName, locationEmoji: room.spyfallData.locationEmoji,
          spyName: room.spyfallData.spyName, spyGuess: null, roles
        });
        io.to(room.code).emit('room-update', sanitizeRoom(room));
      }
    }
  });

  // Spy guesses the location
  socket.on('spyfall-spy-guess', ({ location }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'spyfall-spy-guessing') return;
    if (socket.id !== room.spyfallData.spyId) return;
    const correct = location.trim().toLowerCase() === room.spyfallData.locationName.toLowerCase();
    room.gameState = 'spyfall-ended';
    const roles = room.players.map(p => ({ name: p.name, role: room.spyfallData.roles[p.id] || 'SPY', isSpy: p.id === room.spyfallData.spyId }));
    io.to(room.code).emit('spyfall-game-ended', {
      spyWon: correct, reason: correct ? 'spy-guessed' : 'spy-caught',
      locationName: room.spyfallData.locationName, locationEmoji: room.spyfallData.locationEmoji,
      spyName: room.spyfallData.spyName, spyGuess: location, roles
    });
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Play again
  socket.on('play-again', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    room.gameState = 'lobby';
    room.currentWord = null;
    room.currentCategory = null;
    room.currentCategoryKey = null;
    room.whoamiAssignments = {};
    room.whoamiGuesses = {};
    room.spyfallData = null;
    room.imposters = [];
    room.votes = {};
    room.readyPlayers = new Set();
    room.eliminatedPlayers = [];
    room.lastEliminated = null;
    room.result = null;
    io.to(room.code).emit('reset-game');
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Client requests a re-sync (e.g. after reconnect)
  socket.on('request-sync', ({ code }) => {
    const room = rooms[(code || '').trim().toUpperCase()];
    if (room) socket.emit('room-update', sanitizeRoom(room));
  });

  // Kick player (host only)
  socket.on('kick-player', ({ playerId }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    if (room.gameState !== 'lobby') return;
    const kicked = room.players.find(p => p.id === playerId);
    if (!kicked) return;
    room.players = room.players.filter(p => p.id !== playerId);
    io.to(playerId).emit('kicked');
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Rejoin after reconnect (client sends this on every reconnect)
  socket.on('rejoin-room', ({ code, name }) => {
    const room = rooms[(code || '').toUpperCase()];
    if (!room) return socket.emit('error', { message: 'Room no longer exists.' });

    const player = room.players.find(p => p.name === name);
    if (!player) return socket.emit('error', { message: 'You are no longer in this room.' });

    // Cancel any pending removal timer
    if (room._dcTimers && room._dcTimers[player.id]) {
      clearTimeout(room._dcTimers[player.id]);
      delete room._dcTimers[player.id];
    }

    const oldId = player.id;
    player.id = socket.id;
    socket.join(room.code);
    socket.roomCode = room.code;
    socket.playerName = name;

    // Remap all ID references to the new socket ID
    if (room.host === oldId) { room.host = socket.id; player.isHost = true; }
    if (room.imposters) room.imposters = room.imposters.map(id => id === oldId ? socket.id : id);
    if (room.eliminatedPlayers) room.eliminatedPlayers = room.eliminatedPlayers.map(id => id === oldId ? socket.id : id);
    if (room.speakingOrder) room.speakingOrder = room.speakingOrder.map(id => id === oldId ? socket.id : id);
    if (room.readyPlayers && room.readyPlayers.has(oldId)) { room.readyPlayers.delete(oldId); room.readyPlayers.add(socket.id); }
    if (room.votes) {
      const newVotes = {};
      Object.entries(room.votes).forEach(([k, v]) => {
        newVotes[k === oldId ? socket.id : k] = v === oldId ? socket.id : v;
      });
      room.votes = newVotes;
    }
    if (room.imposterWords && room.imposterWords[oldId] !== undefined) {
      room.imposterWords[socket.id] = room.imposterWords[oldId];
      delete room.imposterWords[oldId];
    }

    socket.emit('rejoin-ack', { code: room.code, playerId: socket.id });
    socket.emit('room-update', sanitizeRoom(room));
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // ─────────────────────────────────────────────
  // WHO AM I — SOCKET HANDLERS
  // ─────────────────────────────────────────────

  socket.on('whoami-create-room', ({ name }) => {
    if (!name || !name.trim()) return socket.emit('error', { message: 'Enter your name' });
    let code, attempts = 0;
    do { code = generateCode(); attempts++; } while (whoamiRooms[code] && attempts < 100);
    whoamiRooms[code] = {
      code, host: socket.id, gameState: 'lobby',
      settings: { category: 'celebrities' },
      players: [{ id: socket.id, name: name.trim(), isHost: true }],
      assignments: {}
    };
    socket.join(code);
    socket.whoamiCode = code;
    socket.playerName = name.trim();
    socket.emit('room-created', { code, playerId: socket.id });
    socket.emit('room-created', { code, playerId: socket.id });
    io.to(code).emit('room-update', sanitizeWhoamiRoom(room));
  });

  socket.on('whoami-join-room', ({ name, code }) => {
    const room = whoamiRooms[(code || '').toUpperCase()];
    if (!room) return socket.emit('error', { message: 'Room not found.' });
    if (room.gameState !== 'lobby') return socket.emit('error', { message: 'Game already started.' });
    const trimmed = (name || '').trim();
    if (!trimmed) return socket.emit('error', { message: 'Name required.' });
    room.players.push({ id: socket.id, name: trimmed, isHost: false });
    socket.join(room.code);
    socket.whoamiCode = room.code;
    socket.playerName = trimmed;
    socket.emit('room-joined', { code: room.code, playerId: socket.id });
    io.to(room.code).emit('room-update', sanitizeWhoamiRoom(room));
  });

  socket.on('whoami-start-game', () => {
    const room = whoamiRooms[socket.whoamiCode];
    if (!room || room.host !== socket.id) return;
    if (room.players.length < 2) return socket.emit('error', { message: 'Need at least 2 players.' });

    const cat = WHOAMI_CATS[room.settings.category] || WHOAMI_CATS.famous;
    const pool = [...cat.items].sort(() => Math.random() - 0.5);

    room.assignments = {};
    room.players.forEach((p, i) => { room.assignments[p.id] = pool[i % pool.length]; });
    room.gameState = 'playing';

    room.players.forEach(player => {
      const others = room.players
        .filter(p => p.id !== player.id)
        .map(p => ({ name: p.name, word: room.assignments[p.id] }));
      io.to(player.id).emit('whoami-game-started', { others, categoryName: cat.name });
    });
  });

  socket.on('whoami-end-game', () => {
    const room = whoamiRooms[socket.whoamiCode];
    if (!room || room.host !== socket.id) return;
    const all = room.players.map(p => ({ name: p.name, word: room.assignments[p.id] || '?' }));
    room.gameState = 'ended';
    io.to(room.code).emit('whoami-game-ended', { all });
  });

  socket.on('whoami-play-again', () => {
    const room = whoamiRooms[socket.whoamiCode];
    if (!room || room.host !== socket.id) return;
    room.gameState = 'lobby';
    room.assignments = {};
    io.to(room.code).emit('whoami-reset');
    io.to(room.code).emit('room-update', sanitizeWhoamiRoom(room));
  });

  socket.on('whoami-rejoin', ({ code, name }) => {
    const room = whoamiRooms[(code || '').toUpperCase()];
    if (!room) return socket.emit('error', { message: 'Room no longer exists.' });
    const player = room.players.find(p => p.name === name);
    if (!player) return socket.emit('error', { message: 'You are no longer in this room.' });
    const oldId = player.id;
    player.id = socket.id;
    socket.join(room.code);
    socket.whoamiCode = room.code;
    socket.playerName = name;
    if (room.host === oldId) { room.host = socket.id; player.isHost = true; }
    if (room.assignments && room.assignments[oldId] !== undefined) {
      room.assignments[socket.id] = room.assignments[oldId];
      delete room.assignments[oldId];
    }
    socket.emit('whoami-rejoin-ack', { code: room.code, playerId: socket.id });
    socket.emit('room-update', sanitizeWhoamiRoom(room));
    io.to(room.code).emit('room-update', sanitizeWhoamiRoom(room));
  });

  // Disconnect — grace period so brief blips don't destroy rooms
  socket.on('disconnect', () => {
    const name = socket.playerName || 'A player';

    // Unified lobby room (imposter / whoami / spyfall)
    const room = rooms[socket.roomCode];
    if (room) {
      if (!room._dcTimers) room._dcTimers = {};
      const delay = room.gameState !== 'lobby' ? 60000 : 30000;
      room._dcTimers[socket.id] = setTimeout(() => { _removePlayer(room, socket.id, name); }, delay);
    }
  });
});

function _removePlayer(room, socketId, name) {
  if (!room) return;
  room.players = room.players.filter(p => p.id !== socketId);
  if (room.readyPlayers) room.readyPlayers.delete(socketId);
  if (room.players.length === 0) { delete rooms[room.code]; return; }
  if (room.host === socketId) {
    room.host = room.players[0].id;
    room.players[0].isHost = true;
  }
  io.to(room.code).emit('room-update', sanitizeRoom(room));
  io.to(room.code).emit('player-left', { name });
}

app.get('/ping', (req, res) => res.send('ok'));

app.get('/api/categories', (req, res) => {
  const cats = Object.entries(CATEGORIES).map(([key, val]) => ({
    key, name: val.name, count: val.items.length
  }));
  res.json(cats);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
