const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if(!authHeader) res.status(401).json({message: 'Token is not provided'})

    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]

    try {
        const secret = process.env.ACCESS_SECRET_KEY
        console.log('secret', secret)
        const decodeUserData = jwt.verify(token, secret)
        req.user = decodeUserData

    } catch (err) {
        if(err instanceof jwt.JsonWebTokenError) {
            res.status(401).json({message: 'Invalid token'})
        }
    }

    next()
}