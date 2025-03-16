const express=require('express');
const contactController = require('../controllers/contactControllers');
const auth=require("../lib/auth");  

const router=express.Router();

router.get('/getall',auth.authMiddleware, contactController.getMessages);
router.post('/create', contactController.createMessage);
router.post('/getById/:id',auth.authMiddleware, contactController.getMessage);
router.post('/delete/:id', auth.authMiddleware, contactController.deleteMessage);

module.exports=router;