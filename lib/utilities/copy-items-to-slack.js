'use strict';

var db = require('../../database/database');
var mongoose = require('');

var Item = db.model('Item');
var itemSchema = require('../schemas/item');

mongoose.connect('mongodb://collated-admin:<password>@ds013291-a0.mlab.com:13291,ds013291-a1.mlab.com:13291/collated?replicaSet=rs-ds013291');

mongoose.connection.model('Item', itemSchema);
// copy Ember items to Ember London Slack team
return Item.find({user: 'stevetyler_uk', tags: {$in: '5718a22b5dff4d1d3c81ae56'}}).then(items => {
  //console.log('items found');
  let itemPromiseArr = items.map(item => {
    let newSlackItem = {
      user: 'stevetyler',
      createdDate: item.createdDate,
      body: item.body,
      author: item.author,
  		isPrivate: false,
  		type: item.type,
      slackTeamId: 'T03SSL0FF' // Ember-London team id
    };
    console.log('save new item', newSlackItem);
    Item.create(newSlackItem);
  });
  return Promise.all(itemPromiseArr);
}).catch(err => {
  console.log(err);
});
