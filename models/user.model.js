const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: false,
    },
    session: {
        refreshToken: String,
        expiresAt: Date,
    },
})

module.exports = mongoose.model('User', UserSchema)