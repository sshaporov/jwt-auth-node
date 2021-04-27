const jwt = require('jsonwebtoken')

module.exports = {
    createSession: (refreshToken) => {
        const secret = process.env.REFRESH_SECRET_KEY
        const decodedData = jwt.verify(refreshToken, secret)
        return {
            refreshToken,
            expiresAt: decodedData.exp
        }
    }
}