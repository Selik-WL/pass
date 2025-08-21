import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const formatSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true
    },
    description: { 
        type: String, 
        required: true 
    },
    components: {
        type: [
            {
                type: {type: String, required: true},
                name: {type: String, required: true}
            }
        ],
        required: true
    }
}, {
    collection: 'protocol_formats'
});

formatSchema.plugin(uniqueValidator);

export default mongoose.model('User', formatSchema);
