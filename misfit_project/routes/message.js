const express=require('express');
const contactController = require('../controllers/contactControllers');
const router=express.Router();

router.get('/getall', contactController.getMessages);
router.post('/create', contactController.createMessage);
router.get('/getById/:id', contactController.getMessage);
router.delete('/delete/:id', contactController.deleteMessage);

module.exports=router;