const authChecker = require('../lib/middleware/auth');

const getHomePage = (req, res) => {
    res.render('index', { title: 'Home Page' });
};

const getAboutPage = (req, res) => {
    res.render('about', { title: 'About Page' });
};

const getContactPage = (req, res) => {
    res.render('contact', { title: 'Contact Page' });
};

const getGalleryPage = (req, res) => {

    res.render('gallery', { title: 'Gallery Page' });
};

const getTrainerPage = (req, res) => {
    res.render('trainer', { title: 'Trainer Page' });
};

const getUserPanelPage = (req, res) => {
    res.render('panel', { title: 'Panel Page' });
};
const getLoginPage = (req, res) => {

    if(!req.session.user&&req.session.user==null){
      res.render('login', { title: 'Login Page' });
    } else {
        res.redirect('/panel');
    }
}

const getErrorPage = (req, res) => {
    res.render('error', { title: 'Error Page'});
}



module.exports = {
    getHomePage,
    getAboutPage,
    getContactPage,
    getGalleryPage,
    getTrainerPage,
    getUserPanelPage,
    getLoginPage,
    getErrorPage
};