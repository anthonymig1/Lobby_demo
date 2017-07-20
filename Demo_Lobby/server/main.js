import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
//import '../imports/bot/BotMetodos.js';
//import '../imports/lol-api/LolMethods.js';
//import '../imports/api/user.js';
import '../imports/api/queue.js';
import '../imports/api/emparejar.js';
///import '../imports/lol-api/server.js';
Meteor.startup(() => {
  // code to run on server at startup
  Accounts.onCreateUser(function(options,user){
    let email ;
    let existeUser;
    let currentUser;

    if(user.services){
      if(user.services.facebook){
        email = user.services.facebook.email;
      }else if(user.services.twitter){
        email = user.services.twitter.email;
      }
    }
  //  console.log(Meteor.user());
    if(user.services.steam && Meteor.user() != null)
    {

      Meteor.users.update({_id: Meteor.user()._id}, { $set: { "gamerProfile.steamId": user.services.steam.id } });
      Meteor.users.update({_id: Meteor.user()._id}, { $set: { "gamerProfile.verifiedSteam" : true } });
      Meteor.users.update({_id: Meteor.user()._id}, { $set: { "services.steam" : user.services.steam } });

      currentUser = Meteor.users.findOne({_id: Meteor.user()._id});

      Meteor.users.remove({_id: Meteor.user()._id});
        console.log(Meteor.user());
      return currentUser;
    }

    const newUser = {services:{password:{}} ,
      userProfile:{},
      gamerProfile:{}
    };
    newUser.CreatedAt= new Date();
    if(user.services.facebook){
      let fb= user.services.facebook;
      newUser.userProfile.first_name = fb.first_name;
      newUser.userProfile.last_name = fb.last_name;
      newUser.userProfile.age = fb.age_range.max;
      newUser.userProfile.gender = fb.gender;

      newUser.services.facebook = fb;
      newUser.emails = [{address: fb.email, verified: true}];
    }else if(user.services.twitter){
    }else{
      newUser.services.password = user.services.password;
      newUser.username = user.username;
      newUser.email = user.emails;
        newUser.gamerProfile.gamerTag = options.username;
    }
    newUser.gamerProfile.verifiedSteam = false;
    newUser.gamerProfile.verifiedLol = false;
    newUser.gamerProfile.dota2Profile = {};
    newUser.gamerProfile.lolProfile = {};
    newUser.Dota2.steam = {};
    newUser.services.steam = {};
    return newUser;
  });
});

Accounts.urls.resetPassword = function(token) {
   return Meteor.absoluteUrl('/ResetPassword/' + token);
};
  process.env.MAIL_URL="smtp://EstofadoConAzucar%40gmail.com:mamemimo@smtp.gmail.com:465/";
