const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: String,
    User: String,
    Code: String,
    Note: String,
    Priority: String
});

module.exports = mongoose.model("notes", Schema);