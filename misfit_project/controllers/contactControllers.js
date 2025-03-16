const is=require('is_js');
const messagesModel=require('../models/MessagesModel');
const mongoose = require('mongoose');

exports.getMessages = async (req, res) => {
    try {
        const messages = await messagesModel.find();
        res.status(200).json({
            status: 'success',
            data: messages
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.createMessage = async (req, res) => {
    try {
        const { user_name, email, message } = req.body;
        if (!user_name || !email || is.not.email(email) || !message) {
            return res.status(400).json({
                status: 'fail',
                message: 'Lütfen tüm alanları eksiksiz doldurunuz'
            });
        }   

        const newMessage = await messagesModel.create(req.body);
        res.status(201).json({
            status: 'success',
            data: newMessage
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ status: "fail", message: "Geçersiz mesaj ID" });          
         }

        let deletedMessage=await messagesModel.findByIdAndDelete(req.params.id);
        if(deletedMessage){
        res.status(200).json({
            status: 'success',
            data: deletedMessage
        });
       }else{
        res.status(404).json({
            status: 'fail',
            message: 'Mesaj bulunamadı'
        });
       }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.getMessage = async (req, res) => {
    try {
       if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ status: "fail", message: "Geçersiz mesaj ID" });          
         }

        const message = await messagesModel.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: message
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });        
    }   
};



