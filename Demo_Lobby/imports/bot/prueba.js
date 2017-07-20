var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    crypto = require("crypto"),
    dota2 = require("dota2");
var hola = function(credentials){
//  console.log("Hola usuario");
var BotDota2=this;
this.config = credentials;
this.steamClient = new steam.SteamClient();
this.steamUser = new steam.SteamUser(this.steamClient);
this.steamFriends = new steam.SteamFriends(this.steamClient);
this.Dota2 = new dota2.Dota2Client(this.steamClient,true);
this.logOnDetails = {
"account_name": this.config.steam_user,
"password": this.config.steam_pass,
};
this.steamUser.on('updateMachineAuth', function(sentry, callback) {
var hashedSentry = crypto.createHash('sha1').update(sentry.bytes).digest();
fs.writeFileSync('sentry', hashedSentry)
util.log("sentryfile saved");
//console.log("sentryfile saved");
callback({ sha_file: hashedSentry});
});


this.steamClient.on('connected', function() {
BotDota2.steamUser.logOn(BotDota2.logOnDetails);
});
this.steamClient.on('logOnResponse',  function (logonResp) {
if (logonResp.eresult == steam.EResult.OK) {
    BotDota2.steamFriends.setPersonaState(steam.EPersonaState.Busy);
    BotDota2.steamFriends.setPersonaName("Dota 2 Bot");
    util.log("Logged on.");
    BotDota2.Dota2.launch();
    BotDota2.Dota2.on("unready", function onUnready() {
        util.log("Node-dota2 unready.");
    });
    BotDota2.Dota2.on("unhandled", function(kMsg) {
        util.log("UNHANDLED MESSAGE #" + kMsg);
    });
}
});
this.steamClient.on('loggedOff', function(eresult){
      util.log("Logged off from Steam.");
  });
  this.steamClient.on('error', function(error){
      util.log("Connection closed by server.");
  });

  this.steamClient.on('servers', function(servers){
      util.log("Received servers.");
      fs.writeFile('servers', JSON.stringify(servers));
  });
if (this.config.steam_guard_code) this.logOnDetails.auth_code = this.config.steam_guard_code;

try {
var sentry = fs.readFileSync('sentry');
if (sentry.length) this.logOnDetails.sha_sentryfile = sentry;
}
catch (beef){
util.log("Cannot load the sentry. " + beef);
}

}
module.exports = hola;
