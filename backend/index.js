const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string
const mongoURI = 'mongodb+srv://Mondongo:db088900@clusterzero.0s3gg.mongodb.net/test?ssl=true&retryWrites=true&w=majority&appName=ClusterZero';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the User model
const User = require('./models/User');

// Define the Log model
const LogSchema = new mongoose.Schema({
  logId: { type: Number, required: true },
  data: [
    {
      ladangName: { type: String, required: true },
      sprayType: { type: String, required: true },
      status: { type: String, required: true },
      date: { type: String, required: true },
    }
  ],
});

const Log = mongoose.model('Log', LogSchema);

// Route to register a new user
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Route to authenticate a user
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ 
        message: 'Sign-in successful', 
        username: user.username, 
        profilePicture: user.profilePicture || '/profile.png' 
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to update profile picture
app.put('/update-profile-picture', async (req, res) => {
  const { username, profilePicture } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { profilePicture },
      { new: true }
    );
    if (user) {
      res.status(200).json({ message: 'Profile picture updated', user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});

// Route to get user details
app.get('/user', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Route to get or update log1 data
app.route('/log1')
  .get(async (req, res) => {
    try {
      const log1 = await Log.findOne({ logId: 1 });
      if (log1) {
        res.status(200).json(log1);
      } else {
        res.status(404).json({ error: 'Log1 not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch log1 data' });
    }
  })
  .post(async (req, res) => {
    const { data } = req.body;

    try {
      const log1 = await Log.findOneAndUpdate(
        { logId: 1 },
        { logId: 1, data },
        { upsert: true, new: true }
      );
      res.status(200).json({ message: 'Log1 updated', log: log1 });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update log1 data' });
    }
  });

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});