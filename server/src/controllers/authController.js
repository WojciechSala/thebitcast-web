import passport from 'passport'
import googleStrategy from 'passport-google-oauth20'
import facebookStrategy from 'passport-facebook'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import request from 'request'

import keys from '../config/keys.js'
import User from '../models/user.js'
import axios from 'axios'

export default {
	async login(req, res, next) {
		const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET)

		return token
	},

	async register(req, res, next) {

		const schemaRegister = Joi.object().keys({
		  nick: Joi.string().min(4).required(),
		  email: Joi.string().lowercase().trim().required(),
		  password: Joi.string().trim().min(6).required(),
			captchaToken: Joi.string().trim().required()
		})

		const resultRegister = Joi.validate(User, schemaRegister)

		// if (resultRegister.error === null) {
		  const { nick, email, password, captchaToken } = req.body;

			//Sprawdzenie captchy
			console.log("CAPTCHA - TOKEN: " + captchaToken);
			console.log("CAPTCHA - KLUCZ PRYWATNY: " + keys.captcha.secret);

			const ip = req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress) || '';

			//Zapytanie do googla
			var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?"
				+ "secret=" + keys.captcha.secret
			  + "&response=" + captchaToken;
				//+ "&remoteip=" + ip;

				console.log(verificationUrl);

			//Wyslanie zapytania do googla
			request(verificationUrl,function(error,response,body) {
	    body = JSON.parse(body);
	    if(body.success !== undefined && !body.success) {
	      console.log(body)
	    }else console.log("CAPTCHA WESZŁA");
		});


		  const user = new User({ nick, email })
		  await User.register(user, password)
		  return res.send('User created successfully. Now you can log in.')
		// } else { console.log(resultRegister.error) }
	},
}

passport.use(
	new googleStrategy({
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret,
		callbackURL: '/auth/google/cb'
	},
	(accessToken, refreshToken, profile, done) => {
		User.findOne({ googleID: profile.id })
			.then(currentUser => {
				if (currentUser) {
					// log in (jwt)
					console.log('logged in using google')
					done(null, currentUser)
				}
				else {
					new User({
						nick: "nick-dump_" + profile.id,
						email: profile.emails[0].value,
						googleID: profile.id,
					}).save()
						.then(newUser => done(null, newUser))
						.catch(err => console.error(err))
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
		User.findOne({ facebookID: profile.id })
			.then(currentUser => {
				if (currentUser) {
					// log in (jwt)
					console.log('logged in using fb')
					done(null, currentUser)
				}
				else {
					new User({
						nick: "nick-dump_" + profile.id,
						email: "email-dump_" + profile.id,
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
