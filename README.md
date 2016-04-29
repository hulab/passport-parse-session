# passport-parse-session

A passport strategy to use Parse session tokens for authentication.

## Usage

Authenticated requests must have a `session_token` key in their body.

```js
var Parse = require('parse/node');
var ParseSessionStrategy = require('passport-parse-session');

// Set Parse keys
Parse.initialize('app id', 'javascript key');

// Create a new strategy
passport.use(new ParseSessionStrategy({ client: Parse }));

// Use the strategy to authenticate requests
app.use(passport.authenticate('parseSession'));
```

## License

MIT
