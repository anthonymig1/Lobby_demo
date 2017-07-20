import React,{Component,PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
export default class Slot extends Component{

KickUser(){
    //Meteor.call('tasks.remove', this.props.task._id);
}
unirse(){}
  render(){
    return(
        <li className="slot">
          <button className="delete" onClick={this.KickUser.bind(this)}>
            &times;
          </button>
          <span className="text">
                { this.props.slot.vacio ? 'vacio' : this.props.slot.user_id}
            </span>
          </li>
    );
  }
}

Slot.propTypes = {
  slot: PropTypes.object.isRequired,
};
