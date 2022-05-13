const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BugSchema = new Schema({
    title: {
        type: String,
        required: 'Please add a title'
    },
    description: {
        type: String,
        required: 'Please add a description',
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    tags: [{
        tag: {
            type: String
        }
    }]
}, {
    timestamps: true
});


module.exports = Bug = mongoose.model('Bug', BugSchema);