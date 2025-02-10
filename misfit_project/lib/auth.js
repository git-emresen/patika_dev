const jwt = require("jsonwebtoken");
//TODO:Kullanıcı bir kez giriş yaptıktan sonra tekrar yapmasını engellemek için token'ın veritabanında olup olmadığını kontrol et
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ status: "fail", message: "Yetkisiz erişim" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ status: "fail", message: "Geçersiz token" });
  }
};

module.exports = authMiddleware;
