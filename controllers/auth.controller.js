module.exports = {
    register: async (req, res, next) => {
        try {
            res.send('register route OK')
        } catch (err) {
            console.log(err)
        }
    },

    login: async (req, res, next) => {
        try {
            res.send('login route OK')
        } catch (err) {
            console.log(err)
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            res.send('refresh token route OK')
        } catch (err) {
            console.log(err)
        }
    },

    logout: async (req, res, next) => {
        try {
            res.send('logout route OK')
        } catch (err) {
            console.log(err)
        }
    }
}