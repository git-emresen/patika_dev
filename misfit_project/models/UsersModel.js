const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    /* role: { type: String, enum: ['member', 'trainer', 'admin'], default: 'member' }, */
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
 
class UserClass {
    async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
    } 
}
userSchema.loadClass(UserClass);

module.exports = mongoose.model('User', userSchema);