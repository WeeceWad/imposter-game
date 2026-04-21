const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  pingTimeout: 60000,
  pingInterval: 25000
});

app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────
// WORD CATEGORIES
// ─────────────────────────────────────────────
const CATEGORIES = {
  movies: {
    name: '🎬 Movies',
    items: [
      'The Avengers', 'Titanic', 'The Dark Knight', 'Star Wars', 'Jurassic Park',
      'Harry Potter', 'The Lion King', 'Forrest Gump', 'Inception', 'The Godfather',
      'Pulp Fiction', 'The Matrix', 'Interstellar', 'The Lord of the Rings',
      'Gladiator', 'Toy Story', 'Finding Nemo', 'WALL-E', 'Up', 'Frozen',
      'Moana', 'Coco', 'Encanto', 'Black Panther', 'Spider-Man',
      'Iron Man', 'Captain America', 'Thor', 'Guardians of the Galaxy',
      'Doctor Strange', 'The Silence of the Lambs', 'Goodfellas',
      "Schindler's List", 'Fight Club', 'The Shawshank Redemption',
      'Mad Max: Fury Road', 'Get Out', 'A Quiet Place', 'Parasite', 'Joker',
      'Dune', 'Top Gun: Maverick', 'Avatar', 'Bohemian Rhapsody', 'La La Land',
      'Whiplash', 'The Social Network', 'The Wolf of Wall Street',
      'Django Unchained', 'Inglourious Basterds', 'No Country for Old Men',
      'Birdman', 'The Grand Budapest Hotel', 'Moonlight', 'The Shape of Water',
      'Green Book', 'Nomadland', 'Everything Everywhere All at Once',
      'Oppenheimer', 'Barbie', 'Poor Things', 'The Menu', 'Glass Onion',
      "Knives Out", "Don't Look Up", 'Bird Box', 'Us', 'Hereditary',
      'Midsommar', 'It', 'The Conjuring', 'Halloween', 'Scream',
      'Ghostbusters', 'Men in Black', 'Independence Day', 'Armageddon',
      'Gravity', 'The Martian', 'Ad Astra', 'Alien', 'Aliens',
      'Terminator', 'Back to the Future', 'E.T. the Extra-Terrestrial',
      'Jaws', 'Raiders of the Lost Ark', 'Die Hard', 'Home Alone',
      'The Truman Show', 'American Beauty', 'A Beautiful Mind',
      'The Departed', 'Catch Me If You Can', 'Saving Private Ryan',
      'Braveheart', 'The Sixth Sense', 'Memento', 'Se7en', 'Zodiac',
      'Gone Girl', 'Prisoners', 'Hereditary', 'Annihilation',
      'Black Swan', 'Requiem for a Dream', 'Pan\'s Labyrinth',
      'Life of Pi', 'Cast Away', 'The Revenant', 'Dunkirk', 'Tenet'
    ]
  },

  tvShows: {
    name: '📺 TV Shows',
    items: [
      'Breaking Bad', 'Game of Thrones', 'Friends', 'The Office', 'Stranger Things',
      'The Crown', 'Black Mirror', 'Peaky Blinders', 'Squid Game', 'The Witcher',
      'Money Heist', 'Narcos', 'Ozark', 'The Boys', 'Succession',
      'Ted Lasso', 'Euphoria', 'Yellowstone', 'The Mandalorian', 'Cobra Kai',
      'Bridgerton', 'Emily in Paris', 'Sex Education', 'Dark', 'Mindhunter',
      "The Queen's Gambit", "Schitt's Creek", 'Brooklyn Nine-Nine',
      "Grey's Anatomy", 'This Is Us', "The Handmaid's Tale", 'Better Call Saul',
      'Fargo', 'True Detective', 'Westworld', 'Dexter', 'House of Cards',
      'Seinfeld', 'How I Met Your Mother', 'Big Bang Theory', 'Modern Family',
      'Parks and Recreation', 'Community', '30 Rock', 'Curb Your Enthusiasm',
      "It's Always Sunny in Philadelphia", 'Rick and Morty', 'BoJack Horseman',
      'Archer', 'The Simpsons', 'South Park', 'Family Guy', 'Futurama',
      'King of the Hill', 'Avatar: The Last Airbender', 'The Legend of Korra',
      'Attack on Titan', 'Death Note', 'Naruto', 'One Piece', 'Bleach',
      'Demon Slayer', 'Jujutsu Kaisen', 'My Hero Academia', 'Hunter x Hunter',
      'One Punch Man', 'Fullmetal Alchemist: Brotherhood', 'Sword Art Online',
      'Dragon Ball Z', 'Pokémon', 'Gravity Falls', 'Steven Universe',
      'Adventure Time', 'Regular Show', 'We Bare Bears', 'American Dad',
      "Bob's Burgers", 'Arrested Development', 'Veep', 'Silicon Valley',
      'Entourage', 'The Sopranos', 'The Wire', 'Boardwalk Empire',
      'Mad Men', 'Lost', '24', 'Prison Break', 'Heroes', 'House',
      'Suits', 'Homeland', 'Mr. Robot', 'Killing Eve', 'Fleabag',
      'Downton Abbey', 'The Great British Bake Off', 'Love Island',
      'The Bachelor', 'Survivor', 'Big Brother', 'Amazing Race',
      'Ru Paul\'s Drag Race', 'American Idol', "America's Got Talent",
      'Dancing with the Stars', 'The Voice', 'MasterChef', 'Hell\'s Kitchen'
    ]
  },

  videoGames: {
    name: '🎮 Video Games',
    items: [
      'Minecraft', 'Fortnite', 'Among Us', 'Roblox', 'Grand Theft Auto V',
      'Call of Duty', 'FIFA', 'Halo', 'The Legend of Zelda', 'Super Mario Bros',
      'Pokémon', 'Valorant', 'Apex Legends', 'League of Legends', 'Dota 2',
      'Counter-Strike', 'Overwatch', 'Rocket League', 'Fall Guys', 'Warzone',
      'PUBG', 'Sea of Thieves', 'Subnautica', 'Terraria', 'Stardew Valley',
      'Animal Crossing', 'Splatoon', 'Super Smash Bros', 'Mario Kart',
      'The Witcher 3', 'Red Dead Redemption 2', 'Cyberpunk 2077', 'Elden Ring',
      'Dark Souls', 'God of War', 'The Last of Us', "Assassin's Creed",
      'Far Cry', 'The Elder Scrolls V: Skyrim', 'Fallout 4', 'Mass Effect',
      'BioShock', 'Portal', 'Half-Life', 'Team Fortress 2', 'Left 4 Dead',
      'Borderlands', 'Destiny 2', 'World of Warcraft', 'Final Fantasy VII',
      'Kingdom Hearts', 'Metal Gear Solid', 'Silent Hill', 'Resident Evil',
      'Tomb Raider', 'Uncharted', 'Horizon Zero Dawn', 'Death Stranding',
      'Marvel\'s Spider-Man', 'Batman: Arkham Knight', 'Mortal Kombat',
      'Street Fighter', 'Tekken', 'Forza Horizon', 'Gran Turismo',
      'Need for Speed', 'Tony Hawk\'s Pro Skater', 'Guitar Hero', 'Just Dance',
      'Wii Sports', 'Tetris', 'Pac-Man', 'Donkey Kong', 'Kirby',
      'Metroid', 'Star Fox', 'Fire Emblem', 'Xenoblade Chronicles',
      'Bayonetta', 'Pikmin', 'DOOM', 'Hades', 'Celeste', 'Hollow Knight',
      'Cuphead', 'Undertale', 'Ori and the Blind Forest', 'Shovel Knight',
      'Five Nights at Freddy\'s', 'Geometry Dash', 'Clash of Clans',
      'Clash Royale', 'Candy Crush', 'Angry Birds', 'Cut the Rope',
      'Temple Run', 'Subway Surfers', 'Hearthstone', 'Legends of Runeterra',
      'Genshin Impact', 'Honkai: Star Rail', 'Azur Lane', 'Arknights'
    ]
  },

  gameCharacters: {
    name: '👾 Game Characters',
    items: [
      'Mario', 'Luigi', 'Princess Peach', 'Bowser', 'Yoshi', 'Wario', 'Waluigi',
      'Link', 'Zelda', 'Ganondorf', 'Samus Aran', 'Pikachu', 'Charizard',
      'Mewtwo', 'Lucario', 'Gengar', 'Snorlax', 'Eevee', 'Bulbasaur',
      'Master Chief', 'Cortana', 'Kratos', 'Atreus', 'Sonic the Hedgehog',
      'Tails', 'Knuckles', 'Shadow the Hedgehog', 'Amy Rose', 'Mega Man',
      'Pac-Man', 'Lara Croft', 'Nathan Drake', 'Joel', 'Ellie', 'Tommy',
      'Arthur Morgan', 'John Marston', 'Trevor Philips', 'Michael De Santa',
      'Commander Shepard', 'Garrus Vakarian', 'Tali\'Zorah', 'Liara T\'Soni',
      'Geralt of Rivia', 'Ciri', 'Yennefer', 'Triss Merigold',
      'V (Cyberpunk 2077)', 'Johnny Silverhand', 'The Dovahkiin',
      'Sora', 'Cloud Strife', 'Tifa Lockhart', 'Aerith Gainsborough',
      'Sephiroth', 'Zack Fair', 'Ryu', 'Ken', 'Chun-Li', 'M. Bison',
      'Sub-Zero', 'Scorpion', 'Raiden', 'Kazuya Mishima', 'Jin Kazama',
      'Ezio Auditore', 'Altaïr', 'Connor Kenway', 'Bayek', 'Kassandra',
      'Aloy', 'Steve', 'Creeper', 'Herobrine', 'Alex', 'Enderman',
      'Tracer', 'Genji', 'Hanzo', 'D.Va', 'Mercy', 'Widowmaker',
      'Wraith', 'Pathfinder', 'Bloodhound', 'Lifeline', 'Bangalore',
      'Sans', 'Toriel', 'Papyrus', 'Asriel', 'Chara',
      'Shovel Knight', 'Cuphead', 'Ori', 'The Knight (Hollow Knight)',
      'Hornet', 'Zagreus', 'Hades', 'Frisk', 'Madeline (Celeste)',
      'Doomguy', 'Master Hand', 'Tabuu', 'Kirby', 'Meta Knight', 'King Dedede'
    ]
  },

  athletes: {
    name: '⚽ Athletes',
    items: [
      'Cristiano Ronaldo', 'Lionel Messi', 'LeBron James', 'Michael Jordan',
      'Serena Williams', 'Tiger Woods', 'Usain Bolt', 'Muhammad Ali',
      'Pelé', 'Roger Federer', 'Rafael Nadal', 'Novak Djokovic',
      'Tom Brady', 'Michael Phelps', 'Simone Biles', 'Neymar Jr.',
      'Kylian Mbappé', 'Erling Haaland', 'Kevin Durant', 'Stephen Curry',
      'Giannis Antetokounmpo', 'Luka Dončić', 'Nikola Jokić', 'Patrick Mahomes',
      'Ronaldinho', 'Zinedine Zidane', 'David Beckham', 'Wayne Rooney',
      'Thierry Henry', 'Andrés Iniesta', 'Xavi', 'Roberto Carlos',
      'Zlatan Ibrahimović', 'Didier Drogba', 'Mohamed Salah', 'Sadio Mané',
      'Kevin De Bruyne', 'Harry Kane', 'Virgil van Dijk', 'Bukayo Saka',
      'Jude Bellingham', 'Phil Foden', 'Marcus Rashford', 'Jack Grealish',
      'Kobe Bryant', 'Shaquille O\'Neal', 'Magic Johnson', 'Larry Bird',
      'Kareem Abdul-Jabbar', 'Wilt Chamberlain', 'Bill Russell', 'Charles Barkley',
      'Scottie Pippen', 'Dennis Rodman', 'Allen Iverson', 'Dwyane Wade',
      'Dirk Nowitzki', 'Tim Duncan', 'Steve Nash', 'Yao Ming', 'Hakeem Olajuwon',
      'Babe Ruth', 'Mickey Mantle', 'Willie Mays', 'Hank Aaron',
      'Derek Jeter', 'Ken Griffey Jr.', 'Barry Bonds', 'Cal Ripken Jr.',
      'Pete Rose', 'Jackie Robinson', 'Ty Cobb', 'Lou Gehrig',
      'Wayne Gretzky', 'Sidney Crosby', 'Alexander Ovechkin', 'Mario Lemieux',
      'Gordie Howe', 'Bobby Orr', 'Patrick Roy', 'Martin Brodeur',
      'Conor McGregor', 'Jon Jones', 'Anderson Silva', 'Georges St-Pierre',
      'Floyd Mayweather', 'Manny Pacquiao', 'Mike Tyson', 'Oscar De La Hoya',
      'Ronda Rousey', 'Amanda Nunes', 'Israel Adesanya', 'Dustin Poirier',
      'Roger Staubach', 'Jerry Rice', 'Joe Montana', 'Jim Brown',
      'Walter Payton', 'Barry Sanders', 'Lawrence Taylor', 'Peyton Manning',
      'Aaron Rodgers', 'Lamar Jackson', 'Josh Allen', 'Patrick Mahomes'
    ]
  },

  musicians: {
    name: '🎵 Musicians',
    items: [
      'Taylor Swift', 'Drake', 'Beyoncé', 'Jay-Z', 'Eminem', 'Kanye West',
      'Rihanna', 'Ed Sheeran', 'Adele', 'Bruno Mars', 'The Weeknd',
      'Billie Eilish', 'Ariana Grande', 'Dua Lipa', 'Harry Styles',
      'Justin Bieber', 'Lady Gaga', 'Katy Perry', 'Nicki Minaj', 'Cardi B',
      'Post Malone', 'Travis Scott', 'Bad Bunny', 'J Balvin', 'Daddy Yankee',
      'Shakira', 'Jennifer Lopez', 'Madonna', 'Michael Jackson', 'Prince',
      'Elvis Presley', 'Frank Sinatra', 'John Lennon', 'Paul McCartney',
      'Bob Dylan', 'David Bowie', 'Freddie Mercury', 'Kurt Cobain',
      'Jimi Hendrix', 'Jim Morrison', 'Mick Jagger', 'Bruce Springsteen',
      'Elton John', 'Billy Joel', 'Stevie Wonder', 'Marvin Gaye',
      'Aretha Franklin', 'Whitney Houston', 'Céline Dion', 'Mariah Carey',
      'Dolly Parton', 'Johnny Cash', 'Willie Nelson', 'Garth Brooks',
      'Sam Smith', 'Shawn Mendes', 'Charlie Puth', 'Khalid', 'Lizzo',
      'Olivia Rodrigo', 'Doja Cat', 'SZA', 'Kendrick Lamar', 'J. Cole',
      'Lil Wayne', 'Snoop Dogg', 'Dr. Dre', 'Ice Cube', 'Tupac Shakur',
      'The Notorious B.I.G.', 'Nas', 'Wu-Tang Clan', 'Run-DMC', 'LL Cool J',
      'BTS', 'BLACKPINK', 'EXO', 'Stray Kids', 'NCT', 'TWICE',
      'Metallica', 'Nirvana', 'Pearl Jam', 'Soundgarden', 'Alice in Chains',
      'Red Hot Chili Peppers', 'Foo Fighters', 'Linkin Park', 'Green Day',
      'Blink-182', 'Fall Out Boy', 'Panic! at the Disco', 'My Chemical Romance',
      'Twenty One Pilots', 'Imagine Dragons', 'Coldplay', 'Radiohead',
      'The Beatles', 'The Rolling Stones', 'Led Zeppelin', 'Pink Floyd',
      'Queen', 'AC/DC', 'Fleetwood Mac', 'Eagles', 'ABBA', 'Bee Gees',
      'Daft Punk', 'The Chainsmokers', 'Marshmello', 'Calvin Harris',
      'Avicii', 'David Guetta', 'Tiësto', 'Martin Garrix', 'Zedd',
      'SZA', 'H.E.R.', 'Jazmine Sullivan', 'Alicia Keys', 'John Legend'
    ]
  },

  actors: {
    name: '🎭 Actors & Actresses',
    items: [
      'Leonardo DiCaprio', 'Tom Hanks', 'Meryl Streep', 'Dwayne Johnson',
      'Robert Downey Jr.', 'Scarlett Johansson', 'Chris Evans', 'Chris Hemsworth',
      'Chris Pratt', 'Mark Ruffalo', 'Samuel L. Jackson', 'Ryan Reynolds',
      'Brad Pitt', 'Johnny Depp', 'Will Smith', 'Denzel Washington',
      'Morgan Freeman', 'Al Pacino', 'Robert De Niro', 'Jack Nicholson',
      'Marlon Brando', 'Clint Eastwood', 'Harrison Ford', 'Tom Cruise',
      'Keanu Reeves', 'Jim Carrey', 'Robin Williams', 'Eddie Murphy',
      'Adam Sandler', 'Russell Crowe', 'Hugh Jackman', 'Christian Bale',
      'Matt Damon', 'Ben Affleck', 'George Clooney', 'Angelina Jolie',
      'Jennifer Aniston', 'Sandra Bullock', 'Julia Roberts', 'Reese Witherspoon',
      'Charlize Theron', 'Cate Blanchett', 'Kate Winslet', 'Nicole Kidman',
      'Emma Stone', 'Jennifer Lawrence', 'Natalie Portman', 'Keira Knightley',
      'Amy Adams', 'Jessica Chastain', 'Viola Davis', 'Octavia Spencer',
      "Lupita Nyong'o", 'Halle Berry', 'Zendaya', 'Florence Pugh',
      'Margot Robbie', 'Ana de Armas', 'Pedro Pascal', 'Oscar Isaac',
      'Timothée Chalamet', 'Tom Holland', 'Jacob Elordi', 'Austin Butler',
      'Andrew Garfield', 'Idris Elba', 'Michael B. Jordan', 'Daniel Kaluuya',
      'Chadwick Boseman', 'Anthony Mackie', 'Paul Rudd', 'Jeremy Renner',
      'Benedict Cumberbatch', 'Tilda Swinton', 'Rachel McAdams',
      'Saoirse Ronan', 'Anya Taylor-Joy', 'Sydney Sweeney', 'Hunter Schafer',
      'Euphoria cast', 'Millie Bobby Brown', 'Jenna Ortega', 'Sadie Sink',
      'Gal Gadot', 'Brie Larson', 'Tessa Thompson', 'Simu Liu', 'Awkwafina',
      'Awkwafina', 'Ali Wong', 'Ken Jeong', 'John Cho', 'Steven Yeun',
      'Jason Momoa', 'Ezra Miller', 'Ray Fisher', 'Joe Manganiello',
      'Vin Diesel', 'Paul Walker', 'Michelle Rodriguez', 'Jordana Brewster',
      'Tobey Maguire', 'Kirsten Dunst', 'James Franco', 'Alfred Molina',
      'Willem Dafoe', 'Jamie Foxx', 'Electro', 'Marisa Tomei', 'Jon Favreau'
    ]
  },

  fictionalCharacters: {
    name: '🦸 Fictional Characters',
    items: [
      'Spider-Man', 'Batman', 'Superman', 'Iron Man', 'Captain America',
      'Thor', 'The Hulk', 'Black Widow', 'Hawkeye', 'Doctor Strange',
      'Black Panther', 'Ant-Man', 'Scarlet Witch', 'Vision', 'Falcon',
      'Winter Soldier', 'Groot', 'Rocket Raccoon', 'Star-Lord', 'Gamora',
      'Drax', 'Thanos', 'Loki', 'Nick Fury', 'Captain Marvel',
      'Joker', 'Lex Luthor', 'The Penguin', 'The Riddler', 'Catwoman',
      'Harley Quinn', 'Green Lantern', 'The Flash', 'Wonder Woman', 'Aquaman',
      'Harry Potter', 'Hermione Granger', 'Ron Weasley', 'Dumbledore',
      'Voldemort', 'Snape', 'Draco Malfoy', 'Sirius Black', 'Dobby',
      'Frodo Baggins', 'Samwise Gamgee', 'Gandalf', 'Aragorn', 'Legolas',
      'Gimli', 'Sauron', 'Gollum', 'Bilbo Baggins', 'Elrond',
      'Darth Vader', 'Luke Skywalker', 'Princess Leia', 'Han Solo',
      'Yoda', 'Obi-Wan Kenobi', 'Anakin Skywalker', 'Rey', 'Kylo Ren',
      'Daenerys Targaryen', 'Jon Snow', 'Tyrion Lannister', 'Cersei Lannister',
      'Arya Stark', 'Sansa Stark', 'Ned Stark', 'Joffrey Baratheon',
      'Walter White', 'Jesse Pinkman', 'Saul Goodman', 'Gus Fring',
      'Michael Scott', 'Dwight Schrute', 'Jim Halpert', 'Pam Beesly',
      'Ross Geller', 'Rachel Green', 'Monica Geller', 'Chandler Bing',
      'Joey Tribbiani', 'Phoebe Buffay', 'Sheldon Cooper', 'Leonard Hofstadter',
      'Penny', 'Bart Simpson', 'Homer Simpson', 'Marge Simpson', 'Lisa Simpson',
      'Sherlock Holmes', 'John Watson', 'Moriarty', 'James Bond',
      'Indiana Jones', 'Jack Sparrow', 'Hannibal Lecter', 'Dexter Morgan'
    ]
  }
};

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
    result: room.result || null
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
        imposterCount: 1,
        blindImposter: false,
        selectedCategories: ['movies', 'tvShows', 'videoGames', 'gameCharacters']
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
  socket.on('start-game', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    if (room.players.length < 3) return socket.emit('error', { message: 'Need at least 3 players to start.' });
    const maxImposters = Math.floor((room.players.length - 1) / 2);
    if (room.settings.imposterCount > maxImposters) {
      return socket.emit('error', { message: `Too many imposters for ${room.players.length} players. Max is ${maxImposters}.` });
    }

    // Pick word from selected categories
    const { word, category, categoryKey } = pickWordFromCategories(room.settings.selectedCategories);
    room.currentWord = word;
    room.currentCategory = category;
    room.currentCategoryKey = categoryKey;

    // Assign imposters
    const shuffled = [...room.players].sort(() => Math.random() - 0.5);
    room.imposters = shuffled.slice(0, room.settings.imposterCount).map(p => p.id);

    // Reset state
    room.gameState = 'role-reveal';
    room.votes = {};
    room.readyPlayers = new Set();
    room.eliminatedPlayers = [];
    room.lastEliminated = null;
    room.result = null;
    room.votingHistory = []; // track every round of votes

    // Send each player their private role
    room.imposterWords = {}; // track each imposter's word (for blind mode reveal at end)
    room.players.forEach(player => {
      const isImposter = room.imposters.includes(player.id);
      let roleData;

      if (isImposter) {
        if (room.settings.blindImposter) {
          // Blind mode: imposter gets a different word, doesn't know they're the imposter
          const imposterWord = pickDifferentWord(room.settings.selectedCategories, word, categoryKey);
          room.imposterWords[player.id] = imposterWord;
          roleData = {
            role: 'unknown',
            word: imposterWord,
            category,
            blindMode: true
          };
        } else {
          // Normal mode: imposter knows, gets no word
          room.imposterWords[player.id] = null;
          roleData = { role: 'imposter', word: null, category, blindMode: false };
        }
      } else {
        roleData = { role: 'player', word, category, blindMode: room.settings.blindImposter };
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

  // Play again
  socket.on('play-again', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    room.gameState = 'lobby';
    room.currentWord = null;
    room.currentCategory = null;
    room.currentCategoryKey = null;
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

  // Disconnect
  socket.on('disconnect', () => {
    const room = rooms[socket.roomCode];
    if (!room) return;
    room.players = room.players.filter(p => p.id !== socket.id);
    if (room.readyPlayers) room.readyPlayers.delete(socket.id);
    if (room.players.length === 0) {
      delete rooms[room.code];
      return;
    }
    if (room.host === socket.id) {
      room.host = room.players[0].id;
      room.players[0].isHost = true;
    }
    io.to(room.code).emit('room-update', sanitizeRoom(room));
    io.to(room.code).emit('player-left', { name: socket.playerName || 'A player' });
  });
});

// ─────────────────────────────────────────────
// BUILD GAME-OVER PAYLOAD (shared helper)
// ─────────────────────────────────────────────
function buildResultPayload(room, extra = {}) {
  return {
    result: room.result,
    word: room.currentWord || '',
    category: room.currentCategory || '',
    blindMode: !!(room.settings && room.settings.blindImposter),
    imposters: (room.imposters || []).map(id => {
      const p = room.players.find(p => p.id === id);
      return p ? p.name : null;
    }).filter(Boolean),
    imposterWords: (room.imposters || []).map(id => {
      const p = room.players.find(p => p.id === id);
      return {
        name: p ? p.name : id,
        word: (room.imposterWords || {})[id] || null
      };
    }),
    eliminated: room.lastEliminated || null,
    votingHistory: room.votingHistory || [],
    allPlayers: (room.players || []).map(p => ({
      name: p.name,
      isImposter: (room.imposters || []).includes(p.id)
    })),
    ...extra
  };
}

// ─────────────────────────────────────────────
// VOTE RESOLUTION LOGIC
// ─────────────────────────────────────────────
function resolveVotes(room) {
  const tally = tallyVotes(room.votes);
  let maxVotes = 0;
  Object.values(tally).forEach(c => { if (c > maxVotes) maxVotes = c; });
  const topCandidates = Object.entries(tally).filter(([, c]) => c === maxVotes).map(([id]) => id);
  const eliminatedId = pickRandom(topCandidates);

  const eliminatedPlayer = room.players.find(p => p.id === eliminatedId);
  const isImposter = room.imposters.includes(eliminatedId);
  room.eliminatedPlayers.push(eliminatedId);

  // Build name-based tally
  const namedTally = Object.fromEntries(
    Object.entries(tally).map(([id, count]) => {
      const p = room.players.find(pl => pl.id === id);
      return [p?.name || id, count];
    })
  );

  // Build individual vote map: voter name → who they voted for
  const individualVotes = Object.fromEntries(
    Object.entries(room.votes).map(([voterId, targetId]) => {
      const voter = room.players.find(p => p.id === voterId);
      const target = room.players.find(p => p.id === targetId);
      return [voter?.name || voterId, target?.name || targetId];
    })
  );

  room.lastEliminated = {
    id: eliminatedId,
    name: eliminatedPlayer?.name || 'Unknown',
    isImposter,
    voteCount: maxVotes,
    totalVotes: Object.keys(room.votes).length,
    tally: namedTally
  };

  // Save this round to history
  if (!room.votingHistory) room.votingHistory = [];
  room.votingHistory.push({
    round: room.votingHistory.length + 1,
    individualVotes,
    tally: namedTally,
    eliminated: { name: eliminatedPlayer?.name || 'Unknown', isImposter }
  });

  const remainingImposters = room.imposters.filter(id => !room.eliminatedPlayers.includes(id));
  const activePlayers = room.players.filter(p => !room.eliminatedPlayers.includes(p.id));

  if (isImposter) {
    if (remainingImposters.length === 0) {
      // Last imposter found — players win, go straight to results
      room.gameState = 'game-over';
      room.result = 'players-win';
      io.to(room.code).emit('game-over', buildResultPayload(room));
      io.to(room.code).emit('room-update', sanitizeRoom(room));
    } else {
      // Still more imposters — game continues
      room.gameState = 'discussion';
      room.votes = {};
      io.to(room.code).emit('room-update', sanitizeRoom(room));
      io.to(room.code).emit('elimination-result', {
        eliminated: room.lastEliminated,
        gameState: 'discussion',
        remainingImposters: remainingImposters.length
      });
    }
  } else {
    // Wrong person eliminated
    const imposterCount = remainingImposters.length;
    const innocentCount = activePlayers.filter(p => !room.imposters.includes(p.id)).length;

    if (imposterCount >= innocentCount) {
      // Imposters win by majority — show elimination result THEN game-over
      room.gameState = 'game-over';
      room.result = 'imposters-win';
      io.to(room.code).emit('elimination-result', {
        eliminated: room.lastEliminated,
        gameState: 'game-over'
      });
      io.to(room.code).emit('game-over', buildResultPayload(room));
      io.to(room.code).emit('room-update', sanitizeRoom(room));
    } else {
      // Continue game
      room.gameState = 'elimination';
      room.votes = {};
      io.to(room.code).emit('room-update', sanitizeRoom(room));
      io.to(room.code).emit('elimination-result', {
        eliminated: room.lastEliminated,
        gameState: 'elimination'
      });
    }
  }
}

// ─────────────────────────────────────────────
// EXPORT CATEGORIES FOR CLIENT USE
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// EXPORT CATEGORIES FOR CLIENT USE
// ─────────────────────────────────────────────
app.get('/api/categories', (req, res) => {
  const cats = Object.entries(CATEGORIES).map(([key, val]) => ({
    key,
    name: val.name,
    count: val.items.length
  }));
  res.json(cats);
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎮 Imposter game running on http://localhost:${PORT}`);
});
