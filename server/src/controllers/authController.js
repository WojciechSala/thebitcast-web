import passport from 'passport'
import localStrategy from 'passport-local'
import googleStrategy from 'passport-google-oauth20'
import facebookStrategy from 'passport-facebook'
import bcrypt from 'bcrypt-nodejs'
import Joi from 'joi'

import keys from '../config/keys.js'
import user from '../models/user.js'

import { Router } from 'express'
const api = Router()
import axios from 'axios'

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser((id, done) => {
	user.findById(id).then(user => done(null, user))
})

const schema = Joi.object().keys({
  nick: Joi.string().min(4).required(),
  email: Joi.string().lowercase().trim().required(),
  password: Joi.string().trim().min(6).required()
})

passport.use(
	new localStrategy({
		usernameField: 'nick',
		passwordField: 'password',
		passReqToCallback: true
	},
	(req, nick, password, done) => {
		const result = Joi.validate(req.body, schema)
		if (result.error === null) {
			const email = req.body.email
			user.findOne({$or: [{ nick: nick }, { email: email} ]})
				.then(currentUser => {
					if (currentUser) {
						console.log('\n\nThe name or email is already taken.\n')
	        	done(null, currentUser)
					}
					else {
						new user({

							/* Adding dump_ prefixes for
							keys in db that will be null
							to make them unique every registration */

							nick: nick,
							email: email,
							// hashing password => default salt = 10
							password: bcrypt.hashSync(password),
							googleID: 'google-dump_' + email,
	  					facebookID: 'facebook-dump_' + email
						}).save()
							.then(newUser => done(null, newUser))
							.catch(err => console.log(err))

							axios.post('/users', { data: 'kurwano'})
								.then(res => console.log(res))
								.catch(err => console.log(err))
					}
				})
				.catch(err => console.log(err))
		} else console.log('Something is wrong', result.error)
	})
)

passport.use(
	new googleStrategy({
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret,
		callbackURL: '/auth/google/cb'
	},
	(accessToken, refreshToken, profile, done) => {
		user.findOne({ googleID: profile.id })
			.then(currentUser => {
				if (currentUser) {
					// log in (jwt)
					done(null, currentUser)
				}
				else {
					new user({
						nick: "google_" + profile.displayName,
						email: profile.emails[0].value,
						password: "password-dump_" + profile.id,
						googleID: profile.id,
						facebookID: "facebook-dump_" + profile.id
					}).save()
						.then(newUser => done(null, newUser))
						.catch(err => console.error(err))

						api.get('/about-us', (req, res) => {
							res.send({ data: 'kureqqqqqqqqqqq'})
						})
				}
			})
			.catch(err => console.error(err))
	})
)

passport.use(
	new facebookStrategy({
		clientID: keys.facebook.clientID,
		clientSecret: keys.facebook.clientSecret,
		callbackURL: '/auth/facebook/cb'
	},
	(accessToken, refreshToken, profile, done) => {
		user.findOne({ facebookID: profile.id })
			.then(currentUser => {
				if (currentUser) {
					// log in (jwt)
					done(null, currentUser)
				}
				else {
					new user({
						nick: "facebook_" + profile.displayName,
						email: "email-dump_" + profile.id,
						password: "password-dump_" + profile.id,
						googleID: "google-dump_" + profile.id,
						facebookID: profile.id

					}).save()
						.then(newUser => done(null, newUser))
						.catch(err => console.error(err))
				}
			})
			.catch(err => console.error(err))
	})
)

// passport.use(
// 	new twitterStrategy({
// 		consumerKey: keys.twitter.clientID,
// 		consumerSecret: keys.twitter.clientSecret,
// 		callbackURL: '/auth/twitter/cb'
// 	},
// 	(accessToken, refreshToken, profile, done) => {
// 		user.findOne({ twitterID: profile.id })
// 			.then(currentUser => {
// 				if (currentUser) {
// 					console.log('user already exists')
// 					// log in
// 					done(null, currentUser)
// 				}
// 				else {
// 					new user({
// 						nick: profile.displayName,
// 						twitterID: profile.id
// 					}).save()
// 						.then(newUser => done(null, newUser))
// 						.catch(err => console.error(err))
// 				}
// 			})
// 			.catch(err => console.error(err))
// 	})
// )