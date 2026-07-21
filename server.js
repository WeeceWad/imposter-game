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
      "Roblox", "Minecraft", "Fortnite", "Counter-Strike 2", "League of Legends",
      "Grand Theft Auto V", "Call of Duty", "Call of Duty: Black Ops",
      "Call of Duty: Black Ops II", "Call of Duty: Black Ops III",
      "Call of Duty: Black Ops Cold War", "Call of Duty: Black Ops 6",
      "Call of Duty: Black Ops 7", "Call of Duty: Modern Warfare",
      "Call of Duty: Modern Warfare II", "Call of Duty: Modern Warfare III",
      "PUBG", "Valorant", "The Sims 4", "Candy Crush Saga", "Clash of Clans",
      "Overwatch", "Overwatch 2", "Dota 2", "Genshin Impact", "Apex Legends",
      "Rocket League", "EA Sports FC", "EA Sports FC 25", "EA Sports FC 26",
      "NBA 2K", "NBA 2K25", "NBA 2K26", "World of Warcraft", "Final Fantasy XIV",
      "Destiny 2", "Warframe", "Terraria", "Stardew Valley",
      "Animal Crossing New Horizons", "Pokémon series", "Pokémon Go",
      "Mario Kart 8 Deluxe", "Mario Kart World", "Red Dead Redemption 2",
      "Elden Ring", "Helldivers 2", "Resident Evil Requiem", "Marvel Rivals",
      "Black Myth Wukong", "Palworld", "Lethal Company", "It Takes Two",
      "Hades", "Hades II", "Baldur's Gate 3", "Cyberpunk 2077",
      "The Legend of Zelda Breath of the Wild",
      "The Legend of Zelda Tears of the Kingdom", "Super Mario Odyssey",
      "Street Fighter 6", "Mortal Kombat 1", "Tekken 8",
      "Dragon Ball Sparking Zero", "Monster Hunter Wilds", "Monster Hunter Rise",
      "Diablo IV", "Path of Exile", "Path of Exile 2", "Throne and Liberty",
      "New World", "Once Human", "The First Descendant", "Split Fiction",
      "ARC Raiders", "Forza Horizon 5", "Forza Horizon 6",
      "Call of Duty Warzone", "Dead by Daylight", "Phasmophobia",
      "Deep Rock Galactic", "Satisfactory", "Factorio", "No Man's Sky",
      "Sea of Thieves", "Grounded", "Valheim", "7 Days to Die", "DayZ",
      "Rust", "Ark Survival Evolved", "Conan Exiles", "War Thunder",
      "Black Desert Online", "Elder Scrolls Online", "Guild Wars 2",
      "Old School RuneScape", "Tetris", "Pac-Man", "Marvel's Spider-Man 2",
      "MLB The Show 26", "WWE 2K26", "Battlefield 6", "Halo Infinite",
      "Assassin's Creed Valhalla", "Assassin's Creed Shadows", "The Witcher 3",
      "Doom Eternal", "Doom The Dark Ages", "Tomb Raider",
      "God of War Ragnarok", "Horizon Forbidden West", "The Last of Us Part II",
      "Uncharted 4", "Gran Turismo 7", "Need for Speed Unbound",
      "Clash Royale", "Super Smash Bros Ultimate", "Kirby and the Forgotten Land",
      "Sonic Frontiers", "Crash Bandicoot N Sane Trilogy",
      "Spyro Reignited Trilogy", "Starfield", "Fallout 4", "Fallout 76",
      "Skyrim", "Oblivion", "Monster Hunter Stories 3", "Nioh 3",
      "Crimson Desert", "Marathon", "Fable",
      "Kingdom Come Deliverance II", "Dragon Age The Veilguard",
      "Mass Effect Legendary Edition", "Subnautica"
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
      // Football
      "Cristiano Ronaldo", "Lionel Messi", "David Beckham", "Harry Kane",
      "Wayne Rooney", "Jude Bellingham", "Mohamed Salah", "Erling Haaland",
      "Kylian Mbappe", "Kevin De Bruyne", "Virgil van Dijk", "Trent Alexander-Arnold",
      "Bukayo Saka", "Phil Foden", "Marcus Rashford", "Declan Rice",
      "Son Heung-min", "Neymar", "Ronaldinho", "Pele", "Diego Maradona",
      "Thierry Henry", "Frank Lampard", "Steven Gerrard", "Rio Ferdinand",
      "John Terry", "Paul Pogba", "Antoine Griezmann", "Robert Lewandowski",
      "Luka Modric", "Toni Kroos",
      // Boxing
      "Muhammad Ali", "Mike Tyson", "Floyd Mayweather", "Anthony Joshua",
      "Tyson Fury", "Canelo Alvarez", "Deontay Wilder", "Manny Pacquiao",
      "Sugar Ray Leonard", "Oscar De La Hoya", "Lennox Lewis",
      "Vitali Klitschko", "Wladimir Klitschko", "Jake Paul", "Tommy Fury",
      "Amir Khan", "Ricky Hatton", "Carl Froch", "Joe Calzaghe",
      "Roy Jones Jr", "Evander Holyfield", "George Foreman",
      // MMA
      "Conor McGregor", "Jon Jones", "Khabib Nurmagomedov", "Georges St-Pierre",
      "Anderson Silva", "Israel Adesanya", "Alex Pereira", "Tom Aspinall",
      "Leon Edwards", "Michael Bisping", "Dustin Poirier", "Charles Oliveira",
      "Sean Strickland", "Khamzat Chimaev", "Paddy Pimblett", "Nate Diaz",
      "Nick Diaz", "Francis Ngannou", "Ciryl Gane", "Alexander Volkanovski",
      "Max Holloway", "Justin Gaethje",
      // F1
      "Lewis Hamilton", "Max Verstappen", "Michael Schumacher", "Fernando Alonso",
      "Sebastian Vettel", "Daniel Ricciardo", "Lando Norris", "Charles Leclerc",
      "George Russell", "Ayrton Senna"
    ]
  },

  actors: {
    name: "🎭 Actors",
    items: [
      "Tom Hanks", "Leonardo DiCaprio", "Tom Cruise", "Robert Downey Jr",
      "Dwayne Johnson", "Will Smith", "Brad Pitt", "Johnny Depp",
      "Denzel Washington", "Samuel L Jackson", "Morgan Freeman", "Harrison Ford",
      "Arnold Schwarzenegger", "Sylvester Stallone", "Keanu Reeves", "Matt Damon",
      "Ben Affleck", "Chris Hemsworth", "Chris Pratt", "Ryan Reynolds",
      "Hugh Jackman", "Daniel Craig", "Idris Elba", "Jason Statham",
      "Vin Diesel", "Mark Wahlberg", "Adam Sandler", "Jim Carrey",
      "Will Ferrell", "Steve Carell", "Bradley Cooper", "Christian Bale",
      "Joaquin Phoenix", "Timothee Chalamet", "Austin Butler", "Cillian Murphy",
      "Andrew Garfield", "Ryan Gosling", "Paul Rudd", "Chris Evans",
      "Scarlett Johansson", "Jennifer Aniston", "Angelina Jolie", "Margot Robbie",
      "Zendaya", "Emma Stone", "Julia Roberts", "Meryl Streep",
      "Sandra Bullock", "Anne Hathaway", "Nicole Kidman", "Charlize Theron",
      "Emma Watson", "Florence Pugh", "Anya Taylor-Joy", "Sydney Sweeney",
      "Gal Gadot", "Elizabeth Olsen", "Brie Larson", "Natalie Portman",
      "Reese Witherspoon", "Jennifer Lawrence", "Kate Winslet"
    ]
  },

  musicArtists: {
    name: "🎵 Music Artists",
    items: [
      // Solo artists
      "Michael Jackson", "Elvis Presley", "Taylor Swift", "Beyonce",
      "Ed Sheeran", "Adele", "Eminem", "Drake", "Justin Bieber", "Rihanna",
      "Elton John", "David Bowie", "Whitney Houston", "Freddie Mercury",
      "Bruno Mars", "Harry Styles", "Post Malone", "The Weeknd",
      "Ariana Grande", "Billie Eilish", "Olivia Rodrigo", "Sabrina Carpenter",
      "Miley Cyrus", "Justin Timberlake", "Britney Spears", "Christina Aguilera",
      "Kanye West", "Jay-Z", "Snoop Dogg", "50 Cent", "Travis Scott",
      "Kendrick Lamar", "Cardi B", "Doja Cat", "Nicki Minaj", "Lewis Capaldi",
      "Sam Smith", "Dua Lipa", "Calvin Harris", "Shawn Mendes",
      "Camila Cabello", "Selena Gomez", "Lady Gaga", "Katy Perry",
      "Pink", "Usher", "Prince", "Madonna", "George Michael",
      "Stevie Wonder", "Bob Marley", "Phil Collins",
      // Bands & Groups
      "The Beatles", "Queen", "Rolling Stones", "Led Zeppelin", "Pink Floyd",
      "Oasis", "Coldplay", "Nirvana", "Guns N Roses", "Fleetwood Mac",
      "AC/DC", "Metallica", "Red Hot Chili Peppers", "Foo Fighters",
      "Arctic Monkeys", "Radiohead", "Linkin Park", "Green Day", "Blink-182",
      "The Killers", "Imagine Dragons", "One Direction", "Backstreet Boys",
      "NSYNC", "Maroon 5", "Kings of Leon", "Fall Out Boy"
    ]
  },

  youtubers: {
    name: "📺 YouTubers",
    items: [
      "MrBeast", "PewDiePie", "Markiplier", "Jacksepticeye", "Logan Paul",
      "KSI", "Sidemen", "TommyInnit", "Dream", "Dude Perfect",
      "Rhett & Link", "Ninja", "Tfue", "xQc", "Kai Cenat",
      "IShowSpeed", "Adin Ross", "Andrew Tate", "Tristan Tate", "Joe Rogan",
      "Theo Von", "DanTDM", "James Charles", "Jeffree Star", "Shane Dawson",
      "David Dobrik", "Zach King", "Vsauce", "Smosh", "MatPat", "Mark Rober"
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
  },

  randomWords: {
    name: "🎲 Random Words",
    items: [
      "Umbrella", "Kettle", "Sandcastle", "Lampshade", "Doorknob", "Toothbrush",
      "Wheelbarrow", "Pillowcase", "Candlestick", "Flowerpot", "Backpack", "Suitcase",
      "Hammock", "Dartboard", "Watering Can", "Bookshelf", "Birdcage", "Doorbell",
      "Padlock", "Compass", "Magnifying Glass", "Stopwatch", "Hourglass", "Thermometer",
      "Stapler", "Paperclip", "Rubber Band", "Drawing Pin", "Sticky Note", "Envelope",
      "Stamp", "Ruler", "Protractor", "Calculator", "Pencil Case", "Whiteboard",
      "Corkboard", "Filing Cabinet", "Hole Punch", "Desk Lamp", "Keyboard", "Mouse Pad",
      "Headphones", "Microphone", "Webcam", "USB Stick", "Hard Drive", "Charger",
      "Extension Lead", "Light Bulb", "Candle", "Torch", "Lantern", "Battery",
      "Fuse", "Plug", "Socket", "Switch", "Thermostat", "Radiator",
      "Boiler", "Pipe", "Tap", "Drain", "Gutter", "Chimney",
      "Fence", "Gate", "Hedge", "Driveway", "Patio", "Decking",
      "Greenhouse", "Shed", "Ladder", "Hosepipe", "Lawnmower", "Rake",
      "Shovel", "Trowel", "Wheelbarrow", "Bucket", "Mop", "Broom",
      "Dustpan", "Bin Bag", "Recycling Box", "Compost Bin", "Washing Line", "Clothes Peg",
      "Iron", "Ironing Board", "Clothes Airer", "Laundry Basket", "Tumble Dryer", "Washing Machine",
      "Dishwasher", "Microwave", "Toaster", "Blender", "Kettle", "Coffee Machine",
      "Fridge", "Freezer", "Oven", "Hob", "Extractor Fan", "Sink",
      "Chopping Board", "Rolling Pin", "Colander", "Sieve", "Mixing Bowl", "Whisk",
      "Spatula", "Ladle", "Tongs", "Grater", "Peeler", "Can Opener",
      "Corkscrew", "Bottle Opener", "Wine Rack", "Fruit Bowl", "Bread Bin", "Cake Tin",
      "Baking Tray", "Roasting Tin", "Casserole Dish", "Frying Pan", "Saucepan", "Wok",
      "Teapot", "Cafetiere", "Mug", "Tumbler", "Wine Glass", "Champagne Flute",
      "Pint Glass", "Shot Glass", "Plate", "Bowl", "Side Plate", "Soup Spoon",
      "Dessert Spoon", "Teaspoon", "Fork", "Butter Knife", "Steak Knife", "Chopsticks",
      "Napkin", "Tablecloth", "Placemat", "Coaster", "Tray", "Serving Dish",
      "Salad Bowl", "Salt Shaker", "Pepper Grinder", "Mustard Pot", "Sauce Bottle", "Sugar Bowl",
      "Butter Dish", "Cheese Board", "Bread Basket", "Gravy Boat", "Jug", "Thermos",
      "Lunchbox", "Carrier Bag", "Shopping Trolley", "Loyalty Card", "Voucher", "Receipt",
      "Purse", "Wallet", "Lanyard", "Keyring", "Door Key", "Padlock",
      "Safe", "Piggy Bank", "Money Box", "Coin Jar", "Wallet Chain", "Belt",
      "Shoelace", "Insole", "Boot", "Sandal", "Slipper", "Flip Flop",
      "Sock", "Tights", "Legging", "Jeans", "Shorts", "Joggers",
      "Hoodie", "Cardigan", "Blazer", "Waistcoat", "Tie", "Bow Tie",
      "Cufflinks", "Brooch", "Badge", "Patch", "Zipper", "Button",
      "Needle", "Thread", "Thimble", "Sewing Machine", "Scissors", "Tape Measure",
      "Mannequin", "Hanger", "Wardrobe", "Chest of Drawers", "Bedside Table", "Duvet",
      "Pillow", "Mattress", "Bed Frame", "Bunk Bed", "Sofa Bed", "Hammock",
      "Armchair", "Footstool", "Beanbag", "Rocking Chair", "Bar Stool", "Bench",
      "Coffee Table", "Side Table", "Bookcase", "Television", "Remote Control", "Aerial",
      "Satellite Dish", "Router", "Cable", "Plug Socket", "Power Strip", "Surge Protector",
      "Smoke Alarm", "Carbon Monoxide Detector", "Fire Extinguisher", "First Aid Kit", "Plaster", "Bandage",
      "Tweezers", "Thermometer", "Syringe", "Stethoscope", "Magnifying Glass", "Microscope",
      "Telescope", "Binoculars", "Camera", "Tripod", "Photo Frame", "Album",
      "Jigsaw", "Dice", "Playing Cards", "Chess Board", "Draughts Board", "Scrabble",
      "Monopoly", "Jenga", "Uno", "Rubik's Cube", "Yoyo", "Frisbee",
      "Hula Hoop", "Jump Rope", "Kite", "Boomerang", "Slingshot", "Marbles",
      "Balloon", "Party Popper", "Confetti", "Streamer", "Bunting", "Banner",
      "Trophy", "Medal", "Certificate", "Ribbon", "Plaque", "Stamp Collection",
      "Snow Globe", "Lava Lamp", "Wind Chime", "Dream Catcher", "Incense Stick", "Oil Diffuser",
      "Candle Holder", "Picture Hook", "Shelf Bracket", "Spirit Level", "Drill", "Screwdriver",
      "Hammer", "Wrench", "Pliers", "Tape", "Glue Gun", "Sandpaper",
      "Paint Brush", "Roller", "Paint Tin", "Masking Tape", "Putty Knife", "Caulk Gun",
      "Saw", "Chisel", "Clamp", "Workbench", "Tool Belt", "Safety Goggles",
      "Hardhat", "Hi-Vis Vest", "Steel Toe Cap", "Ear Defenders", "Dust Mask", "Rubber Gloves",
      "Wheelie Bin", "Recycling Bag", "Cardboard Box", "Bubble Wrap", "Packing Tape", "Label",
      "Marker Pen", "Highlighter", "Biro", "Fountain Pen", "Pencil", "Chalk",
      "Eraser", "Correction Fluid", "Sharpener", "Set Square", "Compass", "Protractor",
      "Graph Paper", "Notepad", "Folder", "Binder", "Divider", "Index Card",
      "Staple", "Paper Clip", "Binder Clip", "Rubber Band", "Sticky Tab", "Bookmark",
      "Newspaper", "Magazine", "Catalogue", "Brochure", "Leaflet", "Flyer",
      "Postcard", "Greeting Card", "Wrapping Paper", "Ribbon", "Bow", "Gift Tag",
      "Sellotape", "Double-Sided Tape", "Blu-Tack", "Drawing Pin", "Pushpin", "Corkboard",
      "Whiteboard Marker", "Dry Erase", "Overhead Projector", "Projector Screen", "Pointer", "Clicker",
      "Lanyard", "Name Badge", "Business Card", "Clipboard", "Ring Binder", "Lever Arch File"
    ]
  }
};

