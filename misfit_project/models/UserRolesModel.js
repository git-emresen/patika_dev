const mongoose = require("mongoose");
const Users=require("./UsersModel");
const Roles=require("./RolesModel");

const schema = mongoose.Schema({
    role_id: { type: mongoose.Schema.Types.ObjectId,requird:true,ref:Roles },
    user_id: { type: mongoose.Schema.Types.ObjectId,required:true,ref:Users },
    created_by: { type: mongoose.Schema.Types.ObjectId },
    updated_by: { type: mongoose.Schema.Types.ObjectId }
}, {
    versionKey: false,
    timestamps: true
});

schema.index({ role_id: 1, user_id: 1 }, { unique: true });

class UserRoles extends mongoose.Model {

}

schema.loadClass(UserRoles);
module.exports = mongoose.model("user_roles", schema, "user_roles");