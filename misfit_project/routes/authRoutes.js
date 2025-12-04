const express=require('express');
const router=express.Router();
const { isAuthenticated }=require('../lib/middleware/auth');   
const authControllers=require('../controllers/authControllers');  


router.route("/login").post(authControllers.login);
router.route("/signup").post(authControllers.signup);
router.route("/refresh").post(authControllers.refresh);
router.use(isAuthenticated);
router.route("/logout").get(authControllers.logout);
router.route("/me").get(authControllers.me);
router.route("/forgot-password").post(authControllers.forgotPassword); 


module.exports=router;