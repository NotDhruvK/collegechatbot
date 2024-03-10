import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
    keywords: {
        type: Array,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
    button: {
        type: Array,
        required: false
    },
    files: {
        type: Array,
        required: false
    },
    auth:{
        type: Boolean,
        required: true,
        default: false  
    }
})

const Message = models.Message || model('Message', MessageSchema);

export default Message;