var request = require('request');

function Strategy(options) {
	this.client = options.client;
	this.sessionTokenField = options.sessionTokenField || 'session_token';
}

Strategy.prototype.name = 'parseSession';

Strategy.prototype.authenticate = function (req, options) {
	var sessionToken = req.body[this.sessionTokenField];
	if (!sessionToken) {
		return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
	}

	var that = this;
	var Parse = this.client;

	var options = {
		url: Parse.serverURL + '/users/me',
		headers: {
			'X-Parse-Application-Id': Parse.applicationId,
			'X-Parse-Javascript-Key': Parse.javaScriptKey,
			'X-Parse-Session-Token': sessionToken
		}
	};

	var success = function (body) {
		var data = JSON.parse(body);
		data.className = '_User';

		that.success(Parse.Object.fromJSON(data));
	};

	// Use Parse.Cloud.httpRequest if available (in Parse Cloud Code)
	if (typeof Parse.Cloud.httpRequest === 'function') {
		Parse.Cloud.httpRequest(options).then(function (res) {
			success(res.text);
		}, function (res) {
			that.fail(res.text, res.status);
		});
	} else {
		request(options, function (err, res, body) {
			if (err) return that.fail(err, 400);
			if (res.statusCode != 200) return that.fail(body, res.statusCode);

			success(body);
		});
	}
};

module.exports = Strategy;
