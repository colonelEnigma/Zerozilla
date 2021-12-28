const mongoose = require('mongoose'), Schema = mongoose.Schema

var agencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    address_one: {
        type: String,
        required: true,
        min: 5,
    },
    address_two: {
        type: String,
        min: 5
    },
    state: {
        type: String,
        required: true,
        min: 3
    },
    city: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        min: 10,
        max: 10
    },
    user:  { type: Schema.Types.ObjectId, ref: 'User' },
    clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }]
})

module.exports = mongoose.model('Agency', agencySchema);