// ─────────────────────────────────────────────
// BLIND RANKING — PRESET PLAYLISTS & PARSER
// ─────────────────────────────────────────────
const PRESET_PLAYLISTS = {
  tophits: {
    name: "🎵 Top Hits & Chart Toppers",
    tracks: [
      { title: "Blinding Lights", artist: "The Weeknd", artwork: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5a8636" },
      { title: "As It Was", artist: "Harry Styles", artwork: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d0703c64a400" },
      { title: "Shape of You", artist: "Ed Sheeran", artwork: "https://i.scdn.co/image/ab67616d0000b273ba5d9070711339e325093610" },
      { title: "Cruel Summer", artist: "Taylor Swift", artwork: "https://i.scdn.co/image/ab67616d0000b273e787cffcb670b28045435e16" },
      { title: "Levitating", artist: "Dua Lipa", artwork: "https://i.scdn.co/image/ab67616d0000b273f6a2d9c0203f90f2305370d0" },
      { title: "Starboy", artist: "The Weeknd ft. Daft Punk", artwork: "https://i.scdn.co/image/ab67616d0000b2734718e2412e7ef14757781119" },
      { title: "Flowers", artist: "Miley Cyrus", artwork: "https://i.scdn.co/image/ab67616d0000b273f42004b0f43dcb940e53a3f5" },
      { title: "Stay", artist: "The Kid LAROI & Justin Bieber", artwork: "https://i.scdn.co/image/ab67616d0000b273fc918b95083c27e1f4e1f7d5" },
      { title: "Bad Guy", artist: "Billie Eilish", artwork: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd777335789fdb" },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", artwork: "https://i.scdn.co/image/ab67616d0000b273e8fa0e9d1e4344d673998d5f" },
      { title: "Dance Monkey", artist: "Tones and I", artwork: "https://i.scdn.co/image/ab67616d0000b2731d97ca7376f835055f828120" },
      { title: "Watermelon Sugar", artist: "Harry Styles", artwork: "https://i.scdn.co/image/ab67616d0000b2737748706225e272b40994f090" },
      { title: "Rolling in the Deep", artist: "Adele", artwork: "https://i.scdn.co/image/ab67616d0000b2732118bf9b198b05a95ded6300" },
      { title: "Montero", artist: "Lil Nas X", artwork: "https://i.scdn.co/image/ab67616d0000b273be82673b5f70146033333333" }
    ]
  },
  rock: {
    name: "🎸 90s & 2000s Rock",
    tracks: [
      { title: "Mr. Brightside", artist: "The Killers", artwork: "https://i.scdn.co/image/ab67616d0000b273cbd7498c253457a419eb502b" },
      { title: "Smells Like Teen Spirit", artist: "Nirvana", artwork: "https://i.scdn.co/image/ab67616d0000b273e178a38287c5eb871143c7b6" },
      { title: "Wonderwall", artist: "Oasis", artwork: "https://i.scdn.co/image/ab67616d0000b273d6b0521e42c26210f69a531e" },
      { title: "In The End", artist: "Linkin Park", artwork: "https://i.scdn.co/image/ab67616d0000b273e2f039ad9015a85532dd63f0" },
      { title: "Seven Nation Army", artist: "The White Stripes", artwork: "https://i.scdn.co/image/ab67616d0000b2732958fb47071cb29837fb89d0" },
      { title: "Sex on Fire", artist: "Kings of Leon", artwork: "https://i.scdn.co/image/ab67616d0000b27361a4c9b2f3e82aa83ab60d3d" },
      { title: "Bohemian Rhapsody", artist: "Queen", artwork: "https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4ab25a" },
      { title: "Sweet Child O' Mine", artist: "Guns N' Roses", artwork: "https://i.scdn.co/image/ab67616d0000b27321e100e470a24eb5ef74a589" },
      { title: "Welcome to the Black Parade", artist: "My Chemical Romance", artwork: "https://i.scdn.co/image/ab67616d0000b2731557088b394142f36d44ef4a" },
      { title: "American Idiot", artist: "Green Day", artwork: "https://i.scdn.co/image/ab67616d0000b27317e0766ff31562b700f1350a" },
      { title: "Sugar, We're Goin Down", artist: "Fall Out Boy", artwork: "https://i.scdn.co/image/ab67616d0000b27319c5cc3a8b417e25e98544ab" },
      { title: "All Star", artist: "Smash Mouth", artwork: "https://i.scdn.co/image/ab67616d0000b27357ddc0757d54b4f59e99c80d" }
    ]
  },
  gaming: {
    name: "👾 Video Game Soundtracks",
    tracks: [
      { title: "Sweden", artist: "C418 (Minecraft)", artwork: "https://i.scdn.co/image/ab67616d0000b273891df4545d9472e90e796068" },
      { title: "Megalovania", artist: "Toby Fox (Undertale)", artwork: "https://i.scdn.co/image/ab67616d0000b273e970b89b4f98efae44bfa2e9" },
      { title: "Super Mario Bros. Theme", artist: "Koji Kondo", artwork: "https://i.scdn.co/image/ab67616d0000b27341db7ab781531640fa889417" },
      { title: "Gerudo Valley", artist: "Koji Kondo (Zelda OOT)", artwork: "https://i.scdn.co/image/ab67616d0000b273df85e135be3e7fbd1a72d7f8" },
      { title: "Dragonborn (Skyrim Theme)", artist: "Jeremy Soule", artwork: "https://i.scdn.co/image/ab67616d0000b2738f6d634289ea6ab38479e002" },
      { title: "Halo Main Theme", artist: "Martin O'Donnell", artwork: "https://i.scdn.co/image/ab67616d0000b273e226462719a86b1cce8e21bd" },
      { title: "Tetris Theme (Korobeiniki)", artist: "Hirokazu Tanaka", artwork: "https://i.scdn.co/image/ab67616d0000b273618f504d603a118f1a14b3ff" },
      { title: "BFG Division", artist: "Mick Gordon (DOOM)", artwork: "https://i.scdn.co/image/ab67616d0000b273ae847efbfab83437e6f80993" },
      { title: "Still Alive", artist: "Jonathan Coulton (Portal)", artwork: "https://i.scdn.co/image/ab67616d0000b273bebc00f2824cfabcf60b0e51" },
      { title: "Gotta Catch 'Em All", artist: "Jason Paige (Pokémon)", artwork: "https://i.scdn.co/image/ab67616d0000b2735740445d4ce262444ffbdf8e" },
      { title: "Green Hill Zone", artist: "Masato Nakamura (Sonic)", artwork: "https://i.scdn.co/image/ab67616d0000b273579199d701df9305ff6412b1" }
    ]
  },
  disney: {
    name: "🏰 Disney Classics",
    tracks: [
      { title: "Let It Go", artist: "Idina Menzel (Frozen)", artwork: "https://i.scdn.co/image/ab67616d0000b273ca35c91b5c4689bb53b49915" },
      { title: "A Whole New World", artist: "Zayn & Zhavia Ward (Aladdin)", artwork: "https://i.scdn.co/image/ab67616d0000b273aa77dcadad9f57ebbf7ee784" },
      { title: "We Don't Talk About Bruno", artist: "Encanto Cast", artwork: "https://i.scdn.co/image/ab67616d0000b273010b42f65a1b5c879308ed4f" },
      { title: "Under the Sea", artist: "Samuel E. Wright (Little Mermaid)", artwork: "https://i.scdn.co/image/ab67616d0000b2738a19213bc5409cb3308ec396" },
      { title: "How Far I'll Go", artist: "Auli'i Cravalho (Moana)", artwork: "https://i.scdn.co/image/ab67616d0000b273d42b93bd20f8cddaeae3cfd5" },
      { title: "You've Got a Friend in Me", artist: "Randy Newman (Toy Story)", artwork: "https://i.scdn.co/image/ab67616d0000b27339d2ec05b38ed3aeead17bc3" },
      { title: "I'll Make a Man Out of You", artist: "Donny Osmond (Mulan)", artwork: "https://i.scdn.co/image/ab67616d0000b273617be8ed4db5326bb1d6efee" },
      { title: "Hakuna Matata", artist: "Nathan Lane (The Lion King)", artwork: "https://i.scdn.co/image/ab67616d0000b27364b6ffdd88e13ca40fcaae73" },
      { title: "Remember Me", artist: "Gael García Bernal (Coco)", artwork: "https://i.scdn.co/image/ab67616d0000b273c50bf37b8bfcaaa0ee327f30" },
      { title: "Life is a Highway", artist: "Rascal Flatts (Cars)", artwork: "https://i.scdn.co/image/ab67616d0000b27338efac039ec7ea7ecb6b9077" }
    ]
  },
  tiktok: {
    name: "📱 TikTok & Viral Hits",
    tracks: [
      { title: "Espresso", artist: "Sabrina Carpenter", artwork: "https://i.scdn.co/image/ab67616d0000b273fd8d7a049444ea595447171e" },
      { title: "360", artist: "Charli XCX", artwork: "https://i.scdn.co/image/ab67616d0000b2738978b87fcf3098197779f743" },
      { title: "Not Like Us", artist: "Kendrick Lamar", artwork: "https://i.scdn.co/image/ab67616d0000b2731ea0c82800dd782d49931b6f" },
      { title: "Good Luck, Babe!", artist: "Chappell Roan", artwork: "https://i.scdn.co/image/ab67616d0000b2730303f83c18b6ec4210a4fa14" },
      { title: "Cupid", artist: "FIFTY FIFTY", artwork: "https://i.scdn.co/image/ab67616d0000b27337e3d00f6071987d6050b1d3" },
      { title: "Golden Hour", artist: "JVKE", artwork: "https://i.scdn.co/image/ab67616d0000b273955681be15c928236d6a267e" },
      { title: "Heat Waves", artist: "Glass Animals", artwork: "https://i.scdn.co/image/ab67616d0000b2739e495fb707973fdb14a4b1ca" },
      { title: "Running Up That Hill", artist: "Kate Bush", artwork: "https://i.scdn.co/image/ab67616d0000b273a7027d14d2a1b9fb54d6eb29" },
      { title: "Murder on the Dancefloor", artist: "Sophie Ellis-Bextor", artwork: "https://i.scdn.co/image/ab67616d0000b273180eb6d0e6c1341c2aebff7d" },
      { title: "Sunroof", artist: "Nicky Youre", artwork: "https://i.scdn.co/image/ab67616d0000b2733842603848b8ef4d61994b79" }
    ]
  },
  anime: {
    name: "🎌 Anime Openings",
    tracks: [
      { title: "A Cruel Angel's Thesis", artist: "Yoko Takahashi (Evangelion)", artwork: "https://i.scdn.co/image/ab67616d0000b273426e85e05dd6ae0e7855018f" },
      { title: "Unravel", artist: "TK from Ling Tosite Sigure (Tokyo Ghoul)", artwork: "https://i.scdn.co/image/ab67616d0000b2731e8bf43eefca9cf318357b98" },
      { title: "Gurenge", artist: "LiSA (Demon Slayer)", artwork: "https://i.scdn.co/image/ab67616d0000b273b063ee33f00e99e4f54e1d78" },
      { title: "The Hero!!", artist: "JAM Project (One Punch Man)", artwork: "https://i.scdn.co/image/ab67616d0000b27329596c568d407ff290352ffb" },
      { title: "Blue Bird", artist: "Ikimonogakari (Naruto)", artwork: "https://i.scdn.co/image/ab67616d0000b2734c5fae4604b3dd3c6aa1edfb" },
      { title: "Tank!", artist: "SEATBELTS (Cowboy Bebop)", artwork: "https://i.scdn.co/image/ab67616d0000b273fc2d93e8276f7ed9357d605c" },
      { title: "Guren no Yumiya", artist: "Linked Horizon (Attack on Titan)", artwork: "https://i.scdn.co/image/ab67616d0000b2731eb1b4b1a4a4087964b4c7ca" },
      { title: "Kick Back", artist: "Kenshi Yonezu (Chainsaw Man)", artwork: "https://i.scdn.co/image/ab67616d0000b273c52a36b528b753a8174541cb" },
      { title: "Kaikai Kitan", artist: "Eve (Jujutsu Kaisen)", artwork: "https://i.scdn.co/image/ab67616d0000b27339d1b09b53147ef3a31c6d1a" },
      { title: "Crossing Field", artist: "LiSA (Sword Art Online)", artwork: "https://i.scdn.co/image/ab67616d0000b27318ff24bb6a30c5e7b23577d6" }
    ]
  }
};

async function getSpotifyApiToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    const data = await res.json();
    return data.access_token || null;
  } catch (e) {
    return null;
  }
}

