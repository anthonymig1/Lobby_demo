import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

export const numGames = 5;

export default class Dota2 extends Component{

	render(){
		return (
      <div className="row">
        <h1>Hemos recolectado su informacion de dota2</h1>
      </div>
		)
	}
}
