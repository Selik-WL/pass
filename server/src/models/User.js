import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
    handle: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    admin: { 
        type: Boolean, 
        required: true
    },
    enabled: {
        type: Boolean, 
        required: true
    },
    name: { 
        type: String, 
        required: true
    },
    password: { 
        type: String, 
        required: true 
    },
    labID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'laboratories',
        required: true
    }
}, {
    collection: 'users'
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
