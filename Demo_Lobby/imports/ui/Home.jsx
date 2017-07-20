import React , { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'react-meteor-data';

import Prueba from './Prueba.jsx';

class Home extends React.Component{
  render(){
    return(
      <div className="row">
        <ul>
          <li>Bienvenido {this.props.user.username?this.props.user.username||this.props.user.first_name:''} a nuestra aplicacion .... que seas parte de nuestra familia es un privilegio .. suerte ;)</li>
          <li>Salir</li>
        </ul>
      </div>
    );
  }
}

Home.propTypes={
  user:PropTypes.object,
}

export default createContainer(()=>{
  return{
    user: Meteor.user() || {},
  }
},Home);
