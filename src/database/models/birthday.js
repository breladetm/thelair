const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: { type: String, required: true },
    Birthday: { type: String, required: true },
    Username: { type: String, default: 'Unknown User' }, // Store the username
    UserID: { type: String, required: true } // Store the user ID
});

module.exports = mongoose.model("birthday", Schema);
