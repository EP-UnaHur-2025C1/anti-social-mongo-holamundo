const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
    urlImg: {
        type: String,
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    }
}, {
    collection: 'images'
});

imageSchema.set('toJSON', {
    virtuals: true,
    transform:(_, ret) => {
        delete ret.__v;
        delete ret._id;
    }
});

module.exports = mongoose.model('Image', imageSchema);
