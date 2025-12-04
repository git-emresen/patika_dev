const { default: mongoose } = require('mongoose');

const trainingsModel=require('../models/TrainingsModel');
const UserWorkout = require('../models/UserworkoutsModel');


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

exports.joinTraining = async (req, res) => {
    try {
        const { trainingId } = req.body;
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).redirect('/login');
        }

        if (!mongoose.Types.ObjectId.isValid(trainingId)) {
            return res.status(400).json({ status: "fail", message: "Geçersiz eğitim ID" });
        }

        // Eğitim var mı kontrol et
        const training = await trainingsModel.findById(trainingId);
        if (!training) {
            return res.status(404).json({ status: "fail", message: "Eğitim bulunamadı" });
        }

        // Kullanıcı zaten katıldı mı kontrol et
        const existingJoin = await UserWorkout.findOne({ 
            userId: userId, 
            workoutId: trainingId 
        });

        if (existingJoin) {
            return res.status(400).redirect('/panel?message=Zaten bu eğitime katıldınız');
        }

        // Eğitime katıl
        const userWorkout = new UserWorkout({
            userId: userId,
            workoutId: trainingId
        });

        await userWorkout.save();
        
        res.status(201).redirect('/panel?message=Eğitime başarıyla katıldınız');

    } catch (error) {
        console.error('Error joining training:', error);
        res.status(500).redirect('/panel?error=Bir hata oluştu');
    }
};

exports.leaveTraining = async (req, res) => {
    try {
        const { trainingId } = req.body;
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).redirect('/login');
        }

        if (!mongoose.Types.ObjectId.isValid(trainingId)) {
            return res.status(400).json({ status: "fail", message: "Geçersiz eğitim ID" });
        }

        // Eğitim kaydını bul ve sil
        const userWorkout = await UserWorkout.findOneAndDelete({ 
            userId: userId, 
            workoutId: trainingId 
        });

        if (!userWorkout) {
            return res.status(404).redirect('/panel?error=Bu eğitime katılı değilsiniz');
        }

        res.redirect('/panel?message=Eğitimden başarıyla ayrıldınız');

    } catch (error) {
        console.error('Error leaving training:', error);
        res.status(500).redirect('/panel?error=Bir hata oluştu');
    }
};

exports.getUserTrainings = async (req, res) => {
    try {
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({ status: "fail", message: "Yetkisiz erişim" });
        }

        // Kullanıcının katıldığı eğitimleri bul
        const userTrainings = await UserWorkout.find({ userId: userId })
            .populate('workoutId')
            .exec();

        return res.json({
            status: 'success',
            data: userTrainings
        });

    } catch (error) {
        console.error('Error fetching user trainings:', error);
        res.status(500).json({ status: "fail", message: error.message });
    }
};



