const mongoose = require('mongoose'), Schema = mongoose.Schema

const ClientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    email: {
        type: String,
        required: true,
        min: 5
    },
    phone: {
        type: String,
        required: true,
        min: 3
    },
    totalbill: {
        type: String,
        required: true,
    },
    agency: { type: Schema.Types.ObjectId, ref: 'Agency' }
});

module.exports = mongoose.model('Client', ClientSchema);