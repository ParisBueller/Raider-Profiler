const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BnetStrategy = require('passport-bnet').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(mongoose.Types.ObjectId(id))
        .then(user => {
            done(null, user);
        })
});

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    async (accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({ googleId: profile.id })

        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({ googleId: profile.id }).save()
        done(null, user);
        }
    )
);

passport.use(
    new BnetStrategy({
        clientID: keys.blizzardClientID,
        clientSecret: keys.blizzardClientSecret,
        callbackURL: '/auth/bnet/callback',
        region: 'us'
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile.id);
            console.log(accessToken);
            try {
                const blizzardAccountAuthenticated = await User.findOne({blizzardId: profile.id});

                if (blizzardAccountAuthenticated) {
                    return done(null, blizzardAccountAuthenticated);
                }
                const newBlizzardAccountAuth = await User.findOneAndUpdate({blizzardId: profile.id})
                done(null, newBlizzardAccountAuth);  
            } catch (error) {
                console.log(error);
                return null;
            }
          
        }
    )
);