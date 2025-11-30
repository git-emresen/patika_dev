const express = require('express');
const router = express.Router();
const { isAuthenticated, requireRole } = require('../lib/middleware/auth');
const pageControllers= require('../controllers/pageControllers');

/* const allowUser = [isAuthenticated, requireRole('user')]; */

router.route('/').get(pageControllers.getHomePage);
router.route('/index').get(pageControllers.getHomePage);
router.route('/home').get(pageControllers.getHomePage);
router.route('/about').get(pageControllers.getAboutPage);

router.route('/panel')
 .all(isAuthenticated,requireRole('member'))
 .get(pageControllers.getUserPanelPage);
 
router.route('/contact').get(pageControllers.getContactPage);
router.route('/gallery').get(pageControllers.getGalleryPage);
router.route('/trainer').get(pageControllers.getTrainerPage);
router.route('/login').get(pageControllers.getLoginPage);
router.route('/error').get(pageControllers.getErrorPage);



module.exports = router;