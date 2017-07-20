import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import ReactDOM from 'react-dom';

export default class Email extends React.Component{

  render(){
    return(
      <h1>Le hemos enviando un correo de recuperacion de contraseña</h1>
    );
  }
}
