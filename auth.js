
if(process.env.NODE_ENV === 'production') {
	console.log("Running In Production");
	module.exports = {
		'twitterAuth' : {
			'consumerKey': 'XyvBxHeu6CQp0WXyo8zMngtQn',
			'consumerSecret': 'Pq92CeMt3Cnx6SWrgOWG7Pk580eaHhZoDMCmdFOdPZwbqvfsF8',
			'callbackURL': 'https://www.collated.net/api/users/auth/twitter/callback'
		},
		'facebookAuth' : {
			'clientID': '1721418721405997',
    	'clientSecret': 'e781661208f5ea1ed2cc34dd082827b8',
    	'callbackURL': 'https://www.collated.net/api/users/auth/facebook/callback'
		},
		'mailchimpAuth' : {
			'apiKey' : '9502f9e6d077808921e096c91ed9ce09-us13',
			'client_id' : '696691612387',
			'client_secret' : 'b57fb391e967d48de02e03c19965a0fa'
		}
	};
} else {
	module.exports = {
		'twitterAuth' : {
			'consumerKey': 'LQeZCC9ekkkwJpJiXoIzJ0pbC',
			'consumerSecret': 'm9bITFxUC0g6ZtSZSW1GpV5I5I6hAMctKt7IUWD7WbJqKV7sja',
			'callbackURL': 'http://www.collated-dev.net/api/users/auth/twitter/callback'
		},
		'stripeAuth' : {
			'testSecretKey': 'sk_test_izGkB2GmYEIiHPxDbP6pU0Cp',
			'testPublishableKey': 'pk_test_DDjpbO1sCt8tREcXLZ8y9z3O'
		},
		'facebookAuth' : {
			'clientID': '701467179956411',
    	'clientSecret': 'ea827fe75118ba12e6789577f32c9576',
    	'callbackURL': 'http://www.collated-dev.net/api/users/auth/facebook/callback'
		},
		'mailchimpAuth' : {
			'apiKey' : '9502f9e6d077808921e096c91ed9ce09-us13',
			'client_id' : '696691612387',
			'client_secret' : 'b57fb391e967d48de02e03c19965a0fa'
		},
		'slackAuth' : {
			'clientID' : '40400187350.47791633188',
			'clientSecret' : '2d4ceb7bcb9d3ee39931ec155623318e',
			'callbackURL' : 'http://collated-dev.net/api/users/auth/slack/callback'
		},
		'session' : {
			'secret' : 'keyboad_cat_ygd7ge9wgreury'
		}
	};
}
