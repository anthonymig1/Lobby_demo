var LolApi = require('leagueapi');

var ApiLol = function(key){
  console.log('Api de Lol');
  this.getUser= function(NameSummoner,callback){
    LolApi.init(key);
    LolApi.Summoner.getByName(NameSummoner, function(err, summoner) {
    	if(!err) {
    		//console.log(summoner);
        callback(null,summoner)
    	}
    });
  };

}
module.exports = ApiLol;
