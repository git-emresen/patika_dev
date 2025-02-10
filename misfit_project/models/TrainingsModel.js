
const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    trainerId:{ type: String }, /* { type: String, ref: 'users', required: true }, */ //TODO:mongoose.Types.ObjectId HATASI    
    title: { type: String },
    description: { type: String },
    difficulty: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true
    },
    duration: { type: Number },
    exercises: [
        {
            name: { type: String, required: true },
            reps: { type: Number, required: true },
            sets: { type: Number, required: true }
        }],
    createdAt: { type: Date, default: Date.now }
});

class Training extends mongoose.Schema {

}

module.exports = mongoose.model('Training', trainingSchema);