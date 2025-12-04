

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

const getUserPanelPage = async (req, res) => {
    try {
        const Training = require('../models/TrainingsModel');
        const UserWorkout = require('../models/UserworkoutsModel');
        
        const trainings = await Training.find();
        const userId = req.session.user?.id;
        
        // Kullanıcının katıldığı eğitimleri bul
        let userTrainings = [];
        if (userId) {
            userTrainings = await UserWorkout.find({ userId: userId })
                .populate('workoutId')
                .exec();
        }
        
        const user = req.session.user;
        const message = req.query.message || null;
        const error = req.query.error || null;
        
        res.render('panel', { 
            title: 'Panel Page', 
            trainings, 
            userTrainings,
            user,
            message,
            error
        });
    } catch (error) {
        res.render('panel', { 
            title: 'Panel Page', 
            trainings: [], 
            userTrainings: [],
            user: req.session.user, 
            error: error.message,
            message: null
        });
    }
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