const express=require('express');
const contactController = require('../controllers/contactControllers');
const { isAuthenticated } = require("../lib/middleware/auth");  

const router=express.Router();

router.get('/getall', isAuthenticated, contactController.getMessages);
router.post('/create', contactController.createMessage);
router.post('/getById/:id', isAuthenticated, contactController.getMessage);
router.post('/delete/:id', isAuthenticated, contactController.deleteMessage);

module.exports=router;