const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../lib/middleware/auth');
const pageControllers= require('../controllers/pageControllers');

/* const allowUser = [isAuthenticated, requireRole('user')]; */

router.route('/').get(pageControllers.getHomePage);
router.route('/index').get(pageControllers.getHomePage);
router.route('/home').get(pageControllers.getHomePage);
router.route('/about').get(pageControllers.getAboutPage);

router.route('/panel')
 .get(isAuthenticated, (req, res) => {
    const userRole = req.session.user?.role;
    
    if (userRole === 'trainer') {
       return res.redirect('/panel/trainer');
    } else if (userRole === 'admin') {
       return res.redirect('/panel/admin');
    } else {
       return res.redirect('/panel/member');
    }
 });

router.route('/panel/member').get(isAuthenticated, pageControllers.getUserPanelPage);
router.route('/panel/admin').get(isAuthenticated, pageControllers.getAdminPanelPage);
router.route('/panel/trainer').get(isAuthenticated, pageControllers.getTrainerPanelPage);
 
router.route('/contact').get(pageControllers.getContactPage);
router.route('/gallery').get(pageControllers.getGalleryPage);
router.route('/trainer').get(pageControllers.getTrainerPage);
router.route('/login').get(pageControllers.getLoginPage);
router.route('/error').get(pageControllers.getErrorPage);



module.exports = router;