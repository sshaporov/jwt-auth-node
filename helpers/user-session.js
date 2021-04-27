const jwt = require('jsonwebtoken')

module.exports = {
    createSession: (refreshToken) => {
        const secret = process.env.REFRESH_SECRET_KEY
        const decodedData = jwt.verify(refreshToken, secret)
        const date = new Date(decodedData.exp * 1000)
        return {
            refreshToken,
            expiresAt: date
        }
    }
}