async function parsePlaylistUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return [];
  const cleanUrl = urlStr.trim();
  
  // Spotify Playlist
  const spotifyMatch = cleanUrl.match(/(?:playlist[\/:])([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    const playlistId = spotifyMatch[1];
    
    // Try Spotify Web API if credentials exist
    const apiToken = await getSpotifyApiToken();
    if (apiToken) {
      try {
        let offset = 0;
        const allSpotifyTracks = [];
        let hasMore = true;
        while (hasMore && allSpotifyTracks.length < 500) {
          const apiRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=${offset}`, {
            headers: { 'Authorization': `Bearer ${apiToken}` }
          });
          const apiData = await apiRes.json();
          if (apiData.items && Array.isArray(apiData.items)) {
            apiData.items.forEach(item => {
              const trackObj = item.track;
              if (trackObj && trackObj.name) {
                allSpotifyTracks.push({
                  title: trackObj.name,
                  artist: trackObj.artists ? trackObj.artists.map(a => a.name).join(', ') : 'Unknown Artist',
                  artwork: trackObj.album?.images?.[0]?.url || '',
                  audioUrl: trackObj.preview_url || '',
                  id: trackObj.id || Math.random().toString(36).substr(2, 9),
                  spotifyId: trackObj.id
                });
              }
            });
            hasMore = !!apiData.next && apiData.items.length > 0;
            offset += 100;
          } else {
            hasMore = false;
          }
        }
        if (allSpotifyTracks.length > 0) return allSpotifyTracks;
      } catch (e) {
        console.error('Spotify API fetch error:', e.message);
      }
    }

    // Embed HTML fallback
    try {
      const embedRes = await fetch(`https://open.spotify.com/embed/playlist/${playlistId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      const html = await embedRes.text();
      const scriptMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
      if (scriptMatch) {
        const json = JSON.parse(scriptMatch[1]);
        const entity = json?.props?.pageProps?.state?.data?.entity;
        const trackList = entity?.trackList || entity?.tracks?.items || [];
        if (Array.isArray(trackList) && trackList.length > 0) {
          return trackList.map(item => {
            const trackObj = item.track || item;
            const title = trackObj.title || trackObj.name || 'Unknown Track';
            const artist = trackObj.subtitle || (trackObj.artists ? trackObj.artists.map(a => a.name).join(', ') : 'Unknown Artist');
            const artwork = trackObj.coverArt?.sources?.[0]?.url || trackObj.album?.images?.[0]?.url || '';
            const audioUrl = trackObj.audioPreview?.url || trackObj.preview_url || '';
            const id = trackObj.uri ? trackObj.uri.split(':')[2] : (trackObj.id || Math.random().toString(36).substr(2, 9));
            return { title, artist, artwork, audioUrl, id, spotifyId: id };
          }).filter(t => t.title && t.title !== 'Unknown Track');
        }
      }
    } catch (e) {
      console.error('Spotify playlist parsing error:', e.message);
    }
  }

  // YouTube / YouTube Music Playlist with Pagination
  const ytMatch = cleanUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    const playlistId = ytMatch[1];
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      try {
        let pageToken = '';
        const allYtItems = [];
        do {
          const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}${pageToken ? '&pageToken=' + pageToken : ''}`;
          const ytRes = await fetch(url);
          const ytData = await ytRes.json();
          if (ytData.items && Array.isArray(ytData.items)) {
            allYtItems.push(...ytData.items);
          }
          pageToken = ytData.nextPageToken || '';
        } while (pageToken && allYtItems.length < 500);

        if (allYtItems.length > 0) {
          return allYtItems.map(item => ({
            title: item.snippet.title,
            artist: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle || 'YouTube Music',
            artwork: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.high?.url || '',
            videoId: item.snippet.resourceId?.videoId,
            embedUrl: `https://www.youtube.com/embed/${item.snippet.resourceId?.videoId}`
          })).filter(t => t.title && t.title !== 'Deleted video' && t.title !== 'Private video');
        }
      } catch (e) {
        console.error('YouTube API playlist fetch error:', e.message);
      }
    }
  }

  return [];
}

function parseCustomSongList(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
  return lines.map((line, idx) => {
    let artist = "Custom Track";
    let title = line;
    if (line.includes("-")) {
      const parts = line.split("-");
      artist = parts[0].trim();
      title = parts.slice(1).join("-").trim();
    }
    return { title, artist, artwork: "", id: `custom-${idx}` };
  });
}



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

// ─────────────────────────────────────────────
// QUESTIONS MODE — PAIRS
// ─────────────────────────────────────────────
const QUESTIONS = [
  { playerQ: "What food could you eat every single day?", imposterQ: "What food could you never bring yourself to eat?" },
  { playerQ: "If you could live anywhere in the world, where would you choose?", imposterQ: "If you had to leave your country forever, where would you least want to go?" },
  { playerQ: "What's your favourite film of all time?", imposterQ: "What film do you think is massively overrated?" },
  { playerQ: "What hobby would you take up if you had unlimited free time?", imposterQ: "What hobby do you think is the biggest waste of time?" },
  { playerQ: "What's the best thing about summer?", imposterQ: "What's the most annoying thing about summer?" },
  { playerQ: "What animal would you have as a pet if you could pick any?", imposterQ: "What animal do you find the most terrifying?" },
  { playerQ: "What superpower would you most want to have?", imposterQ: "What superpower do you think would be completely useless?" },
  { playerQ: "Which celebrity would you most like to have dinner with?", imposterQ: "Which celebrity do you think would be the worst dinner guest?" },
  { playerQ: "What sport do you most enjoy watching?", imposterQ: "What sport do you find the most boring to watch?" },
  { playerQ: "What would you do first if you won a million pounds?", imposterQ: "What's the most ridiculous waste of a million pounds you can think of?" },
  { playerQ: "What TV show are you most obsessed with right now?", imposterQ: "What TV show do you think is completely overrated?" },
  { playerQ: "What's the best meal of the day?", imposterQ: "What's the worst meal of the day to have to cook?" },
  { playerQ: "What music genre is your favourite?", imposterQ: "What music genre do you absolutely can't stand?" },
  { playerQ: "What makes you feel most relaxed after a long day?", imposterQ: "What instantly puts you in a terrible mood?" },
  { playerQ: "What's the best city you've ever visited?", imposterQ: "What place was the most disappointing you've ever visited?" },
  { playerQ: "What kind of weather is your favourite?", imposterQ: "What kind of weather makes you want to stay in bed all day?" },
  { playerQ: "What subject did you enjoy most at school?", imposterQ: "What subject did you absolutely dread at school?" },
  { playerQ: "What's your favourite type of holiday?", imposterQ: "What kind of holiday sounds like your worst nightmare?" },
  { playerQ: "What's a skill you're genuinely proud of having?", imposterQ: "What's something you're surprisingly terrible at?" },
  { playerQ: "What would your dream job be?", imposterQ: "What job would you absolutely refuse to do?" },
  { playerQ: "What app do you use most on your phone?", imposterQ: "What app do you think is a complete waste of space?" },
  { playerQ: "What fast food place is your go-to?", imposterQ: "What fast food restaurant would you never eat at?" },
  { playerQ: "What's the best decade for music?", imposterQ: "What decade had the worst music, in your opinion?" },
  { playerQ: "What historical period would you most like to visit?", imposterQ: "What historical period would be the most terrifying to actually live in?" },
  { playerQ: "What fictional character would you most like to be?", imposterQ: "What fictional character would you absolutely hate to be?" },
  { playerQ: "What's the best thing about technology today?", imposterQ: "What's the most annoying thing about modern technology?" },
  { playerQ: "What's something you'd happily splash money on?", imposterQ: "What's something you think is a complete waste of money?" },
  { playerQ: "What's the best gift you've ever received?", imposterQ: "What's the most disappointing gift you've ever been given?" },
  { playerQ: "What country would you most want to visit?", imposterQ: "What country would you least want to visit?" },
  { playerQ: "What film genre is your favourite?", imposterQ: "What film genre do you never bother watching?" },
  { playerQ: "What breakfast food is your absolute favourite?", imposterQ: "What breakfast food do you find absolutely disgusting?" },
  { playerQ: "What's something you could talk about for hours?", imposterQ: "What topic do you find unbearably boring to discuss?" },
  { playerQ: "What part of your daily routine do you most look forward to?", imposterQ: "What part of your daily routine do you dread the most?" },
  { playerQ: "What's the most impressive thing you can cook?", imposterQ: "What dish have you repeatedly failed to cook properly?" },
  { playerQ: "What language would you most like to speak fluently?", imposterQ: "What language do you think sounds the harshest to listen to?" },
  { playerQ: "What type of party is the most fun?", imposterQ: "What type of social event do you always try to get out of?" },
  { playerQ: "What's the best thing about getting older?", imposterQ: "What's the worst thing about getting older?" },
  { playerQ: "What animal do you think is the most impressive?", imposterQ: "What animal do you think is the most pointless?" },
  { playerQ: "What habit are you most proud of having?", imposterQ: "What's a bad habit you just can't seem to shake?" },
  { playerQ: "What's the most adventurous thing you've ever done?", imposterQ: "What's something you've done that you immediately regretted?" },
  { playerQ: "What would you do with a completely free Saturday?", imposterQ: "What's the worst way you could imagine spending a free Saturday?" },
  { playerQ: "What's your favourite time of year?", imposterQ: "What time of year do you dread the most?" },
  { playerQ: "What celebrity do you think is genuinely talented?", imposterQ: "What celebrity do you find the most irritating?" },
  { playerQ: "What's the best thing about where you live?", imposterQ: "What's the most annoying thing about where you live?" },
  { playerQ: "What childhood memory makes you smile the most?", imposterQ: "What's a memory from growing up you'd rather forget?" },
  { playerQ: "What sport would you most like to try?", imposterQ: "What sport do you think looks the most dangerous or reckless?" },
  { playerQ: "What's something on your bucket list?", imposterQ: "What's something people put on bucket lists that you'd never bother doing?" },
  { playerQ: "What's the most interesting job you've heard of someone having?", imposterQ: "What's the most tedious job you could imagine having?" },
  { playerQ: "What would you do with an extra hour every single day?", imposterQ: "What do you think people waste the most time doing?" },
  { playerQ: "What's the best thing about your friendship group?", imposterQ: "What's an annoying habit that a lot of people seem to have?" }
];

