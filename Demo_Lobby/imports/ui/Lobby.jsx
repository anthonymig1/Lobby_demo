import React, {Component,PropTypes} from 'react';
import Slot from './Slot.jsx';
import ReactDOM from 'react-dom';
import {Data_lobby} from '../api/data_lobby.js';
import {Lobby_id} from '../api/emparejar.js';
import {createContainer} from 'react-meteor-data';
import { Meteor } from 'meteor/meteor';
class Lobby extends Component{
  constructor(props) {
  super(props);
}
getDatalobby(){
  const data={_id:1,
              radiant:{
                  teamName:"Los Radiant",
                  slots:[
                        {Num:1,vacio:false,user_id:'154565643'},
                        {Num:2,vacio:true,user_id:''},
                        {Num:3,vacio:true,user_id:''},
                        {Num:4,vacio:true,user_id:''},
                        {Num:5,vacio:true,user_id:''},
                  ],
              },
              dire:{
                  teamName:"Los Dire",
                  slots:[
                        {Num:1,vacio:true,user_id:''},
                        {Num:2,vacio:true,user_id:''},
                        {Num:3,vacio:true,user_id:''},
                        {Num:4,vacio:true,user_id:''},
                        {Num:5,vacio:true,user_id:''},
                  ],
              },
          };
      return data;
}
renderSlots_radiant(){
  console.log(Lobby_id);
  const Data_lobby = this.props.lobby;
  //const Data_lobby = this.getDatalobby();
  let radiant = Data_lobby.radiant.slots;

  return radiant.map((slot)=>(
    <Slot key={slot.Num} slot={slot}/>
  ));
}
renderSlots_dire(){
  const Data_lobby = this.props.lobby;
  let dire = Data_lobby.dire.slots;

  return dire.map((slot)=>(
    <Slot key={slot.Num} slot={slot}/>
  ));
}
render(){
  return(
      <div>
      {
        this.props.lobby?
      (   <div className="container">
        <header>
        <h1 className="lobby"> Los Radiant </h1>
        <h1 className="lobby" > Los Dire </h1>

      </header>
        <ul className="lobby">
          {this.renderSlots_radiant()}
        </ul>
        <ul className="lobby">
          {this.renderSlots_dire()}
        </ul>
      </div>) :(<h1> buscando </h1>)}
    </div>
  );
}
}
Lobby.PropTypes ={

};
export default createContainer(() => {
  return {
    lobby: Data_lobby.findOne({_id:Lobby_id}),
  };
}, Lobby);
