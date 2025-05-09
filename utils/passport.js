const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

// Serialize user into the sessions
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the sessions
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.NODE_ENV === 'production'
                ? 'https://v-nature.vercel.app/api/v1/users/auth/google/callback'
                : '/api/v1/users/auth/google/callback',
            scope: ['profile', 'email'],
            state: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists in our DB
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // If user exists but was not created with Google OAuth
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save({ validateBeforeSave: false });
                    }
                    return done(null, user);
                }

                // If user doesn't exist, create a new one
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    password: `google-oauth-${profile.id}${Date.now()}`,
                    passwordConfirm: `google-oauth-${profile.id}${Date.now()}`,
                    photo: profile.photos[0].value || 'default.jpg'
                });

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

module.exports = passport;
