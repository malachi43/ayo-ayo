const { Schema, model } = require('mongoose');

const opts = { timestamps: true }
const gameSchema = new Schema({
    name: {
        type: String,
        required: [true, 'game must have a name.'],
        lowercase: true
    },
    description: {
        type: String,
    },
    genre: {
        type: String,
        default: "traditional"
    }
}, opts)

module.exports = model('game', gameSchema);