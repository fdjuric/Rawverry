const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const dbService = require('./database');

function initialize(passport, getUserByUsername) {

    const authenticateUser = async (username, password, done) => {

        const db = dbService.getDbServiceInstance();
        const user = await db.getUser(username);
        if(user == null){
            return done(null, false, {message: 'Username or Password incorrect!'})
        }

        try {

            if(await bcrypt.compare(password, user.user_password)) {
                return done(null, user)
            }else {
                return done(null, false, {message: 'Username or Password incorrect!'})
            }
        }catch(e){
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'username'}, authenticateUser))
    passport.serializeUser((user, done) => done(null,user.id))
    passport.deserializeUser((id, done) => { 
        return done(null,getUserByUsername(id.user_name))
    })

}

module.exports = initialize;