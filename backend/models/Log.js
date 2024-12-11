const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true }, // Identifier for the log
  ladangData: { type: Array, required: true }, // Array of ladang data
  date: { type: String, required: true }, // Date of the log
});

module.exports = mongoose.model('Log', logSchema);