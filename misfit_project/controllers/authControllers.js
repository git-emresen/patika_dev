/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const adminControllers = require('../controllers/adminControllers');
const UsersModel = require('../models/UsersModel');
const Tokens = require('../models/TokenModel');

const register = (req, res) => {
    adminControllers.createUser(req, res);
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await UsersModel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        let userPass = await user.comparePassword(password);

        if (!userPass) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const userToken = await Tokens.findOne({ user: user._id });
        if (!userToken || userToken.expiresIn < Date.now()) {
            const accessToken = jwt.sign({ userEmail: email, userID: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            const refreshToken = jwt.sign({ userEmail: email, userID: user._id }, process.env.REFRESH_TOKEN_SECRET);

            await Tokens.create({ user: user._id, accessToken: accessToken, refreshToken: refreshToken });
            res.status(200).json({ status: "success", message: "giriş başarılı", accessToken: accessToken, refreshToken: refreshToken });
        } else if (userToken) {
            res.status(200).json({ status: "success", message: "daha önce giriş yapmışsınız", accessToken: userToken.accessToken, refreshToken: userToken.refreshToken });
        }

    }
    catch (error) {
        res.send(error.message);
    }
};

const logout =async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: "fail", message: "Yetkisiz erişim" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Gelen Token:", token);

        let deleteToken=async (token) => {
            try {
                const deletedToken = await Tokens.findOneAndDelete({ refreshToken: token });
                return deletedToken ? deletedToken : null;
            } catch (error) {
                throw new Error("Token silme hatası: " + error.message);
            }
        };

        const deletedToken=await deleteToken(token);
        console.log("Deleted Token:", deletedToken);

        if(deletedToken){
            return res.status(200).json({ status: "success", message: "Çıkış başarılı" });
        }
        else{
            return res.status(400).json({ status: "fail", message: "Çıkış başarısız" });
        }

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
    register,
    login,
    logout,
    me,
    forgotPassword,
    refresh
};