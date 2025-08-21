import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
    handle: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true }
}, {
    collection: 'users'
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
