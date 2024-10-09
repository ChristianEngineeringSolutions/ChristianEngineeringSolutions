'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const notificationSchema = mongoose.Schema({
    //who is the notification for?
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //who is the notification about?
    about: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //which passage does the notification concern?
    about: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passage'
    },
    content: String,
    //date of creation
    date: {type: Date, default: Date.now},
});

notificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Notification', notificationSchema, 'Notifications');