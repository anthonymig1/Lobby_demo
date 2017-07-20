import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
const testCollection22 = new Mongo.Collection('testCollection22');
var Api = require('./Apilol.js');
var key='RGAPI-3ce18bec-345c-4893-b6de-35b6246c2cfd';
var LolApi = require('leagueapi');
var Lol= new Api(key);

Meteor.methods({
 'userupdate.LolApi'(NameUser){
    let userId= Meteor.userId();
    if(Meteor.isServer){
    let user=Meteor.users.findOne({_id: userId});
      const wrappedGetUser = Meteor.wrapAsync(Lol.getUser);

    const infouser=wrappedGetUser(NameUser);
    console.log(infouser);

    Meteor.users.update({_id:userId},{$set:{"gamerProfile.lolprofile": infouser}});
    console.log(user);
    //Meteor.users.update({_id:userId},{$set:{"gamerProfile.dota2profile.idDota2": dota2Id}});
 }
  }

});
