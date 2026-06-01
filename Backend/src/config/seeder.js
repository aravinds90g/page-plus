const User = require('../models/User');
const Book = require('../models/Book');

const seedData = async () => {
  try {
    // 1. Create or Reset Default Users
    let admin = await User.findOne({ email: 'admin@bookverse.com' });
    if (!admin) {
      admin = new User({
        name: 'Admin Bookverse',
        email: 'admin@bookverse.com',
        password: 'password123',
        role: 'admin',
      });
      await admin.save();
      console.log('Created test admin: admin@bookverse.com / password123');
    } else {
      admin.password = 'password123';
      await admin.save();
      console.log('Ensured/Reset test admin password: admin@bookverse.com / password123');
    }

    let normalUser = await User.findOne({ email: 'jane@bookverse.com' });
    if (!normalUser) {
      normalUser = new User({
        name: 'Jane Doe',
        email: 'jane@bookverse.com',
        password: 'password123',
        role: 'user',
      });
      await normalUser.save();
      console.log('Created test user: jane@bookverse.com / password123');
    } else {
      normalUser.password = 'password123';
      await normalUser.save();
      console.log('Ensured/Reset test user password: jane@bookverse.com / password123');
    }

    // 2. Create Default Books only if no books exist at all
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      console.log('No books found. Seeding default books...');
      const sampleBooks = [
        {
          title: "Dune",
          author: "Frank Herbert",
          genre: "Sci-Fi",
          year: 1965,
          description: "A mythic tale of politics, religion, and ecology on the desert world of Arrakis, where spice is the key to interstellar travel.",
          cosmicAlignment: "The Spice must flow through the void.",
          imageUrl: "https://images.unsplash.com/photo-1547483238-2cbf88bc6666?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "The Midnight Library",
          author: "Matt Haig",
          genre: "Fiction",
          year: 2020,
          description: "Between life and death exists a library where every book contains a different version of your life.",
          cosmicAlignment: "Infinite shelves, infinite possibilities.",
          imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "Sapiens",
          author: "Yuval Noah Harari",
          genre: "Non-Fiction",
          year: 2011,
          description: "The grand narrative of humanity's journey from insignificant apes to rulers of the world.",
          cosmicAlignment: "A brief history of cosmic insignificance.",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "Gone Girl",
          author: "Gillian Flynn",
          genre: "Mystery",
          year: 2012,
          description: "A marriage dissolves into a labyrinth of deceit, media frenzy, and psychological manipulation.",
          cosmicAlignment: "Truth dissolves in the event horizon.",
          imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "The Name of the Wind",
          author: "Patrick Rothfuss",
          genre: "Fantasy",
          year: 2007,
          description: "The tale of Kvothe, a legendary figure who has hidden himself away, waiting to die.",
          cosmicAlignment: "Words that shape reality itself.",
          imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "Elon Musk",
          author: "Walter Isaacson",
          genre: "Biography",
          year: 2023,
          description: "The story of a man driven by cosmic ambitions — saving Earth while reaching for Mars.",
          cosmicAlignment: "A terrestrial being with extraterrestrial dreams.",
          imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "Neuromancer",
          author: "William Gibson",
          genre: "Sci-Fi",
          year: 1984,
          description: "A washed-up computer hacker hired for one last job in the sprawling cyberspace matrix.",
          cosmicAlignment: "The sky above the port was the color of television.",
          imageUrl: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "Circe",
          author: "Madeline Miller",
          genre: "Fantasy",
          year: 2018,
          description: "The immortal sorceress Circe tells her own story of gods, mortals, and the power of transformation.",
          cosmicAlignment: "Witchcraft born from starlight.",
          imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "The Martian",
          author: "Andy Weir",
          genre: "Sci-Fi",
          year: 2011,
          description: "Stranded alone on Mars, an astronaut must use science and wit to survive impossible odds.",
          cosmicAlignment: "Solitude in the red void.",
          imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "Piranesi",
          author: "Susanna Clarke",
          genre: "Fantasy",
          year: 2020,
          description: "A man lives in a vast house with infinite rooms and an ocean imprisoned within its halls.",
          cosmicAlignment: "Infinite architecture, singular truth.",
          imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "Educated",
          author: "Tara Westover",
          genre: "Biography",
          year: 2018,
          description: "A woman's quest for knowledge breaks the chains of a survivalist upbringing in the mountains.",
          cosmicAlignment: "Knowledge as liberation from gravity.",
          imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "Project Hail Mary",
          author: "Andy Weir",
          genre: "Sci-Fi",
          year: 2021,
          description: "A lone astronaut wakes with amnesia on a desperate mission to save humanity from extinction.",
          cosmicAlignment: "Amnesia among the stars.",
          imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "The Invisible Life of Addie LaRue",
          author: "V.E. Schwab",
          genre: "Fantasy",
          year: 2020,
          description: "A woman cursed to be forgotten by everyone she meets lives through 300 years of human history.",
          cosmicAlignment: "Remembered only by the void.",
          imageUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "Atomic Habits",
          author: "James Clear",
          genre: "Non-Fiction",
          year: 2018,
          description: "Tiny changes, remarkable results — the science of building good habits and breaking bad ones.",
          cosmicAlignment: "Small actions, cosmic consequences.",
          imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400",
          createdBy: admin._id,
        },
        {
          title: "The Three-Body Problem",
          author: "Cixin Liu",
          genre: "Sci-Fi",
          year: 2008,
          description: "First contact with an alien civilization on the brink of destruction forces humanity to confront its place in the cosmos.",
          cosmicAlignment: "The universe is a dark forest.",
          imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=400",
          createdBy: admin._id,
        },
      ];
      await Book.insertMany(sampleBooks);
      console.log('Sample books seeded successfully with cover images!');
    } else {
      console.log(`Database already contains ${bookCount} books. Skipping book seeder.`);
    }
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
};

module.exports = seedData;
