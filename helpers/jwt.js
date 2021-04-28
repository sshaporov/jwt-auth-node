const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const {createSession} = require('../helpers/user-session')

module.exports = {
    generateAccessToken: (userId) => {
        const payload = {userId}
        const secret = process.env.ACCESS_SECRET_KEY
        const options = {expiresIn: '1h'}

        return jwt.sign(payload, secret, options)
    },
    generateRefreshToken: (userId) => {
        const payload = { userId }
        const secret = process.env.REFRESH_SECRET_KEY
        const options = {expiresIn: '1y'}

        return jwt.sign(payload, secret, options)

    },
    verifyRefreshToken: async (refreshToken) => {
        const secret = process.env.REFRESH_SECRET_KEY
        const decodedData = jwt.verify(refreshToken, secret)

        const userId = decodedData.userId

        const user = await User.findOne({_id: userId})

        if(refreshToken === user.session.refreshToken) {
            return userId
        }
    }
}