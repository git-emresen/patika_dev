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
  return (req, res, next) => { //TODO:Aşağıyı req.user idsi ile değiştir
    if (!req.user || !req.user.roles) {
    return res.status(401).json({ status: "fail", message: "Yetkisiz erişim" });
    }         

    let priviliges = req.user.roles.map(x => x.key);

    let hasPermission = expectedRoles.some(role => priviliges.includes(role));
    if (!hasPermission) {
     return res.status(403).json({ status: "fail", message: "Yetkisiz erişim" });      
    }
    next(); 
  };
}


