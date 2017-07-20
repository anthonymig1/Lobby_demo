//import { Botoo } from './ind.js';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
var Bot = require('./index.js');
const testCollection = new Mongo.Collection('testCollection');
var userbot={
  "steam_name" : "d2gbb0001",
    "steam_user" : "d2gbb0001",
    "steam_pass" : "Passwordsecret123",
    "steam_guard_code" : "steamGuardCodeIfApplicable"
};
var hola = require('./prueba.js');

var RunBot = new Bot(userbot);

Meteor.startup(() => {
  RunBot.Dota2Bot.steamClient.connect();
});

Meteor.methods({
 'userupdate.Dota2profile'(){
    let userId= Meteor.userId();
      if(Meteor.isServer){
    let user=Meteor.users.findOne({_id: userId});

    console.log(dota2Id);
    let steamId=user.gamerProfile.steamId;
    let dota2Id=RunBot.Dota2Bot.dota2.ToAccountID(steamId);
    const stats=RunBot.Dota2Bot.getStats(dota2Id);
    const mmr=RunBot.Dota2Bot.getMMR(dota2Id);
    Meteor.users.update({_id:userId},{$set:{"gamerProfile.dota2profile": stats.toJson()}});
    Meteor.users.update({_id:userId},{$set:{"gamerProfile.dota2profile.MMR": mmr}});
    //Meteor.users.update({_id:userId},{$set:{"gamerProfile.dota2profile.idDota2": dota2Id}});
 }
  }

});
