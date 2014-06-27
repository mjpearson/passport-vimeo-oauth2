# passport-vimeo-oauth2

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Vimeo](https://vimeo.com) using the OAuth 2.0 API.

## Install

    $ npm install passport-vimeo-oauth2

## Usage

#### Configure Strategy

The Vimeo authentication strategy authenticates users using a Vimeo
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new VimeoStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ VimeoID: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authorize()`, specifying the `'vimeo'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/vimeo',
      passport.authorize('vimeo'));

    app.get('/auth/vimeo/callback', 
      passport.authorize('vimeo', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Thanks

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 [Michael Pearson](http://github.com/mjpearson)
