import { Router } from 'express';
import passport from 'passport';
import auth from '../actions/auth.js';
import notifs from '../config/notifications';

export default () => {
  const api = Router();

  //localhost:8081/auth/login
  api.post('/login', (req, res, next) => {
    passport.authenticate(
      'local',
      (err, user, info) => {
        if (!user) {
          return res.json(err);
        } else {
          req.logIn(user, errr => {
            return res.json(notifs.logIn);
          });
        }
      },
      { session: true }
    )(req, res, next);
  }); //passport.authenticate('local', { session: true }), (req, res) => res.sendStatus(200))

  //localhost:8081/auth/create
  api.post('/create', auth.register);

  // Auth using google oauth2.0
  //localhost:8081/auth/google
  api.get(
    '/google',
    passport.authenticate('google', {
      // get more info from google user's account
      prompt: 'select_account',
      scope: ['profile', 'email']
    })
  );

  //Google callback
  //localhost:8081/auth/google/cb
  api.get(
    '/google/cb',
    passport.authenticate('google', { session: true }),
    (req, res) => {
      console.log("Callback")
      res.redirect('http://localhost:8080');
    }
  );

  // Auth using facebook oauth
  //localhost:8081/auth/facebook
  api.get('/facebook', passport.authenticate('facebook'));

  //Facebook callback
  //localhost:8081/auth/facebook/cb
  api.get(
    '/facebook/cb',
    passport.authenticate('facebook', { session: true }),
    (req, res) => {
      res.redirect('http://localhost:8080');
    }
  );

  //Send actual user id if logged
  //localhost:8081/auth/getId
  api.get('/getUser', (req, res) => {
    if (req.isAuthenticated())
      res.json({
        message: 'User logged in',
        type: 'positive',
        status: 200,
        user: req.user
      });
    else
      res.json({
        message: 'User not logged in',
        type: 'negative',
        status: 500,
        user: undefined
      });
  });

  //Logout user
  //localhost:8081/auth/logout
  api.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    
  });

  return api;
};
