const jwt = require('jsonwebtoken')

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

        const refreshToken = jwt.sign(payload, secret, options)
        // redisClient.SET(userId, refreshToken, 'EX', 365 * 24 * 60 * 60)

        return refreshToken
    },
    verifyRefreshToken: async (refreshToken) => {
        const secret = process.env.REFRESH_SECRET_KEY
        const decodedData = jwt.verify(refreshToken, secret)
        console.log('decodedData', decodedData)
        const userId = decodedData.userId

    }
}