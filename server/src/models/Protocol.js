import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const protocolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    filePath:{
        type: String
    },
    labID:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'laboratories', 
        required: true
    },
    contributerIDs:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        required: true
    },
    lastModificationTime: {
        type: Timestamp,
        required: true
    }, 
    notes: {
        type: String
    },
    formatID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'protocol_formats',
        required: true
    }, 
    components: {

    }
}, {
    collection: 'protocols',
    timestamps: { updatedAt: 'lastModificationTime' }
});

protocolSchema.plugin(uniqueValidator);

export default mongoose.model('User', protocolSchema);
