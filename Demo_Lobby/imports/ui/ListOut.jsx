import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class ListOut extends React.Component{
  handleSingOut(){
    Meteor.logout();
    FlowRouter.go('/Login');
  }
  render(){
    return(
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li>
          <a href="/Games">{Meteor.user().username}</a>
        </li>
        <li>
          <a onClick={this.handleSingOut.bind(this)}>Salir</a>
        </li>
      </ul>
    );
  }
}
