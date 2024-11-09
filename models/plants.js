const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
});

const Plants = mongoose.model('Plant', plantSchema);
module.exports = Plants;
