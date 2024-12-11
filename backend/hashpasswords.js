const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const mongoURI = 'mongodb+srv://Mondongo:db088900@clusterzero.0s3gg.mongodb.net/test?retryWrites=true&w=majority&appName=ClusterZero';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

async function hashPasswords() {
  const users = await User.find();
  for (const user of users) {
    // Skip already hashed passwords
    if (!user.password.startsWith('$2b$')) {
      console.log(`Hashing password for user: ${user.username}`);
      const hashedPassword = bcrypt.hashSync(user.password, 10);
      user.password = hashedPassword;
      await user.save();
    }
  }
  console.log('All passwords have been hashed.');
  mongoose.disconnect();
}

hashPasswords().catch((err) => console.error(err));