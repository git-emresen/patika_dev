const jwt = require("jsonwebtoken");
//TODO:Kullanıcı bir kez giriş yaptıktan sonra tekrar yapmasını engellemek için token'ın veritabanında olup olmadığını kontrol et

exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ status: "fail", message: "Yetkisiz erişim" });
  }

  try {
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    
    next();
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return res.status(401).json({ status: "fail", message: "Geçersiz token" });
  }
};

 exports.checkRoles = (...expectedRoles)=>{
  return (req, res, next) => { 
   
    if (!req.user || !req.user.role) {
    return res.status(401).json({ status: "fail", message: "Yetkisiz erişim" });
    }         

    /* let priviliges = req.user.role.map(x => x.key); */  
    let priviliges = [req.user.role];  

    let hasPermission = expectedRoles.some(role => priviliges.includes(role));
    if (!hasPermission) {
     return res.status(403).json({ status: "fail", message: "Yetkisiz erişim" });      
    }
    next(); 
  };
}

// Giriş yapmış mı kontrolü
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    // Session'daki kullanıcı bilgisini req.user'a da ata
    req.user = req.session.user;
    return next();
  }
  res.redirect('/login');
};

// Role kontrolü
/* const requireRole = (role) => {
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
 */
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

