'use strict';
const db = require('../../../database/database');
const ensureAuthenticated = require('../../../middlewares/ensure-authenticated').ensureAuthenticated;

const Item = db.model('Item');
const Tag = db.model('Tag');
const UserGroup = db.model('UserGroup');

module.exports.autoroute = {
	get: {'/tags' : getTags},
	post: {'/tags': [ensureAuthenticated, postTag]},
	put: {'/tags/:id': [ensureAuthenticated, putTag]},
	delete: {'/tags/:id': [ensureAuthenticated, deleteTag]}
};

function getTags(req, res){
	if (req.query.operation === 'userTags') { getUserTags(req, res); }
	if (req.query.operation === 'slackTeamTags') { getSlackTeamTags(req, res); }
}

function getUserTags(req, res) {
	const id = req.query.userId;

	if (!id) {
		return res.status(404).end();
	}
	Tag.find({user: id}).then((tags) => {
		if (tags) {
			return makeEmberTags(id, tags, 'user');
		}
	}).then((obj) => {
	  if (!req.user) {
			return obj.public;
	  } else if (req.user.id === req.query.userId) {
			return obj.all;
	  } else {
	    return obj.public;
	  }
	}).then((tags) => {
		res.send({ tags: tags });
	}, () => {
		return res.status(404).end();
	});
}

function makeEmberTags(id, tags, type) {
	let tagPromises;

	if (type === 'user') {
		tagPromises = tags.map(tag => Item.count({ user: id, tags: { $in: [ tag._id ] }}));
	}	else if (type === 'slack') {
		tagPromises = tags.map(tag => Item.count({ userGroup: id, tags: {$in: [tag._id] }}));
	}
	if (tagPromises) {
		return Promise.all(tagPromises).then(counts => {
			return tags.reduce((obj, tag, i) => {
				const emberTag = tag.makeEmberTag(counts[i]);
				return tag.isPrivate === 'true' ?
					{
						all: obj.all.concat(emberTag),
						public: obj.public } :
					{
						all: obj.all.concat(emberTag),
						public: obj.public.concat(emberTag),
					};
			}, { all: [], public: [] });
		});
	}	else {
		return { all: [], public: [] };
	}
}

function getSlackTeamTags(req, res) {
	const groupId = req.query.groupId;
	//console.log('slack tags', groupId);

	if (!groupId) {
		return res.status(404).end();
	}
	Tag.find({userGroup: groupId}).exec().then((tags) => {
		if (tags) {
			return makeEmberTags(groupId, tags, 'slack');
		}
	}).then((obj) => {
		res.send({ tags: obj.all });
	}, () => {
		return res.status(404).end();
	});
}

function postTag(req, res){
	if (req.body.tag.userGroup) {
		postGroupTagHandler(req, res);
		return;
	}
	if (req.user.id === req.body.tag.user) {
		postUserTagHandler(req, res);
		return;
	}
	else {
		res.status(401).end();
		return;
	}
}

function postGroupTagHandler(req, res) {
	const tag = req.body.tag;

	// need to check adminPermissions with user id
	UserGroup.findOne({id: tag.userGroup}).then(group => {
		if (typeof group === 'object') {
			// console.log('group found', group);
			return saveTag(req.body.tag);
		}
		res.status(401).end();
		return;
	}).then(tag => {
		let emberTag = tag.makeEmberTag();

		res.send({'tag': emberTag});
		return;
	}).catch(err => {
		console.log(err);
		res.status(401).end();
		return;
	});
}

function postUserTagHandler(req, res) {
	saveTag(req.body.tag).then(tag => {
		let emberTag = tag.makeEmberTag();

		res.send({'tag': emberTag});
		return;
	}).catch(err => {
		console.log(err);
		res.status(401).end();
		return;
	});
}

function saveTag(tag) {
	return Tag.create({
		category: tag.category,
		colour: tag.colour,
		isPrivate: tag.isPrivate,
		name: tag.name,
		slackChannelId: tag.slackChannelId,
		slackTeamId: tag.slackTeamId,
		user: tag.user,
		userGroup: tag.userGroup,
	});
}

function putTag(req, res) {
  const tagId = req.params.id;
	const tagName = req.body.tag.name;

	//console.log('putTag', tagId, tagName);
  Tag.update({_id: tagId}, // removed user: req.user.id temporarily
    {$set: {
      name: tagName,
      colour: req.body.tag.colour,
      isPrivate: req.body.tag.isPrivate
      }
    }
  ).then(() => {
    return res.send({});
  }).then(null, (err) => {
    console.log(err);
    return res.status(400).end();
  });
}

function deleteTag(req, res){
  Tag.remove({ _id: req.params.id }).exec().then(() => {
    return res.send({});
  }).then(null, (err) => {
		console.log(err);
		return res.status(500).end();
	});
}
