'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const passageSchema = mongoose.Schema({
    //
    systemRecord: {
        type: Boolean,
        default: false
    },
    //author is first user
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    title: String,
    html: String,
    css: String,
    javascript: String,
    // tags: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Tag'
    // }],
    tags: String, //["tag1", "tag2", "tag3", ...]
    /**
     * {
     *  "tag1": {
     *          reputation: Number //from user reputation on bump
     *      }
     * }
     */
    /** tags.join('') => Regex $search */
    // From original to previous passage source
    sourceList : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passage'
    }],
    //alternate list
    alternates : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passage'
    }],
    content: String,
    //forces content to be a unique value unless null
    // content: {
    //     type: String,
    //     index: {
    //         unique: true,
    //         partialFilterExpression: {content: {$type: "string"}}
    //     }
    // },
    //chapter the passage belongs to
    // chapter: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Chapter'
    // },
    //parent passage the passage belongs to
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passage'
    },
    // sub passages under this passage
    passages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passage'
    }],
    //date of creation
    date: {type: Date, default: Date.now},
    //date last updated
    updated: {type: Date, default: Date.now},
    stars: {
        type: Number,
        default: 0
    },
    crossOriginAllowed: {
        type: Boolean,
        default: false
    },
    flagged: {
        type: Boolean,
        default: false
    }, //content warning
    filename: String, // associated file
    deleted: {
        type: Boolean,
        default: false
    },
    //quill, codeMirror, etc.
    editor: String,
    //permissions/settings
    public: {
        type: Boolean,
        default: false
    },
    personal_cross_origin: {
        type: Boolean,
        default: false
    },
    personal_same_origin: {
        type: Boolean,
        default: false
    },
    //0 is false, 1 is requesting, 2 is active
    public_daemon: {
        type: Number,
        default: 0
    },
    admin_cross_origin_all: {
        type: Boolean,
        default: false
    },
    admin_same_origin: {
        type: Boolean,
        default: false
    },
    admin_make_daemon: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    }

});
var autoPopulateChildren = function(next) {
    this.populate('passages');
    next();
};

passageSchema
.pre('findOne', autoPopulateChildren)
.pre('find', autoPopulateChildren)
passageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Passage', passageSchema, 'Passages');