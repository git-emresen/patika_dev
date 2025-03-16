const express = require('express');
const auth = require('../lib/auth');

const router = express.Router();

const {
    getAllTrainings,
    getTraining,
    createTraining,
    updateTraining,
    deleteTraining
} = require('../controllers/trainingControllers');

router.use(auth.authMiddleware);

router.get('/', getAllTrainings);
router.get('/:id', getTraining);
router.post('/create', createTraining);
router.put('/:id', updateTraining);
router.delete('/:id', deleteTraining);

module.exports = router;