import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
    keywords: {
        type: Array,
        required: true
    },
    message: {
        type: String,
        required: true
    },
})

const Message = models.Message || model('Message', MessageSchema);

export default Message;