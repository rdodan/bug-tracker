const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TicketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: 'Please select the ticket type'
    },
    priority: {
        type: String,
        required: 'Please select the priority'
    },
    status: {
        type: String,
        required: true,
        default: 'In progress' 
    },
    author: {
        type: String,
        required: true
    },
    bug: {
        type: Schema.Types.ObjectId,
        ref: 'Bug',
        required: true
    }
}, {
    timestamps: true
})




module.exports = Ticket = mongoose.model('Ticket', TicketSchema);