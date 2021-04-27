const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    session: {
        refreshToken: String,
        expiresAt: Number,
    }
})

module.exports = mongoose.model('User', UserSchema)