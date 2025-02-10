const express = require('express');

const router = express.Router();

const {
    getAllTrainings,
    getTraining,
    createTraining,
    updateTraining,
    deleteTraining
} = require('../controllers/trainingControllers');

router.get('/', getAllTrainings);
router.get('/:id', getTraining);
router.post('/create', createTraining);
router.put('/:id', updateTraining);
router.delete('/:id', deleteTraining);

module.exports = router;