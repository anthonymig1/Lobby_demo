var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    crypto = require("crypto"),
    dota2 = require("dota2");

var Bot = function(credentials){
//  function Bot (credentials){
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
console.log("Conectado a steam");
BotDota2.steamUser.logOn(BotDota2.logOnDetails);
});
this.steamClient.on('logOnResponse',  function (logonResp) {
if (logonResp.eresult == steam.EResult.OK) {
    BotDota2.steamFriends.setPersonaState(steam.EPersonaState.Busy);
    BotDota2.steamFriends.setPersonaName("Dota 2 Bot");
    util.log("Logged on.");
    BotDota2.Dota2.launch();
    BotDota2.Dota2.on("ready", function() {
     console.log("Node-dota2 ready.");});
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

// Wrapper ***********************************************************************************

this.Dota2Bot = {};
this.Dota2Bot.steamClient = this.steamClient;
this.Dota2Bot.dota2 = this.Dota2;

// Profile Api
this.Dota2Bot.getMMR = function(accountId, callback) {
    var mmr = {
        solo: 0,
        party: 0
    }

    BotDota2.Dota2Bot.dota2.requestProfileCard(accountId, function (err, data) {
        // util.log(JSON.stringify(data));
        if (err){
            callback(err, null);
        } else {
            data.slots.forEach(function (slot) {
                if (slot.stat) {
                    switch (slot.stat.stat_id) {
                        case 1:
                        // util.log("mmr solo: " + slot.stat.stat_score);
                        mmr.solo = slot.stat.stat_score;
                        break;
                        case 2:
                        // util.log("mmr party: " + slot.stat.stat_score);
                        mmr.party = slot.stat.stat_score;
                        break;
                        default:
                        break;
                    }
                }
            });
            callback(null, mmr);
        }
    });
};

this.Dota2Bot.getStats = function(accountId, callback) {
    BotDota2.Dota2Bot.dota2.requestPlayerStats(accountId, function (err, data) {
        // some calcs
        if (err){
            callback(err, null);
        } else {
            callback(null, data);
        }

    });
};

this.Dota2Bot.winRate = function(accountId, callback) {
    var heroes = [];
    var heroes_lookup = [];
    var piv;
    var options = {
        start_at_match_id: 0,
        matches_requested: 20
    }
    var response = {
        top_3_heroes: [],
        wins: 0,
        matches: 0
    }

    BotDota2.Dota2Bot.dota2.requestPlayerMatchHistory(accountId, options, function(err, data){
        if (err){
            callback(err, null);
        } else {
            data.matches.forEach(function (match) {
                piv = heroes_lookup.indexOf(match.hero_id)
                if ( piv == -1) { //new entry
                    heroes_lookup.push(match.hero_id);
                    heroes.push({
                        heroId: match.hero_id,
                        games: 1,
                        wins: ((match.winner) ? 1 : 0)
                    });
                } else { //plus 1 to entry
                    heroes[piv].games++;
                    heroes[piv].wins += (match.winner) ? 1 : 0;
                }
                //options.start_at_match_id = match.match_id;
            });
            heroes.sort(function(a,b) {return (a.games < b.games) ? 1 : ((b.games < a.games) ? -1 : 0);} );

            response.top_heroes = heroes.slice(0, 3);
            response.wins = heroes.reduce(function(a, b) { return a + b.wins; }, 0);
            response.matches = data.matches.length;

            callback(null, response);
        }
    });
};

// Lobby Api

this.Dota2Bot.startLobby = function(teams, properties) {
    var chatName = "";
    if (!properties) {
        BotDota2.Dota2Bot.dota2.emit("lobbyNotCreated");
        return;
    }
    BotDota2.Dota2Bot.dota2.createPracticeLobby(properties.pass_key, properties, function(err, data){
        if (err) {
            BotDota2.Dota2Bot.dota2.emit("lobbyNotCreated");
        } else {
            BotDota2.Dota2Bot.dota2.emit("lobbyCreated");
            util.log(JSON.stringify(data));
            // Make DotaBot clear his slot Dota2Bot.steamClient.steamID
            BotDota2.Dota2Bot.dota2.practiceLobbyKickFromTeam(Dota2Bot.dota2.ToAccountID(Dota2Bot.steamClient.steamID), function(err,res){
                if (err) {
                    /*Dota2.leavePracticeLobby(function(err, data){
                        util.log(JSON.stringify(data));
                    });*/
                    util.log(err);
                }
            });

            // Dota2.inviteToLobby("76561198103503560");
            teams.goodGuys.forEach(function (radiantPlayer) {
                BotDota2.Dota2Bot.dota2.inviteToLobby(radiantPlayer);
            });
            teams.badGuys.forEach(function (direPlayer) {
                BotDota2.Dota2Bot.dota2.inviteToLobby(direPlayer);
            });

            chatName = "Lobby_" + BotDota2.Dota2Bot.dota2.Lobby.lobby_id;
            BotDota2.Dota2Bot.dota2.joinChat(chatName, 3);
            // setTimeout(function(){ Dota2.sendMessage(chatName, "hello", 3); }, 3000);
            var i = 60;
            var interv = setInterval(function(){
                switch (--i) {
                    case 55: case 45: case 35: case 25: case 15: case 10:
                    BotDota2.Dota2Bot.dota2.sendMessage(chatName, "lobby launch in T - " + i, 3);
                    BotDota2.Dota2Bot._lobbySlotControl(teams, chatName);
                    break;
                    case 0:
                    //launch lobby
                    // Dota2.sendMessage(chatName, "launch!", 3);
                    BotDota2.Dota2Bot._prelaunchControl(teams, function (check, resp) {
                        if (check != 10) {
                            util.log(check + " playas ready only! offenders: " + resp);
                            BotDota2.Dota2Bot.dota2.leaveChat(chatName, 3);
                            BotDota2.Dota2Bot.dota2.leavePracticeLobby(function(err, data){});
                            BotDota2.Dota2Bot.dota2.emit("lobbyCanceled");
                        } else {
                            BotDota2.Dota2Bot.dota2.launchPracticeLobby(function(err, data){});
                            BotDota2.Dota2Bot.dota2.emit("lobbyLaunched");
                        }
                    });
                    clearInterval(interv);
                    break;
                }
            }, 1000);
        }
    });
};

this.Dota2Bot._lobbySlotControl = function (teams, chatName) {
    BotDota2.Dota2Bot.dota2.Lobby.members.forEach(function (member) {

        // if (member.id == (Dota2.AccountID)) {
        if (member.id == BotDota2.Dota2Bot.steamClient.steamID) { // AccountID
            // util.log("lobby bot found!");
        } else {
            var inRadiantTeam = teams.goodGuys.indexOf(member.id.toString()) != -1;
            var inDireTeam = teams.badGuys.indexOf(member.id.toString()) != -1;

            if (!inRadiantTeam && !inDireTeam) {
                // remove from lobby
                BotDota2.Dota2Bot.dota2.practiceLobbyKick(BotDota2.Dota2Bot.dota2.ToAccountID(member.id), function(err,res){
                    if (err) {util.log(err);}
                });
            } else {
                switch (member.team) {
                    case 0: // goodGuys
                        if (!inRadiantTeam && inDireTeam) {
                            //wrong team, kick from team
                            BotDota2.Dota2Bot.dota2.practiceLobbyKickFromTeam(BotDota2.Dota2Bot.dota2.ToAccountID(member.id), function(err,res){
                                if (err) {util.log(err);}
                            });
                            BotDota2.Dota2Bot.dota2.sendMessage(chatName, "Player "+member.name+", take a slot in the dire team.", 3);
                        }
                        break;
                    case 1: // badGuys
                        if (inRadiantTeam && !inDireTeam) {
                            //wrong team, kick from team
                            BotDota2.Dota2Bot.dota2.practiceLobbyKickFromTeam(BotDota2.Dota2Bot.dota2.ToAccountID(member.id), function(err,res){
                                if (err) {util.log(err);}
                            });
                            BotDota2.Dota2Bot.dota2.sendMessage(chatName, "player "+member.name+", take a slot in the radiant team.", 3);
                        }
                        break;
                    case 3: // spectator
                        switch (member.coach_team) { // no coaching allowed
                            case 0: // coach for goodGuys
                                BotDota2.Dota2Bot.dota2.practiceLobbyKickFromTeam(BotDota2.Dota2Bot.dota2.ToAccountID(member.id), function(err,res){
                                    if (err) {util.log(err);}
                                });
                                BotDota2.Dota2Bot.dota2.sendMessage(chatName, "player "+member.name+" no coaching allowed!", 3);
                                break;
                            case 1: // coach for badGuys
                                BotDota2.Dota2Bot.dota2.practiceLobbyKickFromTeam(BotDota2.Dota2Bot.dota2.ToAccountID(member.id), function(err,res){
                                    if (err) {util.log(err);}
                                });
                                BotDota2.Dota2Bot.dota2.sendMessage(chatName, "player "+member.name+" no coaching allowed!", 3);
                                break;
                        }
                        break;
                }
            }
        }
    });


} ;

//ver 1.0
this.Dota2Bot._prelaunchControl = function (teams, callback) {
    //loop through lobby members
    //use indexOf on teams to check correct slot and increase counter
    //at the end of the loop counter must reach 10, otherwise cancel launch
    var offenders = [];
    var allSet = 0;

    BotDota2.Dota2Bot.dota2.Lobby.members.forEach(function (member) {
        if (member.id == Dota2Bot.steamClient.steamID) { // AccountID
            // respect lobby bot
        } else {
            switch (member.team) {
                case 0: // gooddies
                    // allSet += teams.goodGuys.indexOf(member.id.toString()) == -1 ? 0 : 1;
                    if (teams.goodGuys.indexOf(member.id.toString()) == -1) {
                        // util.log("off found "+member.name);
                        offenders.push(member.id.toString());
                    } else {
                        // util.log("well pos "+member.name);
                        allSet++;
                    }
                    break;
                case 1: // baddies
                    // allSet += teams.badGuys.indexOf(member.id.toString()) == -1 ? 0 : 1;
                    if (teams.badGuys.indexOf(member.id.toString()) == -1) {
                        // util.log("off found "+member.name);
                        offenders.push(member.id.toString());
                    } else {
                        // util.log("well pos "+member.name);
                        allSet++;
                    }
                    break;
            }
        }
    });
    // util.log("allset:" + allSet);
    // util.log("offf:" + offenders);
    if (allSet == 10) {
        callback(null, null);
    } else {
        callback(allSet, offenders);
    }
};

// *********************************************************************************** Wrapper

//Dota2Bot.steamClient.connect();

this.Dota2Bot.dota2.on("ready", function() {

    BotDota2.Dota2Bot.dota2.flipLobbyTeams(function() {});
    setTimeout(function(){
        if (BotDota2.Dota2Bot.dota2.Lobby){
            BotDota2.Dota2Bot.dota2.joinChat("Lobby_" + BotDota2.Dota2Bot.dota2.Lobby.lobby_id, 3);
            setTimeout(function(){
                BotDota2.Dota2Bot.dota2.leaveChat("Lobby_" + BotDota2.Dota2Bot.dota2.Lobby.lobby_id, 3);
                BotDota2.Dota2Bot.dota2.leavePracticeLobby(function(err, data){
                    util.log(JSON.stringify(data));
                });
                BotDota2.Dota2Bot.dota2.emit("botReady");
            },2000);
        } else {
            BotDota2.Dota2Bot.dota2.emit("botReady");
        }
    }, 2000);

});
}

module.exports = Bot;
