const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({

    // add firstName and lastName

    userId: {
        type: String,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        require: false,
    },
    lastName: {
        type: String,
        require: false,
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