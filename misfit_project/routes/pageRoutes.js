const express = require('express');
const router = express.Router();
const auth= require('../lib/auth');
const pageControllers= require('../controllers/pageControllers');



router.route('/').get(pageControllers.getHomePage);
router.route('/home').get(pageControllers.getHomePage);
router.route('/index').get(pageControllers.getHomePage);
router.route('/about').get(pageControllers.getAboutPage);
router.route('/panel').get(pageControllers.getUserPanelPage);
router.route('/contact').get(pageControllers.getContactPage);
router.route('/gallery').get(pageControllers.getGalleryPage);
router.route('/trainer').get(pageControllers.getTrainerPage);
router.route('/error').get(pageControllers.getErrorPage);



module.exports = router;