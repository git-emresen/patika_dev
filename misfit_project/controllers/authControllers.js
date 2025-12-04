/* eslint-disable no-undef */
const is = require('is_js'); 
const env = require('dotenv').config(); 
const jwt = require('jsonwebtoken');
const UsersModel = require('../models/UsersModel');
const UserRoles = require('../models/UserRolesModel')
const Tokens = require('../models/TokenModel');
const authController=require('../lib/middleware/auth');

const signup = async (req, res) => {
    /*  if (!is.email(req.body.email)) {
         return res.status(400).json({ message: 'Invalid email format' });
     } */

    /*   if (!is.string(req.body.password) || req.body.password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      } */

    let checkUser = await UsersModel.findOne({ email: req.body.email });
    if (checkUser) {
        return res.status(400).json({ message: 'User already exists' });
    }


    const user = new UsersModel(req.body);
    try {
        const newUser = await user.save();
        /* const userRole = new UserRoles({ role_id: req.body.role_id, user_id: newUser._id }); 
        await userRole.save();*/
        req.session.user = {
            id: newUser._id,
            name: newUser.username,
            email: newUser.email,
            role: newUser.role
        };
        res.redirect('/login');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

};

const login = async (req, res) => {

    try {

        /* const { email, password } = req.body;
        let user = await UsersModel.findOne({ email: email });
    
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }
    
        const userToken = await Tokens.findOne({ user: user._id });
    
        if (!userToken || userToken.accessTokenExpiresAt > Date.now()) {
            // Kullanıcıya ait token yoksa veya süresi dolmuşsa yeni token oluştur
            const accessToken = jwt.sign({ userEmail: email, userID: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            const refreshToken = jwt.sign({ userEmail: email, userID: user._id }, process.env.REFRESH_TOKEN_SECRET);
    
            await Tokens.create({ user: user._id, accessToken: accessToken, refreshToken: refreshToken });
    
            res.cookie('accessToken', accessToken, { httpOnly: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
    
            return res.redirect('/');
    
        } else if (userToken) {
            res.cookie('accessToken', userToken.accessToken, { httpOnly: true });
            res.cookie('refreshToken', userToken.refreshToken, { httpOnly: true });
    
    
            return res.redirect('/');
        } */

        const { email, password } = req.body;

        const user = await UsersModel.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            /* return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            }); */
            return res.render('login', { error: 'Kullanıcı bulunamadı' });
        }

        // Session'a kullanıcı bilgilerini kaydet
        req.session.user = {
            id: user._id,
            name: user.username,
            email: user.email,
            role: user.role
        };

        return res.redirect('/panel');

    }
    catch (error) {
        res.send(error.message);
    }
};

const logout = async (req, res) => {
    try {
        /* const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: "fail", message: "Yetkisiz erişim" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Gelen Token:", token);

        let deleteToken = async (token) => {
            try {
                const deletedToken = await Tokens.findOneAndDelete({ refreshToken: token });
                return deletedToken ? deletedToken : null;
            } catch (error) {
                throw new Error("Token silme hatası: " + error.message);
            }
        };

        const deletedToken = await deleteToken(token);
        console.log("Deleted Token:", deletedToken);

        if (deletedToken) {
            return res.status(200).json({ status: "success", message: "Çıkış başarılı" });
        }
        else {
            return res.status(400).json({ status: "fail", message: "Çıkış başarısız" });
        }
 */
       
       authController.isAuthenticated(req, res, () => {});

        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/');
            }
            res.clearCookie('connect.sid'); // Session cookie'sini temizle
            res.redirect('/');
        });
    } catch (error) {
        res.send(error.message);
    }
};

const refresh = (req, res) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ status: "fail", message: "Yetkisiz erişim" });
    }

    const token = authHeader.split(" ")[1];


    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ status: "fail", message: "Geçersiz veya süresi dolmuş refresh token!", error: err.message });
        }

        // Yeni access token oluştur
        const accessToken = jwt.sign(
            { email: decoded.email }, // Payload (user bilgileri)
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" } // Access token süresi
        );

        await Tokens.findOneAndUpdate({ refreshToken: token }, { accessToken: accessToken });

        return res.json({ accessToken });
    });
}

const me = (req, res) => {
    // Me logic here
    res.send('Me');
};

const forgotPassword = (req, res) => {
    // Forgot password logic here
    res.send('Forgot password');
}

module.exports = {
    signup,
    login,
    logout,
    me,
    forgotPassword,
    refresh
};