// ─────────────────────────────────────────────
// WAVELENGTH SPECTRA (100+ opposing-concept pairs)
// ─────────────────────────────────────────────
const WAVELENGTH_SPECTRA = [
  // User-provided pairs
  { left: 'Cold', right: 'Hot' },
  { left: 'Ugly', right: 'Beautiful' },
  { left: 'Boring', right: 'Exciting' },
  { left: 'Weak', right: 'Strong' },
  { left: 'Cheap', right: 'Expensive' },
  { left: 'Simple', right: 'Complex' },
  { left: 'Quiet', right: 'Loud' },
  { left: 'Slow', right: 'Fast' },
  { left: 'Sad', right: 'Happy' },
  { left: 'Dangerous', right: 'Safe' },
  { left: 'Fictional', right: 'Real' },
  { left: 'Bad', right: 'Good' },
  { left: 'Hated', right: 'Loved' },
  { left: 'Old', right: 'New' },
  { left: 'Small', right: 'Big' },
  { left: 'Short', right: 'Tall' },
  { left: 'Dark', right: 'Bright' },
  { left: 'Soft', right: 'Hard' },
  { left: 'Rare', right: 'Common' },
  { left: 'Useless', right: 'Useful' },
  { left: 'Unhealthy', right: 'Healthy' },
  { left: 'Unfair', right: 'Fair' },
  { left: 'Overrated', right: 'Underrated' },
  { left: 'Easy', right: 'Difficult' },
  { left: 'Cowardly', right: 'Brave' },
  { left: 'Selfish', right: 'Generous' },
  { left: 'Dumb', right: 'Intelligent' },
  { left: 'Lazy', right: 'Hardworking' },
  { left: 'Gross', right: 'Delicious' },
  { left: 'Forgettable', right: 'Iconic' },
  { left: 'Innocent', right: 'Guilty' },
  { left: 'Boring', right: 'Hilarious' },
  { left: 'Relaxing', right: 'Stressful' },
  { left: 'Normal', right: 'Weird' },
  { left: 'Natural', right: 'Artificial' },
  { left: 'Serious', right: 'Silly' },
  { left: 'Cruel', right: 'Kind' },
  { left: 'Ugly', right: 'Cute' },
  { left: 'Terrible', right: 'Amazing' },
  { left: 'Passive', right: 'Aggressive' },
  { left: 'Calm', right: 'Chaotic' },
  { left: 'Pessimistic', right: 'Optimistic' },
  { left: 'Introvert', right: 'Extrovert' },
  { left: 'Mature', right: 'Immature' },
  { left: 'Subtle', right: 'Obvious' },
  { left: 'Timid', right: 'Confident' },
  { left: 'Mainstream', right: 'Underground' },
  { left: 'Practical', right: 'Creative' },
  { left: 'Modern', right: 'Classic' },
  { left: 'Fragile', right: 'Tough' },
  { left: 'Cold', right: 'Warm' },
  { left: 'Cheap', right: 'Priceless' },
  { left: 'Forgiven', right: 'Unforgiven' },
  { left: 'Loved', right: 'Feared' },
  { left: 'Tasty', right: 'Disgusting' },
  { left: 'Smooth', right: 'Rough' },
  { left: 'Fancy', right: 'Casual' },
  { left: 'Lucky', right: 'Unlucky' },
  { left: 'Predictable', right: 'Unpredictable' },
  { left: 'Famous', right: 'Unknown' },
  { left: 'Trustworthy', right: 'Suspicious' },
  { left: 'Clean', right: 'Dirty' },
  { left: 'Early', right: 'Late' },
  { left: 'Awake', right: 'Asleep' },
  { left: 'Sober', right: 'Drunk' },
  { left: 'Skinny', right: 'Fat' },
  { left: 'Young', right: 'Old' },
  { left: 'Tight', right: 'Loose' },
  { left: 'Private', right: 'Public' },
  { left: 'Legal', right: 'Illegal' },
  { left: 'Online', right: 'Offline' },
  { left: 'Urban', right: 'Rural' },
  { left: 'Realistic', right: 'Fantasy' },
  { left: 'Romantic', right: 'Unromantic' },
  { left: 'Childish', right: 'Grown-up' },
  { left: 'Talented', right: 'Talentless' },
  { left: 'Organised', right: 'Messy' },
  { left: 'Polite', right: 'Rude' },
  { left: 'Humble', right: 'Arrogant' },
  { left: 'Loyal', right: 'Disloyal' },
  { left: 'Funny', right: 'Unfunny' },
  { left: 'Chill', right: 'Intense' },
  { left: 'Wholesome', right: 'Toxic' },
  { left: 'Satisfying', right: 'Frustrating' },
  { left: 'Popular', right: 'Unpopular' },
  { left: 'Classy', right: 'Trashy' },
  { left: 'Comfortable', right: 'Uncomfortable' },
  { left: 'Inspiring', right: 'Depressing' },
  { left: 'Addictive', right: 'Boring' },
  { left: 'Risky', right: 'Safe' },
  { left: 'Honest', right: 'Deceptive' },
  { left: 'Generous', right: 'Stingy' },
  { left: 'Stylish', right: 'Unstylish' },
  { left: 'Powerful', right: 'Powerless' },
  { left: 'Respected', right: 'Disrespected' },
  { left: 'Nostalgic', right: 'Futuristic' },
  { left: 'Wholesome', right: 'Dark' },
  { left: 'Sweet', right: 'Bitter' },
  { left: 'Spicy', right: 'Mild' },
  { left: 'Loud', right: 'Subtle' },
  // Gaming
  { left: 'Boring Game', right: 'Fun Game' },
  { left: 'Easy Mode', right: 'Impossible Mode' },
  { left: 'Single Player', right: 'Multiplayer' },
  { left: 'Indie Game', right: 'AAA Game' },
  { left: 'Pay to Win', right: 'Skill-Based' },
  { left: 'Casual Game', right: 'Hardcore Game' },
  { left: 'Overpowered', right: 'Useless Character' },
  { left: 'Early Game', right: 'End Game' },
  { left: 'No Story', right: 'Amazing Story' },
  { left: 'Short Game', right: 'Endless Game' },
  { left: 'Trash Loot', right: 'Legendary Drop' },
  { left: 'Camping', right: 'Rushing' },
  { left: 'Bot Lobby', right: 'Sweat Lobby' },
  { left: 'Game-Breaking Bug', right: 'Flawless Game' },
  { left: 'Solo Carry', right: 'Full Team Effort' },
];


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

// Fisher-Yates shuffle, returns `count` randomly selected player IDs
function selectImposters(players, count) {
  const pool = [...players];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).map(p => p.id);
}

// ─────────────────────────────────────────────
// WAVELENGTH HELPERS
// ─────────────────────────────────────────────
function getWvPublicTeams(room) {
  if (!room.wvTeams) return null;
  return room.wvTeams.map((t, i) => ({
    name: t.name,
    score: t.score,
    playerIds: t.playerIds,
    playerNames: t.playerIds.map(id => (room.players.find(p => p.id === id) || {}).name).filter(Boolean),
    isActive: i === (room.wvCurrentTeamIdx || 0)
  }));
}

function startWavelengthTurn(room) {
  // Pick an unused spectrum (reset pool when exhausted)
  if (!room.wvUsedSpectraIdx) room.wvUsedSpectraIdx = new Set();
  if (room.wvUsedSpectraIdx.size >= WAVELENGTH_SPECTRA.length) room.wvUsedSpectraIdx.clear();
  let idx;
  do { idx = Math.floor(Math.random() * WAVELENGTH_SPECTRA.length); }
  while (room.wvUsedSpectraIdx.has(idx));
  room.wvUsedSpectraIdx.add(idx);

  room.wvSpectrum = WAVELENGTH_SPECTRA[idx];
  room.wvTarget = 12 + Math.floor(Math.random() * 77); // 12–88, avoids extreme edges
  room.wvClue = null;
  room.wvDial = 50;
  room.wvOpposingGuess = null;
  room.wvDialLocked = false;
  room.gameState = 'wavelength-clue';

  const team = room.wvTeams[room.wvCurrentTeamIdx];
  const psychicIdx = (team.psychicIdx || 0) % team.playerIds.length;
  room.wvCurrentPsychicId = team.playerIds[psychicIdx];

  const psychicName = (room.players.find(p => p.id === room.wvCurrentPsychicId) || {}).name || '?';
  // In duo mode, find the non-psychic player (the guesser)
  const duoMode = !!room.settings.wvDuoMode;
  let guesserId = null;
  if (duoMode) {
    const allIds = room.players.map(p => p.id);
    guesserId = allIds.find(id => id !== room.wvCurrentPsychicId) || null;
  }
  const guesserName = guesserId ? ((room.players.find(p => p.id === guesserId) || {}).name || '?') : null;

  io.to(room.code).emit('wavelength-turn-start', {
    spectrum: room.wvSpectrum,
    teamIdx: room.wvCurrentTeamIdx,
    teamName: team.name,
    psychicId: room.wvCurrentPsychicId,
    psychicName,
    guesserId,
    guesserName,
    duoMode,
    turnsDone: room.wvTurnsDone,
    totalTurns: room.wvTotalTurns,
    teams: getWvPublicTeams(room),
    settings: { wvOpposingBonus: room.settings.wvOpposingBonus, wvOneWord: room.settings.wvOneWord, wvClueTimer: room.settings.wvClueTimer || 0, wvGuessTimer: room.settings.wvGuessTimer || 0 }
  });
  io.to(room.wvCurrentPsychicId).emit('wavelength-your-target', { target: room.wvTarget });
}

function resolveWavelengthTurn(room) {
  const diff = Math.abs(room.wvDial - room.wvTarget);
  let score = diff <= 8 ? 4 : diff <= 16 ? 3 : diff <= 24 ? 2 : 0;

  let opposingBonus = 0;
  let opposingCorrect = false;
  if (room.wvOpposingGuess) {
    const opposingIdx = 1 - room.wvCurrentTeamIdx;
    opposingCorrect = (room.wvDial < room.wvTarget && room.wvOpposingGuess === 'right') ||
                      (room.wvDial > room.wvTarget && room.wvOpposingGuess === 'left');
    if (opposingCorrect) { opposingBonus = 1; room.wvTeams[opposingIdx].score += 1; }
  }

  room.wvTeams[room.wvCurrentTeamIdx].score += score;
  // Advance psychic for next time this team plays
  const team = room.wvTeams[room.wvCurrentTeamIdx];
  team.psychicIdx = ((team.psychicIdx || 0) + 1) % team.playerIds.length;

  room.wvTurnsDone++;
  room.gameState = 'wavelength-reveal';

  io.to(room.code).emit('wavelength-reveal', {
    target: room.wvTarget,
    dial: room.wvDial,
    score,
    opposingBonus,
    opposingGuess: room.wvOpposingGuess,
    opposingCorrect,
    teams: getWvPublicTeams(room),
    spectrum: room.wvSpectrum,
    clue: room.wvClue,
    isLastTurn: room.wvTurnsDone >= room.wvTotalTurns
  });
  io.to(room.code).emit('room-update', sanitizeRoom(room));
}

function advanceBlindRankingTrack(room) {
  if (!room || !room.blindRankingData) return;
  const data = room.blindRankingData;
  data.currentTrackIndex++;
  data.placedPlayers = [];
  if (data.currentTrackIndex >= data.totalSongs) {
    room.gameState = 'blind-ranking-ended';
    io.to(room.code).emit('blind-ranking-game-ended');
  } else {
    io.to(room.code).emit('blind-ranking-next-track', { currentTrackIndex: data.currentTrackIndex });
  }
  io.to(room.code).emit('room-update', sanitizeRoom(room));
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
    spyfallVoteCount: room.spyfallData ? Object.keys(room.spyfallData.votes || {}).length : 0,
    wvPublic: (room.gameState && room.gameState.startsWith('wavelength-')) ? {
      teams: getWvPublicTeams(room),
      currentTeamIdx: room.wvCurrentTeamIdx || 0,
      turnsDone: room.wvTurnsDone || 0,
      totalTurns: room.wvTotalTurns || 8,
      spectrum: room.wvSpectrum,
      clue: room.wvClue,
      dial: room.wvDial != null ? room.wvDial : 50,
      psychicId: room.wvCurrentPsychicId,
      dialLocked: !!room.wvDialLocked
    } : null,
    blindRankingPublic: (room.gameState && room.gameState.startsWith('blind-ranking-')) ? {
      currentTrackIndex: room.blindRankingData ? room.blindRankingData.currentTrackIndex : 0,
      totalSongs: room.blindRankingData ? room.blindRankingData.totalSongs : 10,
      currentTrack: (room.blindRankingData && room.blindRankingData.tracks) ? room.blindRankingData.tracks[room.blindRankingData.currentTrackIndex] : null,
      placedPlayers: room.blindRankingData ? room.blindRankingData.placedPlayers : [],
      playerRankings: room.blindRankingData ? room.blindRankingData.playerRankings : {},
      playlistName: room.blindRankingPlaylistName || 'Playlist'
    } : null
  };
}

function tallyVotes(votes) {
  const tally = {};
  Object.values(votes).forEach(targets => {
    const arr = Array.isArray(targets) ? targets : [targets];
    arr.forEach(id => { tally[id] = (tally[id] || 0) + 1; });
  });
  return tally;
}

function buildResultPayload(room, extra = {}) {
  const allPlayers = room.players.map(p => ({
    name: p.name,
    isImposter: room.imposters.includes(p.id)
  }));
  const imposterNames = room.imposters
    .map(id => (room.players.find(p => p.id === id) || {}).name)
    .filter(Boolean);
  const imposterWords = room.imposters.map(id => {
    const p = room.players.find(pl => pl.id === id);
    return { name: p ? p.name : 'Unknown', word: room.imposterWords ? room.imposterWords[id] : null };
  });
  return {
    result: room.result,
    word: room.currentWord,
    category: room.currentCategory,
    imposters: imposterNames,
    imposterWords,
    blindMode: room.settings.blindImposter,
    votingHistory: room.votingHistory || [],
    allPlayers,
    gameMode: room.settings.gameMode || 'word',
    playerVideo: room.currentPlayerVideo || null,
    imposterVideo: room.currentImposterVideo || null,
    playerQuestion: room.currentPlayerQuestion || null,
    imposterQuestion: room.currentImposterQuestion || null,
    ...extra
  };
}

function revealDrawings(room) {
  if (room._drawTimer) { clearTimeout(room._drawTimer); room._drawTimer = null; }
  room.gameState = 'draw-reveal';
  const drawings = room.players.map(p => ({
    id: p.id,
    name: p.name,
    imageData: (room.drawSubmissions && room.drawSubmissions[p.id]) || null
  }));
  io.to(room.code).emit('draw-reveal', { drawings });
  io.to(room.code).emit('room-update', sanitizeRoom(room));
}

