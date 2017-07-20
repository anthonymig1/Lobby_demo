import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {Data_lobby} from './data_lobby.js'
import {Queue} from './queue.js';
var emparejar=()=>{
  //id generado para el lobby
console.log('Emparajando');
var lobby_id='00001';
if(Queue.find({}).count() > 0){
  var cola = Queue.find({}).fetch();
  console.log(cola.length);
  console.log(cola[0].username);
//Algortimo de emparejamiento retorna players
  if(cola.length >= 2)
  {
    var players = [];
    var i;
    for(i=0;i<2;i++){
    players[i]=cola[i].username;
    console.log(players);
    }

  //Data_lobby.remove({});
  Data_lobby.insert({
          _id:lobby_id,
          radiant:{
          teamName:"Los Radiant",
          slots:[
                {Num:1,vacio:false,user_id:players[0]},
                {Num:2,vacio:true,user_id:''},
                {Num:3,vacio:true,user_id:''},
                {Num:4,vacio:true,user_id:''},
                {Num:5,vacio:true,user_id:''},
          ],
      },
      dire:{
          teamName:"Los Dire",
          slots:[
                {Num:1,vacio:false,user_id:players[1]},
                {Num:2,vacio:true,user_id:''},
                {Num:3,vacio:true,user_id:''},
                {Num:4,vacio:true,user_id:''},
                {Num:5,vacio:true,user_id:''},
          ],
      },
  });

  var Lobby=Data_lobby.find({}).fetch();
  console.log(Lobby[0]._id);
  for(i=0;i<2;i++){
    Queue.remove({username:cola[i].username});
    }

  }
}
else{
    console.log("Cola vacia");
}
return lobby_id;
}

Data_lobby.remove({_id:'00001'});
var lbi;
lbi=emparejar();
export const Lobby_id = lbi;
//export const Lobby_id='00001';
