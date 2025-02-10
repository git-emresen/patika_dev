const { default: mongoose } = require('mongoose');

const trainingsModel=require('../models/TrainingsModel');


exports.createTraining=async(req,res)=>{
    try{
   let { trainerId, title, description, difficulty, duration, exercises } = req.body;

   
     if (!mongoose.Types.ObjectId.isValid(trainerId)) {
      return res.status(400).json({ status: "fail", message: "Geçersiz trainer_id" });
    } 

   trainerId =mongoose.Types.ObjectId.createFromHexString(trainerId);
   console.log(trainerId); 
    
    const newTraining = new trainingsModel({
      trainerId,
      title,
      description,
      difficulty,
      duration,
      exercises
    });

    await newTraining.save(); 
    res.status(201).json({ status: "success", data: newTraining });
   

     /*    const training=await trainingsModel.create(req.body);
        res.status(201).json({
            status:'success',
            data:{
                training
            }
        });   */
    } catch (error) {
        let errorMessage = "Bir hata oluştu.";
        if (error.name === 'ValidationError') {
            errorMessage = "Doğrulama hatası: " + error.message;
        } else if (error.name === 'MongoError' && error.code === 11000) {
            errorMessage = "Veritabanı hatası: Tekrarlanan anahtar hatası.";
        } else {
            errorMessage = error.message;
        }
        res.status(500).json({
            status: "error",
            message: errorMessage
        });
    }
};

exports.getAllTrainings=async(req,res)=>{
    try{
        const trainings=await trainingsModel.find();
        res.status(200).json({
            status:'success',
            results:trainings.length,
            data:{
                trainings
            }
        });
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        });
    }
};

exports.getTraining=async(req,res)=>{
    try{
        const training=await trainingsModel.findById(req.params.id);
        res.status(200).json({
            status:'success',
            data:{
                training
            }
        });
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        });
    }
};

exports.updateTraining=async(req,res)=>{
    try{
        const training=await trainingsModel.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });     
        res.status(200).json({
            status:'success',
            data:{
                training
            }
        });
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        });
    }   
}

exports.deleteTraining=async(req,res)=>{
    try{
        await trainingsModel.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status:'success',
            data:null
        });
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        });
    }
};



