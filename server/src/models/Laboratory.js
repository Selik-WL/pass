import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const laboratorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true
    },
    description: { 
        type: String, 
        required: true 
    }
}, {
    collection: 'laboratories'
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('Laboratory', laboratorySchema);
