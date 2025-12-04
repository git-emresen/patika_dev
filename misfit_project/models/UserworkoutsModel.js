const mongoose = require('mongoose');

const userWorkoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Training', required: true },
    assignedAt: { type: Date, default: Date.now }
});

const UserWorkout = mongoose.model('UserWorkout', userWorkoutSchema);

module.exports = UserWorkout;