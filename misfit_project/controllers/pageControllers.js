

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
            title: 'Member Panel', 
            trainings, 
            userTrainings,
            user,
            message,
            error,
            panelType: 'member'
        });
    } catch (error) {
        res.render('panel', { 
            title: 'Panel Page', 
            trainings: [], 
            userTrainings: [],
            user: req.session.user, 
            error: error.message,
            message: null,
            panelType: 'member'
        });
    }
};

const getTrainerPanelPage = async (req, res) => {
    try {
        const Training = require('../models/TrainingsModel');
        const UserWorkout = require('../models/UserworkoutsModel');
        
        const userId = req.session.user?.id;
        
        // Trainer'ın oluşturduğu eğitimleri bul
        const trainerTrainings = await Training.find({ trainerId: userId });
        
        // Her eğitim için katılan kullanıcı sayısını bul
        const trainingsWithEnrollment = await Promise.all(
            trainerTrainings.map(async (training) => {
                const enrolledCount = await UserWorkout.countDocuments({ workoutId: training._id });
                return {
                    ...training.toObject(),
                    enrolledCount
                };
            })
        );
        
        const user = req.session.user;
        const message = req.query.message || null;
        const error = req.query.error || null;
        
        res.render('trainer-panel', { 
            title: 'Trainer Panel', 
            trainerTrainings: trainingsWithEnrollment,
            user,
            message,
            error,
            panelType: 'trainer'
        });
    } catch (error) {
        res.render('trainer-panel', { 
            title: 'Trainer Panel', 
            trainerTrainings: [],
            user: req.session.user, 
            error: error.message,
            message: null,
            panelType: 'trainer'
        });
    }
};

const getAdminPanelPage = async (req, res) => {
    try {
        const Training = require('../models/TrainingsModel');
        const UserWorkout = require('../models/UserworkoutsModel');
        const User = require('../models/UsersModel');
        
        // Admin istatistikleri
        const totalUsers = await User.countDocuments();
        const totalTrainings = await Training.countDocuments();
        const totalEnrollments = await UserWorkout.countDocuments();
        
        const message = req.query.message || null;
        const error = req.query.error || null;
        const user = req.session.user;
        
        res.render('admin', { 
            title: 'Admin Panel', 
            user,
            message,
            error,
            panelType: 'admin',
            stats: {
                totalUsers,
                totalTrainings,
                totalEnrollments
            }
        });
    } catch (error) {
        res.render('admin', { 
            title: 'Admin Panel', 
            user: req.session.user, 
            error: error.message,
            message: null,
            panelType: 'admin',
            stats: {
                totalUsers: 0,
                totalTrainings: 0,
                totalEnrollments: 0
            }
        });
    }
};
const getTrainerPage = (req, res) => {
    res.render('trainer', { title: 'Trainer Page' });
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
    getTrainerPanelPage,
    getAdminPanelPage,
    getLoginPage,
    getErrorPage
};