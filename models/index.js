'use strict';
const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/sasame', function(err){
    if (err) {
        return console.error(err);
    }
    setTimeout( () => {
        mongoose.connect('mongodb://localhost/sasame');
    }, 5000);
});
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var chapterSchema = mongoose.Schema({
    author: Number,
    title: String, //name of the category
    //passages that belong to this category
    passages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passage'
    }], //array of passage IDs
    //chapters that belong to this category
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    }],
    //chapter the category belongs to
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    },
    level: Number,
    //can others make passages and chapters in here?
    //author can delete anything but cant edit
    //users can always edit/delete their own passages
    shared: Boolean,
    //can others see this chapter?
    isPublic: Boolean
});
chapterSchema.plugin(mongoosePaginate);
var passageSchema = mongoose.Schema({
    author: Number,
    content: String,
    keys: String,
    //chapter the passage belongs to
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    },
    //chapter the passage came from
    sourceChapter: String,
    votes: Number,
});
passageSchema.plugin(mongoosePaginate);
var userSchema = mongoose.Schema({
    //This is kinda like a rank or VIP or admin
    perfect: Number,
    password: { type: String, required: true, index: {unique:true} },
    name: {type: String, required: [true, "can't be blank"]},
    email: {type: String, lowercase: true, 
        required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
});
userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
module.exports.Passage = mongoose.model('Passage', passageSchema, 'Passages');
module.exports.Chapter = mongoose.model('Chapter', chapterSchema, 'Chapters');
module.exports.User = mongoose.model('User', userSchema, 'Users');
