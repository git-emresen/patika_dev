const workoutSchema = new mongoose.Schema({
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Workout = mongoose.model('Workout', workoutSchema);