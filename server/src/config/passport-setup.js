const passport = require('passport')
const googleStrategy = require('passport-google-oauth20')
const keys = require('./keys.js')

passport.use(
	new googleStrategy({
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret,
		callbackURL: 'google/cb'
	},
	() => {})
)