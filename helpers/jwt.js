const jwt = require('jsonwebtoken')
const redisClient = require('../helpers/init-redis')

module.exports = {
    generateAccessToken: (userId) => {
        const payload = {userId}
        const secret = process.env.ACCESS_TOKEN_SECRET
        const options = {expiresIn: '1h'}

        return jwt.sign(payload, secret, options)
    },
    generateRefreshToken: (userId) => {
        const payload = {userId}
        const secret = process.env.REFRESH_TOKEN_SECRET
        const options = {expiresIn: '1y'}

        const refreshToken = jwt.sign(payload, secret, options)
        redisClient.SET(userId, refreshToken, 'EX', 365 * 24 * 60 * 60)

        return refreshToken
    },
}