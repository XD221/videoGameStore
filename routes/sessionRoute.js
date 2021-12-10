const express = require('express');
const passport = require("../passport");
const router = express.Router();

//route
router.get('/', (req, res) => {
    res.render('session', { title: 'Login' });
});

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.render('session', { message: "Usuario o password invalidos" }); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    })(req, res, next);
  });

module.exports = router;