function resolveVotes(room) {
  const imposterCount = room.settings.imposterCount || 1;
  const activePlayers = room.players.filter(p => !room.eliminatedPlayers.includes(p.id));
  const tally = tallyVotes(room.votes);

  if (Object.keys(tally).length === 0) {
    room.gameState = 'discussion';
    room.votes = {};
    io.to(room.code).emit('vote-failed', { requiredVotes: imposterCount, maxVotes: 0 });
    io.to(room.code).emit('room-update', sanitizeRoom(room));
    return;
  }

  // Eliminate top N most-voted players (N = imposterCount)
  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([id]) => id);
  const toEliminateIds = sorted.slice(0, imposterCount);

  const eliminatedPlayers = toEliminateIds.map(id => {
    const p = room.players.find(pl => pl.id === id);
    return { id, name: p ? p.name : 'Unknown', isImposter: room.imposters.includes(id), voteCount: tally[id] || 0 };
  });

  // Build voting history — eliminated is always an array
  if (!room.votingHistory) room.votingHistory = [];
  const individualVotes = {};
  Object.entries(room.votes).forEach(([voterId, targets]) => {
    const voter = room.players.find(p => p.id === voterId);
    const arr = Array.isArray(targets) ? targets : [targets];
    if (voter) {
      const names = arr.map(id => (room.players.find(p => p.id === id) || {}).name).filter(Boolean);
      individualVotes[voter.name] = names.join(' & ') || '?';
    }
  });
  room.votingHistory.push({
    round: room.votingHistory.length + 1,
    eliminated: eliminatedPlayers.map(e => ({ name: e.name, isImposter: e.isImposter })),
    individualVotes
  });

  toEliminateIds.forEach(id => { room.eliminatedPlayers.push(id); });
  room.lastEliminated = toEliminateIds[0];

  const remainingImposters = room.imposters.filter(id => !room.eliminatedPlayers.includes(id));
  const allCaughtAreImposters = eliminatedPlayers.every(e => e.isImposter);
  const isWordMode = !room.settings.gameMode || room.settings.gameMode === 'word';

  const elimResult = {
    eliminated: eliminatedPlayers,
    remainingImposters: remainingImposters.length,
    totalVotes: activePlayers.length
  };

  if (!allCaughtAreImposters) {
    // At least one innocent eliminated — imposters win
    room.gameState = 'game-over';
    room.result = 'imposters-win';
    io.to(room.code).emit('elimination-result', { ...elimResult, gameState: 'game-over' });
    setTimeout(() => {
      io.to(room.code).emit('game-over', buildResultPayload(room));
      io.to(room.code).emit('room-update', sanitizeRoom(room));
    }, 2500);
  } else if (remainingImposters.length === 0) {
    // All imposters caught
    if (isWordMode && room.currentWord) {
      room.gameState = 'imposter-guess';
      io.to(room.code).emit('elimination-result', { ...elimResult, gameState: 'imposter-guess' });
      // Any caught imposter can attempt the word guess
      toEliminateIds.filter(id => room.imposters.includes(id)).forEach(id => {
        io.to(id).emit('make-guess', { category: room.currentCategory });
      });
    } else {
      room.gameState = 'game-over';
      room.result = 'players-win';
      io.to(room.code).emit('elimination-result', { ...elimResult, gameState: 'game-over' });
      setTimeout(() => {
        io.to(room.code).emit('game-over', buildResultPayload(room));
        io.to(room.code).emit('room-update', sanitizeRoom(room));
      }, 2500);
    }
  } else {
    // Some imposters still free — continue game
    room.gameState = 'elimination';
    io.to(room.code).emit('elimination-result', { ...elimResult, gameState: 'elimination' });
  }

  io.to(room.code).emit('room-update', sanitizeRoom(room));
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
    // Athletes
    "Cristiano Ronaldo","Lionel Messi","David Beckham","Harry Kane","Wayne Rooney",
    "Jude Bellingham","Mohamed Salah","Erling Haaland","Kylian Mbappe","Kevin De Bruyne",
    "Virgil van Dijk","Trent Alexander-Arnold","Bukayo Saka","Phil Foden","Marcus Rashford",
    "Declan Rice","Son Heung-min","Neymar","Ronaldinho","Pele","Diego Maradona",
    "Thierry Henry","Frank Lampard","Steven Gerrard","Rio Ferdinand","John Terry",
    "Paul Pogba","Antoine Griezmann","Robert Lewandowski","Luka Modric","Toni Kroos",
    "Muhammad Ali","Mike Tyson","Floyd Mayweather","Anthony Joshua","Tyson Fury",
    "Canelo Alvarez","Deontay Wilder","Manny Pacquiao","Sugar Ray Leonard","Oscar De La Hoya",
    "Lennox Lewis","Vitali Klitschko","Wladimir Klitschko","Jake Paul","Tommy Fury",
    "Amir Khan","Ricky Hatton","Carl Froch","Joe Calzaghe","Roy Jones Jr",
    "Evander Holyfield","George Foreman",
    "Conor McGregor","Jon Jones","Khabib Nurmagomedov","Georges St-Pierre","Anderson Silva",
    "Israel Adesanya","Alex Pereira","Tom Aspinall","Leon Edwards","Michael Bisping",
    "Dustin Poirier","Charles Oliveira","Sean Strickland","Khamzat Chimaev","Paddy Pimblett",
    "Nate Diaz","Nick Diaz","Francis Ngannou","Ciryl Gane","Alexander Volkanovski",
    "Max Holloway","Justin Gaethje",
    "Lewis Hamilton","Max Verstappen","Michael Schumacher","Fernando Alonso","Sebastian Vettel",
    "Daniel Ricciardo","Lando Norris","Charles Leclerc","George Russell","Ayrton Senna",
    // Actors
    "Tom Hanks","Leonardo DiCaprio","Tom Cruise","Robert Downey Jr","Dwayne Johnson",
    "Will Smith","Brad Pitt","Johnny Depp","Denzel Washington","Samuel L Jackson",
    "Morgan Freeman","Harrison Ford","Arnold Schwarzenegger","Sylvester Stallone",
    "Keanu Reeves","Matt Damon","Ben Affleck","Chris Hemsworth","Chris Pratt",
    "Ryan Reynolds","Hugh Jackman","Daniel Craig","Idris Elba","Jason Statham",
    "Vin Diesel","Mark Wahlberg","Adam Sandler","Jim Carrey","Will Ferrell",
    "Steve Carell","Bradley Cooper","Christian Bale","Joaquin Phoenix","Timothee Chalamet",
    "Austin Butler","Cillian Murphy","Andrew Garfield","Ryan Gosling","Paul Rudd","Chris Evans",
    "Scarlett Johansson","Jennifer Aniston","Angelina Jolie","Margot Robbie","Zendaya",
    "Emma Stone","Julia Roberts","Meryl Streep","Sandra Bullock","Anne Hathaway",
    "Nicole Kidman","Charlize Theron","Emma Watson","Florence Pugh","Anya Taylor-Joy",
    "Sydney Sweeney","Gal Gadot","Elizabeth Olsen","Brie Larson","Natalie Portman",
    "Reese Witherspoon","Jennifer Lawrence","Kate Winslet",
    // Music Artists (solo only)
    "Michael Jackson","Elvis Presley","Taylor Swift","Beyonce","Ed Sheeran","Adele",
    "Eminem","Drake","Justin Bieber","Rihanna","Elton John","David Bowie",
    "Whitney Houston","Freddie Mercury","Bruno Mars","Harry Styles","Post Malone",
    "The Weeknd","Ariana Grande","Billie Eilish","Olivia Rodrigo","Sabrina Carpenter",
    "Miley Cyrus","Justin Timberlake","Britney Spears","Christina Aguilera","Kanye West",
    "Jay-Z","Snoop Dogg","50 Cent","Travis Scott","Kendrick Lamar","Cardi B","Doja Cat",
    "Nicki Minaj","Lewis Capaldi","Sam Smith","Dua Lipa","Calvin Harris","Shawn Mendes",
    "Camila Cabello","Selena Gomez","Lady Gaga","Katy Perry","Pink","Usher","Prince",
    "Madonna","George Michael","Stevie Wonder","Bob Marley","Phil Collins",
    // YouTubers (solo only)
    "MrBeast","PewDiePie","Markiplier","Jacksepticeye","Logan Paul","KSI",
    "TommyInnit","Dream","Ninja","Tfue","xQc","Kai Cenat","IShowSpeed","Adin Ross",
    "Andrew Tate","Tristan Tate","Joe Rogan","Theo Von","DanTDM","James Charles",
    "Jeffree Star","Shane Dawson","David Dobrik","Zach King","Vsauce","MatPat","Mark Rober"
  ]},
  famousBands: { name: "Famous People w/ Bands", items: [
    // Athletes
    "Cristiano Ronaldo","Lionel Messi","David Beckham","Harry Kane","Wayne Rooney",
    "Jude Bellingham","Mohamed Salah","Erling Haaland","Kylian Mbappe","Kevin De Bruyne",
    "Virgil van Dijk","Trent Alexander-Arnold","Bukayo Saka","Phil Foden","Marcus Rashford",
    "Declan Rice","Son Heung-min","Neymar","Ronaldinho","Pele","Diego Maradona",
    "Thierry Henry","Frank Lampard","Steven Gerrard","Rio Ferdinand","John Terry",
    "Paul Pogba","Antoine Griezmann","Robert Lewandowski","Luka Modric","Toni Kroos",
    "Muhammad Ali","Mike Tyson","Floyd Mayweather","Anthony Joshua","Tyson Fury",
    "Canelo Alvarez","Deontay Wilder","Manny Pacquiao","Sugar Ray Leonard","Oscar De La Hoya",
    "Lennox Lewis","Vitali Klitschko","Wladimir Klitschko","Jake Paul","Tommy Fury",
    "Amir Khan","Ricky Hatton","Carl Froch","Joe Calzaghe","Roy Jones Jr",
    "Evander Holyfield","George Foreman",
    "Conor McGregor","Jon Jones","Khabib Nurmagomedov","Georges St-Pierre","Anderson Silva",
    "Israel Adesanya","Alex Pereira","Tom Aspinall","Leon Edwards","Michael Bisping",
    "Dustin Poirier","Charles Oliveira","Sean Strickland","Khamzat Chimaev","Paddy Pimblett",
    "Nate Diaz","Nick Diaz","Francis Ngannou","Ciryl Gane","Alexander Volkanovski",
    "Max Holloway","Justin Gaethje",
    "Lewis Hamilton","Max Verstappen","Michael Schumacher","Fernando Alonso","Sebastian Vettel",
    "Daniel Ricciardo","Lando Norris","Charles Leclerc","George Russell","Ayrton Senna",
    // Actors
    "Tom Hanks","Leonardo DiCaprio","Tom Cruise","Robert Downey Jr","Dwayne Johnson",
    "Will Smith","Brad Pitt","Johnny Depp","Denzel Washington","Samuel L Jackson",
    "Morgan Freeman","Harrison Ford","Arnold Schwarzenegger","Sylvester Stallone",
    "Keanu Reeves","Matt Damon","Ben Affleck","Chris Hemsworth","Chris Pratt",
    "Ryan Reynolds","Hugh Jackman","Daniel Craig","Idris Elba","Jason Statham",
    "Vin Diesel","Mark Wahlberg","Adam Sandler","Jim Carrey","Will Ferrell",
    "Steve Carell","Bradley Cooper","Christian Bale","Joaquin Phoenix","Timothee Chalamet",
    "Austin Butler","Cillian Murphy","Andrew Garfield","Ryan Gosling","Paul Rudd","Chris Evans",
    "Scarlett Johansson","Jennifer Aniston","Angelina Jolie","Margot Robbie","Zendaya",
    "Emma Stone","Julia Roberts","Meryl Streep","Sandra Bullock","Anne Hathaway",
    "Nicole Kidman","Charlize Theron","Emma Watson","Florence Pugh","Anya Taylor-Joy",
    "Sydney Sweeney","Gal Gadot","Elizabeth Olsen","Brie Larson","Natalie Portman",
    "Reese Witherspoon","Jennifer Lawrence","Kate Winslet",
    // Music Artists + Bands
    "Michael Jackson","Elvis Presley","Taylor Swift","Beyonce","Ed Sheeran","Adele",
    "Eminem","Drake","Justin Bieber","Rihanna","Elton John","David Bowie",
    "Whitney Houston","Freddie Mercury","Bruno Mars","Harry Styles","Post Malone",
    "The Weeknd","Ariana Grande","Billie Eilish","Olivia Rodrigo","Sabrina Carpenter",
    "Miley Cyrus","Justin Timberlake","Britney Spears","Christina Aguilera","Kanye West",
    "Jay-Z","Snoop Dogg","50 Cent","Travis Scott","Kendrick Lamar","Cardi B","Doja Cat",
    "Nicki Minaj","Lewis Capaldi","Sam Smith","Dua Lipa","Calvin Harris","Shawn Mendes",
    "Camila Cabello","Selena Gomez","Lady Gaga","Katy Perry","Pink","Usher","Prince",
    "Madonna","George Michael","Stevie Wonder","Bob Marley","Phil Collins",
    "The Beatles","Queen","Rolling Stones","Led Zeppelin","Pink Floyd","Oasis","Coldplay",
    "Nirvana","Guns N Roses","Fleetwood Mac","AC/DC","Metallica","Red Hot Chili Peppers",
    "Foo Fighters","Arctic Monkeys","Radiohead","Linkin Park","Green Day","Blink-182",
    "The Killers","Imagine Dragons","One Direction","Backstreet Boys","NSYNC","Maroon 5",
    "Kings of Leon","Fall Out Boy",
    // YouTubers + groups
    "MrBeast","PewDiePie","Markiplier","Jacksepticeye","Logan Paul","KSI",
    "Sidemen","TommyInnit","Dream","Dude Perfect","Rhett & Link","Ninja","Tfue","xQc",
    "Kai Cenat","IShowSpeed","Adin Ross","Andrew Tate","Tristan Tate","Joe Rogan",
    "Theo Von","DanTDM","James Charles","Jeffree Star","Shane Dawson","David Dobrik",
    "Zach King","Vsauce","Smosh","MatPat","Mark Rober"
  ]},
  videoGames: { name: "Video Games", items: [
    "Roblox", "Minecraft", "Fortnite", "Counter-Strike 2", "League of Legends",
    "Grand Theft Auto V", "Call of Duty", "Call of Duty: Black Ops",
    "Call of Duty: Black Ops II", "Call of Duty: Black Ops III",
    "Call of Duty: Black Ops Cold War", "Call of Duty: Black Ops 6",
    "Call of Duty: Black Ops 7", "Call of Duty: Modern Warfare",
    "Call of Duty: Modern Warfare II", "Call of Duty: Modern Warfare III",
    "PUBG", "Valorant", "The Sims 4", "Candy Crush Saga", "Clash of Clans",
    "Overwatch", "Overwatch 2", "Dota 2", "Genshin Impact", "Apex Legends",
    "Rocket League", "EA Sports FC", "EA Sports FC 25", "EA Sports FC 26",
    "NBA 2K", "NBA 2K25", "NBA 2K26", "World of Warcraft", "Final Fantasy XIV",
    "Destiny 2", "Warframe", "Terraria", "Stardew Valley",
    "Animal Crossing New Horizons", "Pokémon Go",
    "Mario Kart 8 Deluxe", "Mario Kart World", "Red Dead Redemption 2",
    "Elden Ring", "Helldivers 2", "Resident Evil Requiem", "Marvel Rivals",
    "Black Myth Wukong", "Palworld", "Lethal Company", "It Takes Two",
    "Hades", "Hades II", "Baldur's Gate 3", "Cyberpunk 2077",
    "The Legend of Zelda Breath of the Wild",
    "The Legend of Zelda Tears of the Kingdom", "Super Mario Odyssey",
    "Street Fighter 6", "Mortal Kombat 1", "Tekken 8",
    "Dragon Ball Sparking Zero", "Monster Hunter Wilds", "Monster Hunter Rise",
    "Diablo IV", "Path of Exile", "Path of Exile 2", "Throne and Liberty",
    "New World", "Once Human", "The First Descendant", "Split Fiction",
    "ARC Raiders", "Forza Horizon 5", "Forza Horizon 6",
    "Call of Duty Warzone", "Dead by Daylight", "Phasmophobia",
    "Deep Rock Galactic", "Satisfactory", "Factorio", "No Man's Sky",
    "Sea of Thieves", "Grounded", "Valheim", "7 Days to Die", "DayZ",
    "Rust", "Ark Survival Evolved", "Conan Exiles", "War Thunder",
    "Black Desert Online", "Elder Scrolls Online", "Guild Wars 2",
    "Old School RuneScape", "Tetris", "Pac-Man", "Marvel's Spider-Man 2",
    "MLB The Show 26", "WWE 2K26", "Battlefield 6", "Halo Infinite",
    "Assassin's Creed Valhalla", "Assassin's Creed Shadows", "The Witcher 3",
    "Doom Eternal", "Doom The Dark Ages", "Tomb Raider",
    "God of War Ragnarok", "Horizon Forbidden West", "The Last of Us Part II",
    "Uncharted 4", "Gran Turismo 7", "Need for Speed Unbound",
    "Clash Royale", "Super Smash Bros Ultimate", "Kirby and the Forgotten Land",
    "Sonic Frontiers", "Crash Bandicoot N Sane Trilogy",
    "Spyro Reignited Trilogy", "Starfield", "Fallout 4", "Fallout 76",
    "Skyrim", "Oblivion", "Monster Hunter Stories 3", "Nioh 3",
    "Crimson Desert", "Marathon", "Fable",
    "Kingdom Come Deliverance II", "Dragon Age The Veilguard",
    "Mass Effect Legendary Edition", "Subnautica"
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
      const cat = WHOAMI_CATS[room.settings.whoamiCategory || 'famous'] || WHOAMI_CATS.famous;
      const pool = [...cat.items];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      room.whoamiAssignments = {};
      room.whoamiAttempts = {};
      room.whoamiReady = new Set();
      room.players.forEach((p, i) => { room.whoamiAssignments[p.id] = pool[i % pool.length]; });
      room.gameState = 'whoami-playing';
      room.players.forEach(player => {
        const others = room.players
          .filter(p => p.id !== player.id)
          .map(p => ({ id: p.id, name: p.name, word: room.whoamiAssignments[p.id] }));
        io.to(player.id).emit('whoami-game-started', { others, categoryName: cat.name });
      });
      io.to(room.code).emit('room-update', sanitizeRoom(room));
      return;
    }

    // ── DRAW MODE ──
    if (room.settings.gameType === 'draw') {
      if (room.players.length < 3) return socket.emit('error', { message: 'Need at least 3 players for Draw.' });
      const maxImposters = Math.max(1, Math.floor(room.players.length / 2));
      if ((room.settings.imposterCount || 1) > maxImposters) {
        return socket.emit('error', { message: `Too many imposters. Max is ${maxImposters}.` });
      }
      const { word, category, categoryKey } = pickWordFromCategories(room.settings.selectedCategories);
      room.currentWord = word;
      room.currentCategory = category;
      room.currentCategoryKey = categoryKey;
      // Assign imposters — random via shared helper
      room.imposters = selectImposters(room.players, room.settings.imposterCount || 1);
      room.imposterWords = {};
      room.drawSubmissions = {};
      room.drawReadyPlayers = new Set();
      room.gameState = 'draw-role-reveal';
      room.votes = {};
      room.eliminatedPlayers = [];
      room.lastEliminated = null;
      room.result = null;
      room.votingHistory = [];
      room._drawTimer = null;

      const drawTime = room.settings.drawTime || 30;
      const blindDraw = !!room.settings.blindImposter;
      // Always pre-generate ONE shared fake word so all imposters draw the same thing
      const sharedImposterWord = pickDifferentWord(room.settings.selectedCategories, word, categoryKey);

      room.players.forEach(player => {
        const isImposter = room.imposters.includes(player.id);
        let playerWord, playerRole;
        if (isImposter) {
          playerWord = sharedImposterWord;
          playerRole = blindDraw ? 'unknown' : 'imposter';
          room.imposterWords[player.id] = playerWord;
        } else {
          playerWord = word;
          playerRole = 'player';
        }
        io.to(player.id).emit('draw-role', {
          role: playerRole,
          word: playerWord,
          category,
          drawTime,
          blindMode: blindDraw
        });
      });

      io.to(room.code).emit('room-update', sanitizeRoom(room));
      return;
    }

    // ── COLLAB DRAW MODE ──
    if (room.settings.gameType === 'collab') {
      if (room.players.length < 3) return socket.emit('error', { message: 'Need at least 3 players for Collab Draw.' });
      const maxImposters = Math.max(1, Math.floor(room.players.length / 2));
      if ((room.settings.imposterCount || 1) > maxImposters) {
        return socket.emit('error', { message: `Too many imposters. Max is ${maxImposters}.` });
      }
      const { word, category, categoryKey } = pickWordFromCategories(room.settings.selectedCategories);
      room.currentWord = word;
      room.currentCategory = category;
      room.currentCategoryKey = categoryKey;
      // Assign imposters — random via shared helper
      room.imposters = selectImposters(room.players, room.settings.imposterCount || 1);
      room.imposterWords = {};
      // Random turn order — proper Fisher-Yates
      const turnOrderPool = [...room.players];
      for (let i = turnOrderPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [turnOrderPool[i], turnOrderPool[j]] = [turnOrderPool[j], turnOrderPool[i]];
      }
      const turnOrder = turnOrderPool.map(p => ({ id: p.id, name: p.name }));
      room.collabTurnOrder = turnOrder;
      room.collabCurrentTurnIdx = 0;
      room.collabStrokes = [];
      room.gameState = 'collab-drawing';
      room.votes = {};
      room.eliminatedPlayers = [];
      room.lastEliminated = null;
      room.result = null;
      room.votingHistory = [];

      const currentTurnId = turnOrder[0] ? turnOrder[0].id : null;

      const blindCollab = !!room.settings.blindImposter;
      const sharedCollabBlindWord = blindCollab
        ? pickDifferentWord(room.settings.selectedCategories, word, categoryKey)
        : null;

      room.players.forEach(player => {
        const isImposter = room.imposters.includes(player.id);
        let playerWord, playerRole;
        if (isImposter) {
          playerWord = blindCollab ? sharedCollabBlindWord : null;
          playerRole = blindCollab ? 'unknown' : 'imposter';
          room.imposterWords[player.id] = playerWord;
        } else {
          playerWord = word;
          playerRole = 'player';
        }
        io.to(player.id).emit('collab-role', {
          role: playerRole,
          word: playerWord,
          category,
          turnOrder,
          currentTurnId,
          blindMode: blindCollab
        });
      });

      io.to(room.code).emit('room-update', sanitizeRoom(room));
      return;
    }

    // ── WAVELENGTH MODE ──
    if (room.settings.gameType === 'wavelength') {
      if (room.players.length < 2) return socket.emit('error', { message: 'Need at least 2 players for Wavelength.' });
      const t0 = (room.settings.wvTeams && room.settings.wvTeams[0]) || { name: 'Team 1', playerIds: [] };
      const t1 = (room.settings.wvTeams && room.settings.wvTeams[1]) || { name: 'Team 2', playerIds: [] };
      if (!t0.playerIds || t0.playerIds.length === 0 || !t1.playerIds || t1.playerIds.length === 0) {
        return socket.emit('error', { message: 'Each team needs at least one player. Assign players to teams first.' });
      }
      room.wvTeams = [
        { name: t0.name || 'Team 1', playerIds: [...t0.playerIds], score: 0, psychicIdx: 0 },
        { name: t1.name || 'Team 2', playerIds: [...t1.playerIds], score: 0, psychicIdx: 0 }
      ];
      room.wvCurrentTeamIdx = 0;
      room.wvTurnsDone = 0;
      room.wvTotalTurns = room.settings.wvTurns || 8;
      room.wvUsedSpectraIdx = new Set();
      room.wvSpectrum = null;
      room.wvTarget = null;
      room.wvClue = null;
      room.wvDial = 50;
      room.wvDialLocked = false;
      room.wvOpposingGuess = null;
      room.wvCurrentPsychicId = null;
      room.result = null;
      startWavelengthTurn(room);
      io.to(room.code).emit('room-update', sanitizeRoom(room));
      return;
    }

    // ── BLIND RANKING MODE ──
    if (room.settings.gameType === 'blind-ranking') {
      if (room.players.length < 1) return socket.emit('error', { message: 'Need at least 1 player for Blind Ranking.' });
      
      let pool = room.blindRankingPlaylist || [];
      let playlistName = room.blindRankingPlaylistName || "Preset Playlist";

      // Default to Top Hits if no custom/loaded playlist
      if (!pool || pool.length < 10) {
        const presetKey = room.settings.presetKey || 'tophits';
        const presetObj = PRESET_PLAYLISTS[presetKey] || PRESET_PLAYLISTS.tophits;
        pool = presetObj.tracks;
        playlistName = presetObj.name;
        room.blindRankingPlaylist = pool;
        room.blindRankingPlaylistName = playlistName;
      }

      // Pick 10 random tracks from pool (Fisher-Yates)
      const shuffled = [...pool];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const chosenTracks = shuffled.slice(0, Math.min(10, shuffled.length));

      room.blindRankingData = {
        tracks: chosenTracks,
        totalSongs: chosenTracks.length,
        currentTrackIndex: 0,
        playerRankings: {},
        placedPlayers: []
      };

      room.players.forEach(p => {
        room.blindRankingData.playerRankings[p.id] = {};
      });

      room.gameState = 'blind-ranking-playing';
      io.to(room.code).emit('blind-ranking-started');
      io.to(room.code).emit('room-update', sanitizeRoom(room));
      return;
    }

    // ── IMPOSTER MODE ──
    if (room.players.length < 3) return socket.emit('error', { message: 'Need at least 3 players to start.' });
    const maxImposters = Math.max(1, Math.floor(room.players.length / 2));
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
    } else if (room.settings.gameMode === 'questions') {
      // ── QUESTIONS MODE ──
      const qPair = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
      room.currentPlayerQuestion = qPair.playerQ;
      room.currentImposterQuestion = qPair.imposterQ;
      room.currentWord = null;
      room.currentCategory = '❓ Questions';
      room.currentCategoryKey = null;
      room.currentPlayerVideo = null;
      room.currentImposterVideo = null;
    } else {
      // ── WORD MODE ──
      const { word, category, categoryKey } = pickWordFromCategories(room.settings.selectedCategories);
      room.currentWord = word;
      room.currentCategory = category;
      room.currentCategoryKey = categoryKey;
      room.currentPlayerVideo = null;
      room.currentImposterVideo = null;
    }

    // Assign imposters — random via shared helper
    room.imposters = selectImposters(room.players, room.settings.imposterCount || 1);

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
    // Pre-generate one shared blind-imposter word so all imposters get the same fake word
    const sharedBlindWord = room.settings.blindImposter
      ? pickDifferentWord(room.settings.selectedCategories, room.currentWord, room.currentCategoryKey)
      : null;

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
      } else if (room.settings.gameMode === 'questions') {
        // Questions mode: each player gets a question, imposter gets a different one
        const question = isImposter ? room.currentImposterQuestion : room.currentPlayerQuestion;
        room.imposterWords[player.id] = isImposter ? room.currentImposterQuestion : null;
        roleData = {
          role: isImposter ? 'imposter' : 'player',
          gameMode: 'questions',
          word: question,
          category: '❓ Questions',
          blindMode: false
        };
      } else if (isImposter) {
        if (room.settings.blindImposter) {
          room.imposterWords[player.id] = sharedBlindWord;
          roleData = { role: 'unknown', word: sharedBlindWord, category: room.currentCategory, blindMode: true, gameMode: 'word' };
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

  // Player doesn't recognise their word/question/video
  socket.on('dont-know-word', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'role-reveal') return;

    const gameMode = room.settings.gameMode || 'word';
    const revealData = {
      gameMode,
      category: room.currentCategory,
      playerWord: gameMode === 'questions' ? room.currentPlayerQuestion : room.currentWord,
      imposterWord: gameMode === 'questions'
        ? room.currentImposterQuestion
        : (room.settings.blindImposter && room.imposterWords
            ? Object.values(room.imposterWords).find(w => w !== null) || null
            : null),
      playerVideo: room.currentPlayerVideo || null,
      imposterVideo: room.currentImposterVideo || null
    };

    io.to(room.code).emit('word-revealed-early', revealData);
    // Game state stays at role-reveal — host will click Play Again to restart
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

  // Cast vote — targetIds is an array of player IDs (one per imposter slot)
  socket.on('vote', ({ targetIds }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'voting') return;
    if (room.eliminatedPlayers.includes(socket.id)) return;

    const imposterCount = room.settings.imposterCount || 1;
    const validIds = (Array.isArray(targetIds) ? targetIds : [targetIds])
      .filter(id => id && id !== socket.id && !room.eliminatedPlayers.includes(id))
      .slice(0, imposterCount);
    if (validIds.length === 0) return;

    room.votes[socket.id] = validIds;

    const activePlayers = room.players.filter(p => !room.eliminatedPlayers.includes(p.id));
    // Only wait for currently connected players — prevents stuck votes on disconnect
    const connectedActive = activePlayers.filter(p => io.sockets.sockets.has(p.id));
    const submittedCount = Object.keys(room.votes).length;

    io.to(room.code).emit('vote-update', {
      voteCount: submittedCount,
      totalCount: connectedActive.length
    });

    if (submittedCount >= connectedActive.length) {
      try { resolveVotes(room); } catch(e) {
        console.error('resolveVotes error:', e);
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

  // Player marks themselves ready on the role screen
  socket.on('whoami-player-ready', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'whoami-playing') return;
    if (!room.whoamiReady) room.whoamiReady = new Set();
    room.whoamiReady.add(socket.id);
    const readyCount = room.whoamiReady.size;
    const totalCount = room.players.length;
    io.to(room.code).emit('whoami-ready-update', { readyCount, totalCount });
    if (readyCount >= totalCount) {
      io.to(room.code).emit('whoami-all-ready');
    }
  });

  // Player submits a Who Am I guess (up to 3 attempts)
  socket.on('whoami-guess', ({ guess }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'whoami-playing') return;
    const playerId = socket.id;
    const assignment = (room.whoamiAssignments || {})[playerId];
    if (!assignment) return;

    if (!room.whoamiAttempts) room.whoamiAttempts = {};
    const attempts = (room.whoamiAttempts[playerId] || 0) + 1;
    room.whoamiAttempts[playerId] = attempts;

    const correct = (guess || '').trim().toLowerCase() === assignment.toLowerCase();

    if (correct || attempts >= 3) {
      // Give them a new person
      const used = new Set(Object.values(room.whoamiAssignments));
      const cat = WHOAMI_CATS[room.settings.whoamiCategory || 'famous'] || WHOAMI_CATS.famous;
      const pool = cat.items.filter(item => !used.has(item));
      const newPerson = (pool.length > 0 ? pool : cat.items)[Math.floor(Math.random() * (pool.length > 0 ? pool.length : cat.items.length))];
      room.whoamiAssignments[playerId] = newPerson;
      room.whoamiAttempts[playerId] = 0;

      socket.emit('whoami-guess-result', { correct, failed: !correct, wasWord: assignment, newWord: newPerson, attemptsLeft: 3 });

      // Update every player's "others" list with the new assignment
      room.players.forEach(player => {
        const others = room.players
          .filter(p => p.id !== player.id)
          .map(p => ({ id: p.id, name: p.name, word: room.whoamiAssignments[p.id] }));
        io.to(player.id).emit('whoami-assignments-updated', { others });
      });
    } else {
      socket.emit('whoami-guess-result', { correct: false, failed: false, wasWord: null, newWord: null, attemptsLeft: 3 - attempts });
    }
  });

  // Host changes a player's assignment
  socket.on('whoami-change-assignment', ({ playerId }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id || room.gameState !== 'whoami-playing') return;
    const used = new Set(Object.values(room.whoamiAssignments));
    const cat = WHOAMI_CATS[room.settings.whoamiCategory || 'famous'] || WHOAMI_CATS.famous;
    const pool = cat.items.filter(item => !used.has(item));
    const newPerson = (pool.length > 0 ? pool : cat.items)[Math.floor(Math.random() * (pool.length > 0 ? pool.length : cat.items.length))];
    room.whoamiAssignments[playerId] = newPerson;
    if (room.whoamiAttempts) room.whoamiAttempts[playerId] = 0;

    // Notify the changed player
    io.to(playerId).emit('whoami-my-assignment-changed');

    // Update everyone's "others" list
    room.players.forEach(player => {
      const others = room.players
        .filter(p => p.id !== player.id)
        .map(p => ({ id: p.id, name: p.name, word: room.whoamiAssignments[p.id] }));
      io.to(player.id).emit('whoami-assignments-updated', { others });
    });
  });

  // End Who Am I game (host only)
  socket.on('whoami-end-game', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    const all = room.players.map(p => ({
      name: p.name,
      word: (room.whoamiAssignments || {})[p.id] || '?'
    }));
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

  // ─────────────────────────────────────────────
  // WAVELENGTH — SOCKET HANDLERS
  // ─────────────────────────────────────────────

  // Psychic submits their clue
  socket.on('wavelength-clue', ({ clue }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'wavelength-clue') return;
    if (socket.id !== room.wvCurrentPsychicId) return;
    const clean = (clue || '').trim().slice(0, 80);
    if (!clean) return socket.emit('error', { message: 'Enter a clue first!' });
    if (room.settings.wvOneWord && clean.includes(' ')) return socket.emit('error', { message: 'One word only!' });
    room.wvClue = clean;
    room.gameState = 'wavelength-guessing';
    io.to(room.code).emit('wavelength-clue-given', { clue: clean });
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Move the dial (active team member, or in duo mode: anyone except psychic)
  socket.on('wavelength-dial', ({ position }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'wavelength-guessing') return;
    if (room.wvDialLocked) return;
    if (socket.id === room.wvCurrentPsychicId) return;
    if (!room.settings.wvDuoMode) {
      const team = room.wvTeams[room.wvCurrentTeamIdx];
      if (!team.playerIds.includes(socket.id)) return;
    }
    const pos = Math.max(0, Math.min(100, Number(position) || 50));
    room.wvDial = pos;
    socket.to(room.code).emit('wavelength-dial-update', { position: pos, moverId: socket.id });
  });

  // Lock in the dial (active team, or in duo mode: anyone except psychic)
  socket.on('wavelength-lock', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'wavelength-guessing') return;
    if (room.wvDialLocked) return;
    if (socket.id === room.wvCurrentPsychicId) return;
    if (!room.settings.wvDuoMode) {
      const team = room.wvTeams[room.wvCurrentTeamIdx];
      if (!team.playerIds.includes(socket.id)) return;
    }
    room.wvDialLocked = true;
    // No opposing bonus in duo mode
    if (!room.settings.wvDuoMode && room.settings.wvOpposingBonus !== false) {
      room.gameState = 'wavelength-opposing';
      io.to(room.code).emit('wavelength-locked', { dial: room.wvDial });
      io.to(room.code).emit('room-update', sanitizeRoom(room));
    } else {
      resolveWavelengthTurn(room);
    }
  });

  // Opposing team guesses left or right for the bonus point
  socket.on('wavelength-opposing', ({ direction }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'wavelength-opposing') return;
    const opposingIdx = 1 - room.wvCurrentTeamIdx;
    const opposingTeam = room.wvTeams[opposingIdx];
    if (!opposingTeam.playerIds.includes(socket.id)) return;
    if (room.wvOpposingGuess) return; // already submitted
    if (!['left', 'right'].includes(direction)) return;
    room.wvOpposingGuess = direction;
    resolveWavelengthTurn(room);
  });

  // Host advances to next turn (or ends game)
  socket.on('wavelength-next', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    if (room.gameState !== 'wavelength-reveal') return;
    if (room.wvTurnsDone >= room.wvTotalTurns) {
      // Game over
      room.gameState = 'wavelength-end';
      room.result = 'done';
      const t0 = room.wvTeams[0], t1 = room.wvTeams[1];
      const winner = t0.score > t1.score ? t0.name : t1.score > t0.score ? t1.name : null;
      io.to(room.code).emit('wavelength-end', { teams: getWvPublicTeams(room), winner });
      io.to(room.code).emit('room-update', sanitizeRoom(room));
    } else {
      // Switch teams and start next turn
      room.wvCurrentTeamIdx = 1 - room.wvCurrentTeamIdx;
      startWavelengthTurn(room);
      io.to(room.code).emit('room-update', sanitizeRoom(room));
    }
  });

  // Psychic can skip opposing phase (host shortcut)
  socket.on('wavelength-skip-opposing', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    if (room.gameState !== 'wavelength-opposing') return;
    resolveWavelengthTurn(room);
  });

  // Play again
  socket.on('play-again', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    // Clear any pending draw timer
    if (room._drawTimer) { clearTimeout(room._drawTimer); room._drawTimer = null; }
    room.gameState = 'lobby';
    room.currentWord = null;
    room.currentCategory = null;
    room.currentCategoryKey = null;
    room.currentPlayerQuestion = null;
    room.currentImposterQuestion = null;
    room.whoamiAssignments = {};
    room.whoamiGuesses = {};
    room.spyfallData = null;
    room.imposters = [];
    room.votes = {};
    room.readyPlayers = new Set();
    room.eliminatedPlayers = [];
    room.lastEliminated = null;
    room.result = null;
    room.drawSubmissions = {};
    room.drawReadyPlayers = new Set();
    room.collabStrokes = [];
    room.collabTurnOrder = [];
    room.collabCurrentTurnIdx = 0;
    room.wvTeams = null;
    room.wvCurrentTeamIdx = 0;
    room.wvTurnsDone = 0;
    room.wvSpectrum = null;
    room.wvTarget = null;
    room.wvClue = null;
    room.wvDial = 50;
    room.wvDialLocked = false;
    room.wvOpposingGuess = null;
    room.wvCurrentPsychicId = null;
    room.wvUsedSpectraIdx = new Set();
    // Reset game mode back to word so video mode doesn't persist into the next game
    if (room.settings.gameMode && room.settings.gameMode !== 'word') {
      room.settings.gameMode = 'word';
    }
    room.currentPlayerVideo = null;
    room.currentImposterVideo = null;
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
    // If socket ID hasn't changed (tab came back while still connected), just re-sync
    if (oldId === socket.id) {
      socket.join(room.code);
      socket.roomCode = room.code;
      socket.playerName = name;
      socket.emit('rejoin-ack', { code: room.code, playerId: socket.id });
      socket.emit('room-update', sanitizeRoom(room));
      return;
    }
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
        const newKey = k === oldId ? socket.id : k;
        const newVal = Array.isArray(v) ? v.map(id => id === oldId ? socket.id : id) : (v === oldId ? socket.id : v);
        newVotes[newKey] = newVal;
      });
      room.votes = newVotes;
    }
    if (room.imposterWords && room.imposterWords[oldId] !== undefined) {
      room.imposterWords[socket.id] = room.imposterWords[oldId];
      delete room.imposterWords[oldId];
    }
    if (room.whoamiAssignments && room.whoamiAssignments[oldId] !== undefined) {
      room.whoamiAssignments[socket.id] = room.whoamiAssignments[oldId];
      delete room.whoamiAssignments[oldId];
    }
    if (room.whoamiAttempts && room.whoamiAttempts[oldId] !== undefined) {
      room.whoamiAttempts[socket.id] = room.whoamiAttempts[oldId];
      delete room.whoamiAttempts[oldId];
    }
    if (room.whoamiReady && room.whoamiReady.has(oldId)) {
      room.whoamiReady.delete(oldId);
      room.whoamiReady.add(socket.id);
    }
    if (room.drawReadyPlayers && room.drawReadyPlayers.has(oldId)) {
      room.drawReadyPlayers.delete(oldId);
      room.drawReadyPlayers.add(socket.id);
    }
    if (room.drawSubmissions && room.drawSubmissions[oldId] !== undefined) {
      room.drawSubmissions[socket.id] = room.drawSubmissions[oldId];
      delete room.drawSubmissions[oldId];
    }
    if (room.collabTurnOrder) {
      room.collabTurnOrder = room.collabTurnOrder.map(p => p.id === oldId ? { ...p, id: socket.id } : p);
    }
    if (room.collabStrokes) {
      room.collabStrokes = room.collabStrokes.map(s => s.playerId === oldId ? { ...s, playerId: socket.id } : s);
    }

    socket.emit('rejoin-ack', { code: room.code, playerId: socket.id });
    socket.emit('room-update', sanitizeRoom(room));
    io.to(room.code).emit('room-update', sanitizeRoom(room));

    // If rejoining during collab, send full canvas state
    if (room.gameState === 'collab-drawing' && room.collabStrokes && room.collabStrokes.length > 0) {
      socket.emit('collab-full-state', { strokes: room.collabStrokes });
    }
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
      settings: { category: 'athletes' },
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

  // ─────────────────────────────────────────────
  // DRAW — SOCKET HANDLERS
  // ─────────────────────────────────────────────

  // Player marks ready on the draw role screen
  socket.on('draw-player-ready', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'draw-role-reveal') return;
    if (!room.drawReadyPlayers) room.drawReadyPlayers = new Set();
    room.drawReadyPlayers.add(socket.id);
    const readyCount = room.drawReadyPlayers.size;
    const totalCount = room.players.length;
    io.to(room.code).emit('draw-ready-update', { readyCount, totalCount });
    if (readyCount >= totalCount) {
      room.gameState = 'draw-drawing';
      const drawTime = room.settings.drawTime || 30;
      io.to(room.code).emit('draw-all-ready', { drawTime });
      io.to(room.code).emit('room-update', sanitizeRoom(room));
      // Server-side timer — fires when time is up
      room._drawTimer = setTimeout(() => {
        if (room.gameState === 'draw-drawing') {
          io.to(room.code).emit('draw-time-up');
          revealDrawings(room);
        }
      }, (drawTime + 2) * 1000); // +2s grace for last-second submits
    }
  });

  // Player submits their drawing
  socket.on('draw-submit', ({ imageData }) => {
    const room = rooms[socket.roomCode];
    if (!room || !['draw-drawing', 'draw-reveal'].includes(room.gameState)) return;
    if (!room.drawSubmissions) room.drawSubmissions = {};
    room.drawSubmissions[socket.id] = imageData || null;
    // Check if all players submitted
    const allSubmitted = room.players.every(p => room.drawSubmissions[p.id] !== undefined);
    if (allSubmitted && room.gameState === 'draw-drawing') {
      revealDrawings(room);
    }
  });

  // Host starts the vote from draw-reveal screen
  socket.on('draw-start-vote', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    if (room.gameState !== 'draw-reveal') return;
    room.gameState = 'draw-voting';
    room.votes = {};
    io.to(room.code).emit('draw-voting-started');
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Player votes on a drawing (stays on the reveal screen)
  socket.on('draw-vote', ({ targetId }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'draw-voting') return;
    if (room.eliminatedPlayers && room.eliminatedPlayers.includes(socket.id)) return;
    if (socket.id === targetId) return; // can't vote for yourself

    room.votes[socket.id] = targetId;

    const activePlayers = room.players.filter(p => !room.eliminatedPlayers.includes(p.id));
    const tally = {};
    Object.values(room.votes).forEach(id => { tally[id] = (tally[id] || 0) + 1; });

    io.to(room.code).emit('draw-vote-update', {
      voteCount: Object.keys(room.votes).length,
      totalCount: activePlayers.length,
      tally,
      votes: room.votes
    });

    // Resolve when everyone has voted (excluding self-voters who can't vote)
    const canVote = activePlayers.filter(p => !room.eliminatedPlayers.includes(p.id));
    if (Object.keys(room.votes).length >= canVote.length) {
      // Plurality resolve — no imposter-count threshold for draw game
      const maxVotes = Object.values(tally).length ? Math.max(...Object.values(tally)) : 0;
      if (maxVotes === 0) return;
      const topIds = Object.keys(tally).filter(id => tally[id] === maxVotes);
      const eliminatedId = topIds[Math.floor(Math.random() * topIds.length)];
      const eliminatedPlayer = room.players.find(p => p.id === eliminatedId);
      if (!eliminatedPlayer) return;

      const isImposter = room.imposters.includes(eliminatedId);
      if (!room.votingHistory) room.votingHistory = [];
      const individualVotes = {};
      Object.entries(room.votes).forEach(([vid, tid]) => {
        const voter = room.players.find(p => p.id === vid);
        const target = room.players.find(p => p.id === tid);
        if (voter && target) individualVotes[voter.name] = target.name;
      });
      room.votingHistory.push({ round: room.votingHistory.length + 1, eliminated: { name: eliminatedPlayer.name, isImposter }, individualVotes });
      room.eliminatedPlayers.push(eliminatedId);
      room.lastEliminated = eliminatedId;

      const remainingImposters = room.imposters.filter(id => !room.eliminatedPlayers.includes(id));
      const elimResult = {
        eliminated: { id: eliminatedId, name: eliminatedPlayer.name, isImposter, voteCount: tally[eliminatedId] || 0, totalVotes: activePlayers.length },
        remainingImposters: remainingImposters.length
      };

      if (isImposter) {
        if (remainingImposters.length === 0) {
          if (room.currentWord) {
            room.gameState = 'imposter-guess';
            io.to(room.code).emit('elimination-result', { ...elimResult, gameState: 'imposter-guess' });
            io.to(eliminatedId).emit('make-guess', { category: room.currentCategory });
          } else {
            room.gameState = 'game-over';
            room.result = 'players-win';
            io.to(room.code).emit('elimination-result', { ...elimResult, gameState: 'game-over' });
            setTimeout(() => { io.to(room.code).emit('game-over', buildResultPayload(room)); io.to(room.code).emit('room-update', sanitizeRoom(room)); }, 2500);
          }
        } else {
          room.gameState = 'draw-reveal';
          io.to(room.code).emit('elimination-result', { ...elimResult, gameState: 'draw-reveal' });
        }
      } else {
        room.gameState = 'game-over';
        room.result = 'imposters-win';
        io.to(room.code).emit('elimination-result', { ...elimResult, gameState: 'game-over' });
        setTimeout(() => { io.to(room.code).emit('game-over', buildResultPayload(room)); io.to(room.code).emit('room-update', sanitizeRoom(room)); }, 2500);
      }
    }
  });

  // ─────────────────────────────────────────────
  // COLLAB DRAW — SOCKET HANDLERS
  // ─────────────────────────────────────────────

  // Player sends a stroke
  socket.on('collab-stroke', (strokeData) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'collab-drawing') return;
    const currentTurnId = room.collabTurnOrder && room.collabTurnOrder[room.collabCurrentTurnIdx || 0]
      ? room.collabTurnOrder[room.collabCurrentTurnIdx || 0].id
      : null;
    if (socket.id !== currentTurnId) return; // only current drawer can send strokes
    if (!room.collabStrokes) room.collabStrokes = [];
    // Tag stroke with player ID so we can filter later
    const taggedStroke = { ...strokeData, playerId: socket.id };
    room.collabStrokes.push(taggedStroke);
    // Broadcast to everyone else
    socket.to(room.code).emit('collab-stroke', taggedStroke);
  });

  // Bucket fill from current drawer — stored in collabStrokes so undo/replay works
  socket.on('collab-fill', ({ x, y, color, w, segmentId }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'collab-drawing') return;
    const currentTurnId = room.collabTurnOrder && room.collabTurnOrder[room.collabCurrentTurnIdx || 0]
      ? room.collabTurnOrder[room.collabCurrentTurnIdx || 0].id : null;
    if (socket.id !== currentTurnId) return;
    if (!room.collabStrokes) room.collabStrokes = [];
    const fillStroke = { type: 'fill', x, y, color, w, playerId: socket.id, segmentId };
    room.collabStrokes.push(fillStroke);
    // Broadcast to all other players so their canvas updates live
    socket.to(room.code).emit('collab-fill', { x, y, color, w });
  });

  // Current drawer OR host advances to next player's turn
  socket.on('collab-next-turn', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'collab-drawing') return;
    if (!room.collabTurnOrder || room.collabTurnOrder.length === 0) return;
    const currentTurnId = room.collabTurnOrder[room.collabCurrentTurnIdx || 0]
      ? room.collabTurnOrder[room.collabCurrentTurnIdx || 0].id : null;
    // Allow if host OR the current drawer
    if (socket.id !== room.host && socket.id !== currentTurnId) return;
    room.collabCurrentTurnIdx = ((room.collabCurrentTurnIdx || 0) + 1) % room.collabTurnOrder.length;
    const nextTurnId = room.collabTurnOrder[room.collabCurrentTurnIdx].id;
    io.to(room.code).emit('collab-turn-change', { currentTurnId: nextTurnId });
  });

  // Host starts voting in collab mode
  socket.on('collab-start-vote', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    if (room.gameState !== 'collab-drawing') return;
    room.gameState = 'voting';
    room.votes = {};
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Current turn player undoes their last drawn segment
  socket.on('collab-undo', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'collab-drawing') return;
    const currentTurnId = room.collabTurnOrder && room.collabTurnOrder[room.collabCurrentTurnIdx || 0]
      ? room.collabTurnOrder[room.collabCurrentTurnIdx || 0].id : null;
    if (socket.id !== currentTurnId) return;
    if (!room.collabStrokes || room.collabStrokes.length === 0) return;

    // Find the last segmentId belonging to this player
    let lastSeg = null;
    for (let i = room.collabStrokes.length - 1; i >= 0; i--) {
      if (room.collabStrokes[i].playerId === socket.id) {
        lastSeg = room.collabStrokes[i].segmentId;
        break;
      }
    }
    if (!lastSeg) return; // nothing to undo

    // Remove all strokes with that segmentId
    room.collabStrokes = room.collabStrokes.filter(
      s => !(s.playerId === socket.id && s.segmentId === lastSeg)
    );
    io.to(room.code).emit('collab-full-state', { strokes: room.collabStrokes });
  });

  // ─────────────────────────────────────────────
  // BLIND RANKING — SOCKET HANDLERS
  // ─────────────────────────────────────────────
  socket.on('blind-ranking-fetch-playlist', async ({ source, presetKey, playlistUrl, customText }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    
    let tracks = [];
    let name = "Custom Playlist";

    if (source === 'preset') {
      const pKey = presetKey || 'tophits';
      const presetObj = PRESET_PLAYLISTS[pKey] || PRESET_PLAYLISTS.tophits;
      tracks = presetObj.tracks;
      name = presetObj.name;
    } else if (source === 'custom') {
      tracks = parseCustomSongList(customText);
      name = "Custom Tracks List";
    } else if (source === 'url') {
      tracks = await parsePlaylistUrl(playlistUrl);
      name = "Loaded Playlist";
    }

    if (!tracks || tracks.length === 0) {
      return socket.emit('error', { message: 'Could not load tracks from that source. Check URL or text format.' });
    }

    room.blindRankingPlaylist = tracks;
    room.blindRankingPlaylistName = name;
    room.settings.presetKey = presetKey || 'tophits';
    room.settings.playlistSource = source;

    socket.emit('blind-ranking-playlist-loaded', {
      count: tracks.length,
      name,
      sample: tracks.slice(0, 5)
    });
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  socket.on('blind-ranking-place-song', ({ slot }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.gameState !== 'blind-ranking-playing') return;
    const data = room.blindRankingData;
    if (!data) return;

    const slotNum = parseInt(slot, 10);
    if (isNaN(slotNum) || slotNum < 1 || slotNum > 10) return;

    if (!data.playerRankings[socket.id]) data.playerRankings[socket.id] = {};
    if (data.playerRankings[socket.id][slotNum]) return socket.emit('error', { message: 'Slot already filled!' });

    const currentTrack = data.tracks[data.currentTrackIndex];
    data.playerRankings[socket.id][slotNum] = currentTrack;

    if (!data.placedPlayers.includes(socket.id)) {
      data.placedPlayers.push(socket.id);
    }

    io.to(room.code).emit('blind-ranking-placed-update', {
      placedPlayers: data.placedPlayers,
      totalPlayers: room.players.length
    });
    io.to(room.code).emit('room-update', sanitizeRoom(room));

    // If all players locked in their slot, advance to next song after short pause
    if (data.placedPlayers.length >= room.players.length) {
      setTimeout(() => {
        advanceBlindRankingTrack(room);
      }, 1000);
    }
  });

  socket.on('blind-ranking-next-song', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id || room.gameState !== 'blind-ranking-playing') return;
    advanceBlindRankingTrack(room);
  });

  socket.on('blind-ranking-restart', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    room.gameState = 'lobby';
    room.blindRankingData = null;
    io.to(room.code).emit('room-update', sanitizeRoom(room));
  });

  // Disconnect — grace period so brief blips don't destroy rooms
  socket.on('disconnect', () => {
    const name = socket.playerName || 'A player';

    // Unified lobby room (imposter / whoami / spyfall)
    const room = rooms[socket.roomCode];
    if (room) {
      // If a player disconnects mid-vote, check if the remaining connected players
      // have all voted and resolve immediately so the game doesn't get stuck
      if (room.gameState === 'voting') {
        const activePlayers = room.players.filter(p => !room.eliminatedPlayers.includes(p.id));
        const connectedActive = activePlayers.filter(p => p.id !== socket.id && io.sockets.sockets.has(p.id));
        if (connectedActive.length > 0 && Object.keys(room.votes).length >= connectedActive.length) {
          try { resolveVotes(room); } catch(e) { console.error('resolveVotes (dc) error:', e); }
        }
      }
      if (!room._dcTimers) room._dcTimers = {};
      // Give generous grace periods — mobile browsers suspend sockets when backgrounded
      const delay = room.gameState !== 'lobby' ? 300000 : 120000; // 5 min in-game, 2 min lobby
      room._dcTimers[socket.id] = setTimeout(() => { _removePlayer(room, socket.id, name); }, delay);
    }
  });
});

function _removePlayer(room, socketId, name) {
  if (!room) return;
  room.players = room.players.filter(p => p.id !== socketId);
  if (room.readyPlayers) room.readyPlayers.delete(socketId);
  // Remove from wavelength team lists
  if (room.settings && room.settings.wvTeams) {
    room.settings.wvTeams.forEach(t => { t.playerIds = (t.playerIds || []).filter(id => id !== socketId); });
  }
  if (room.wvTeams) {
    room.wvTeams.forEach(t => { t.playerIds = t.playerIds.filter(id => id !== socketId); });
  }
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
