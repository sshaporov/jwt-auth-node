const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user.model')
const {generateAccessToken, generateRefreshToken} = require('../helpers/jwt')
const {createSession} = require('../helpers/user-session')
const {v4: uuid} = require('uuid')

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (googleAccessToken, googleRefreshToken, googleProfile, done) => {

                const email = googleProfile.emails[0].value
                const user = await User.findOne({email})

                if (!user) {
                    const newUser = new User({userId: uuid(), email})
                    const savedUser = await newUser.save()

                    const accessToken = generateAccessToken(savedUser.userId)
                    const refreshToken = generateRefreshToken(savedUser.userId)
                    const session = createSession(refreshToken)

                    const userWithSession = await User.findOneAndUpdate({email}, { $set: {session}}, {                           // доп. опции обновления
                        returnOriginal: false
                    })

                    return done(null, userWithSession, { accessToken, refreshToken })
                } else {
                    const accessToken = generateAccessToken(user.userId)
                    const refreshToken = generateRefreshToken(user.userId)
                    const session = createSession(refreshToken)

                    const updatedUser = await User.findOneAndUpdate({email}, { $set: {session}}, {                           // доп. опции обновления
                        returnOriginal: false
                    })

                    return done(null, updatedUser, { accessToken, refreshToken })
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}