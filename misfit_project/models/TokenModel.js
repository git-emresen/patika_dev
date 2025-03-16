const mongoose = require('mongoose');


function parseDuration(duration) {
  
    if (typeof duration !== 'string' || duration.length < 2) return 0;
  
    // Sayısal kısmı al: son karakter hariç kalan kısmı
    const value = parseFloat(duration.slice(0, -1));
    if (isNaN(value)) return 0;
  
    // Birim kısmı: son karakteri al ve küçük harfe çevir
    const unit = duration.slice(-1).toLowerCase();
  
    switch (unit) {
      case 's': // saniye
        return value * 1000;
      case 'm': // dakika
        return value * 60 * 1000;
      case 'h': // saat
        return value * 60 * 60 * 1000;
      case 'd': // gün
        return value * 24 * 60 * 60 * 1000;
      default:
        // Desteklenmeyen birim için 0 döner
        return 0;
    }
  }

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String       
    },
    accessTokenExpiresAt: {
        type: Date,
        default:function() {
            return new Date(Date.now() + parseDuration(process.env.JWT_EXPIRES_IN));
          },
    },
    
}, {
    versionKey: false ,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }  
});

/* tokenSchema.index({ accessTokenExpiresAt: 1 }, { expireAfterSeconds: 0 }); */

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;


