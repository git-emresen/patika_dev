const express=require('express');
const router=express.Router();
const auth=require('../lib/auth');   
const authControllers=require('../controllers/authControllers');  


router.route("/login").post(authControllers.login);
router.route("/register").post(authControllers.register);
router.route("/refresh").post(authControllers.refresh);
router.use(auth.authMiddleware);
router.route("/logout").post(authControllers.logout);
router.route("/me").get(authControllers.me);
router.route("/forgot-password").post(authControllers.forgotPassword); 


module.exports=router;