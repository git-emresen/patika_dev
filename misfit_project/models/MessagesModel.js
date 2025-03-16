const mongoose=require('mongoose');

const messageSchema = new mongoose.Schema({
    user_name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
},{
    versionKey: false 
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;   