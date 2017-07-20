import React, {PropTypes} from 'react';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import ReactDOM from 'react-dom';

export default class Login extends React.Component {
  constructor(props){
      super(props);
      this.state={
        mensaje:'',
      }
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
    twitter(){
      Meteor.loginWithTwitter((err)=>{
        if(err){
          FlowRouter.go('/Login');
        }else{
          FlowRouter.go('/Home');
        }
      });
    }
    recuperarContraseña(){
      FlowRouter.go('/RecuperarContraseña');
    }
    handleSubmit(event) {
        event.preventDefault();
        const username = ReactDOM.findDOMNode(this.refs.username).value.trim();
        const password = ReactDOM.findDOMNode(this.refs.password).value.trim();
        if (username != '' && password != '') {
            Meteor.loginWithPassword(username, password,(err)=>{
              if(err){
                this.setState({
                  mensaje:'username or password is incorrect!!!',
                });
              }else{
              //  FlowRouter.go(`/${username}`);
                FlowRouter.go('/home/Emparejamiento');
              }
            });

        } else {
          this.setState({
            mensaje:'Informacion incompleta!!!',
          });

      }
    }
    changeRegister() {
        FlowRouter.go('/Registro');
    }
    render() {
        return (
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
                    <div className='row'>
                      <div className='col s12'>
                        <span>{this.state.mensaje}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col s6">
                        <button className="btn waves-effect waves-light" type="submit">Login
                           <i className="material-icons right">send</i>
                         </button>
                      </div>
                       <div className="col s6">
                         <a className='linkRecuperarContraseña right' onClick={this.recuperarContraseña.bind(this)}>recuperar contraseña</a>
                       </div>
                    </div>
                    <div className='row'>
                      <div className='col s6'>
                        <a onClick={this.facebook.bind(this)}>Logeate Con facebook</a>
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

Login.defaultProps = {
    mensaje: ''
}

Login.propTypes = {
    mensaje: PropTypes.string
}
