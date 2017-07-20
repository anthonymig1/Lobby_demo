import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

export default class Emparejamiento extends Component{
	constructor(props){
			super(props);
		}
	insertCola(){
    if ( Meteor.userId()) {
    Meteor.call('queue.insert',Meteor.userId());
    }
    FlowRouter.go('/home/Lobby');
  }

	render(){
		return (
      <div className="row">
        <div className="col s6">
          <button
              onClick={this.insertCola.bind(this)}
            >
              Buscar
            </button>
        </div>
      </div>
		)
	}
}
