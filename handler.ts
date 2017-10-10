

export const postSlackItemHandler = function(req, res) {
	//console.log('post slack item called');
	let messagesArr = Array.isArray(req.body) ? req.body : [req.body];
	let slackTeamId = messagesArr[0].team_id;

	UserGroup.findOne({slackTeamId: slackTeamId})
	.then(userGroup => {
		let options = {
			userGroup: userGroup.id,
			categoryPerChannel: userGroup.categoryPerSlackChannel
		};
		let promiseArr = messagesArr.reduce((arr, message) => {
			return helpers.containsUrl(message.text) ? arr.concat(saveSlackItem(message, options)) : arr;
		}, []);

		return Promise.all(promiseArr);
	}).then(() => {
		res.status(201).send({});
	}, (err) => {
		console.log(err);
		return res.status(500).end();
	});
}

function saveSlackItem(message, options) {
	let slackTimestamp = message.timestamp || message.ts;
	let newTimestamp = slackTimestamp.split('.')[0] * 1000;
	let newSlackItem = {
		author: message.user_name,
		body: message.text,
		createdDate: newTimestamp,
		slackChannelId: message.channel_id,
		slackTeamId: message.team_id,
		slackUserId: message.user_id,
		type: 'slack',
		userGroup: options.userGroup
	};
	Object.assign(options, {slackChannelId: message.channel_id});

	return Item.getCategoryAndTags(message.text, options)
	.then(idsObj => {
		Object.assign(newSlackItem, idsObj);
		//console.log('new slack item to save', newSlackItem);
    return Item.create(newSlackItem);
  }).then(item => {
		return getPreviewAndUpdate(item);
	});
}
