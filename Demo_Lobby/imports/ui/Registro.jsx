import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';

export default class Registro extends React.Component{
  constructor(props){
    super(props);
    this.state={
      error:'',
    }
  }
  twitter(){
    Meteor.loginWithTwitter((err)=>{
      if(err){
        FlowRouter.go('/Login');
      }else{
        FlowRouter.go('/Home');
      }
    });
  }
  facebook(){
    Meteor.loginWithFacebook((err)=>{
      if(!err){
        FlowRouter.go('/Home');
      }else{
        FlowRouter.go('/Login');
      }
    });
  }
  handleSubmit(event){
    event.preventDefault();
    const username= ReactDOM.findDOMNode(this.refs.username).value.trim();
    const password= ReactDOM.findDOMNode(this.refs.password).value.trim();
    const email= ReactDOM.findDOMNode(this.refs.email).value.trim();
    if(username && password && email){
      Accounts.createUser({
        username:username,
        password:password,
        email:email,
      });
      // Accounts.sendVerificationEmail(Meteor.userId(),email);
      // Meteor.call('enviarEmail',email);
    //  FlowRouter.go(`/${username}`);
      FlowRouter.go('/home/Games');
    }else{
      this.setState({
        error:'algun casillero esta vacio',
      });
    }
  }
  render(){
    return(
      <div className="row">
          <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
              <div className="row">
                  <div className="input-field col s12">
                      <input placeholder="" ref='username' id="username" type="text" className="validate"/>
                      <label htmlFor="username">User Name</label>
                  </div>
              </div>
              <div className="row">
                  <div className="input-field col s12">
                      <input id="password" ref='password' type="password" className="validate"/>
                      <label htmlFor="password">Password</label>
                  </div>
              </div>
              <div className="row">
                  <div className="input-field col s12">
                      <input id="email" ref='email' type="email" className="validate"/>
                      <label htmlFor="email">Email</label>
                  </div>
              </div>
              {this.state.error}
              <div className="row">
                <div className="col s6">
                  <button className="btn waves-effect waves-light" type="submit">Registro
                     <i className="material-icons right">send</i>
                   </button>
                </div>
                 <div className="col s6">
                   <a href="/Login" className='right'>Login</a>
                 </div>
              </div>
              <div className='row'>
                <div className='col s6'>
                  <a onClick={this.facebook.bind(this)}>Registrate con facebook</a>
                </div>
                <div className='col s6'>
                  <a onClick={this.twitter.bind(this)}>Logeate Con twitter</a>
                </div>
              </div>
          </form>
      </div>
    );
  }
}

Registro.defaultProps={
  error:'',
}

Registro.propTypes={
  error:PropTypes.string,
}
