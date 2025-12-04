const express = require('express');
const authChecker = require('../lib/middleware/auth');

const router = express.Router();

const {
    getAllTrainings,
    getTraining,
    createTraining,
    updateTraining,
    deleteTraining,
    joinTraining,
    leaveTraining,
    getUserTrainings
} = require('../controllers/trainingControllers');

router.use(authChecker.isAuthenticated);

router.get('/', getAllTrainings);
router.get('/user/my-trainings', getUserTrainings);
router.get('/:id', getTraining);
router.post('/create', createTraining);
router.post('/join', joinTraining);
router.post('/leave', leaveTraining);
router.put('/:id', updateTraining);
router.delete('/:id', deleteTraining);

module.exports = router;