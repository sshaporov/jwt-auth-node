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
                    //find the user in our database
                    let user = await GoogleUser.findOne({ googleId: profile.id })

                    if (user) {
                        //If user present in our database.
                        done(null, user)
                        console.log('юзер есть в бд')
                    } else {
                        // if user is not preset in our database save user data to database.
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

    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
        GoogleUser.findById(id, (err, user) => done(err, user))
    })
}