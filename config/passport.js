const GoogleStrategy = require('passport-google-oauth20').Strategy
const GoogleUser = require('../models/googleUser.model')

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {

                //get the user data from google
                //console.log('profile', profile)
                console.log('accessToken', accessToken)
                console.log('refreshToken', refreshToken)
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value,
                    email: profile.emails[0].value
                }

                try {
                    let user = await GoogleUser.findOne({ googleId: profile.id })

                    // verify google user
                    if (user) {
                        done(null, user)
                        console.log('юзер есть в бд')
                    } else {
                        user = await GoogleUser.create(newUser)
                        done(null, user)
                        console.log('юзера нет в бд')
                    }
                } catch (err) {
                    console.error(err)
                    console.error('My error passport')
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        GoogleUser.findById(id, (err, user) => done(err, user))
    })
}