const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: {type: String, required: true, unique: true, trim: true},
    securityCode: { type: String, required: true },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('securityCode')) return next();
    const salt = await bcrypt.genSalt(10);
    this.securityCode = await bcrypt.hash(this.securityCode, salt);
    next();
});

UserSchema.methods.matchSecurityCode = async function(code) {
    return await bcrypt.compare(code, this.securityCode);
}

module.exports = mongoose.model('User', UserSchema);
