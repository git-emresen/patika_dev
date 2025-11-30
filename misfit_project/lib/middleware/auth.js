// middleware/auth.js

// Giriş yapmış mı kontrolü
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Role kontrolü
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    
    if (req.session.user.role !== role) {
      return res.status(403).render('error', { 
        message: 'Bu sayfaya erişim yetkiniz yok' 
      });
    }
    
    next();
  };
};

// Zaten giriş yapmışsa login sayfasına gitmesin
/* const isGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    const redirectUrl = req.session.user.role === 'trainer' 
      ? '/trainer/dashboard' 
      : '/user/dashboard';
    return res.redirect(redirectUrl);
  }
  next();
}; */

module.exports = { isAuthenticated, requireRole, /* isGuest */ };