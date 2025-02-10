const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const authControllers=require('../controllers/authControllers');  


router.route("/login").post(authControllers.login);
router.route("/register").post(authControllers.register);
router.route("/logout").post(authControllers.logout);
router.route("/me").get(authControllers.me);
router.route("/forgot-password").post(authControllers.forgotPassword); 
router.route("/refresh").post(authControllers.refresh);

module.exports=router;