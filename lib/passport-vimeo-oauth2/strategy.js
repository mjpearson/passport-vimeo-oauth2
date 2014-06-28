/**
 * Module dependencies.
 */
var util = require('util')
, OAuth2Strategy = require('passport-oauth').OAuth2Strategy;


/**
 * `Strategy` constructor.
 *
 * The Vimeo authentication strategy authenticates requests by delegating
 * to Vimeo using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Vimeo application's client id
 *   - `clientSecret`  your Vimeo application's client secret
 *   - `callbackURL`   URL to which Vimeo will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new VimeoStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/vimeo/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://api.vimeo.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://api.vimeo.com/oauth/access_token';
  options.scopeSeparator = options.scopeSeparator || ' ';
  options.customHeaders = options.customHeaders || {};
  
  this.profileUrl = options.profileUrl || 'https://api.vimeo.com/me',
  
  options.sessionKey = options.sessionKey || 'oauth:vimeo';
  
  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-vimeo-oauth2';
  
}
  options.customHeaders['Accept'] = "application/vnd.vimeo.*+json;version=3.0";
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'vimeo';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Vimeo.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `vimeo`
 *   - `id`               the user's ID
 *   - `displayName`      the user's username
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(
    this.profileUrl,
    accessToken,
    function (err, body, res) {
      if (err) {
        return done(err);
      } else {
        try {
          var json = JSON.parse(body);

          var profile = {
            provider: 'Vimeo'
          };

          profile.id = json.uri.split('/').pop()
          profile.username = json.name;
          profile.displayName = json.name;

          profile._raw = body;
          profile._json = json;

          done(null, profile);
          
        } catch(e) {
          done(e);
        }
      }
    }
  );
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
