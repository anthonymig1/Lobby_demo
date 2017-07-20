import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

export default class Games extends Component{
	constructor(props){
			super(props);
			this.state = {
				lol:
				<form className="col s6" onSubmit={this.lolprofile.bind(this)}>
						<div className="row">
								<div className="input-field col s12">
										<input placeholder="NameSummoner" ref='NameSummoner' id="NameSummoner" type="text" className="validate"/>
										<label htmlFor="NameSummoner">NameSummoner</label>
								</div>
						</div>
						<div className="row">
							<div className="col s6">
								<button className="btn waves-effect waves-light" type="submit">PerfilLol
									 <i className="material-icons right">send</i>
								 </button>
							</div>
						</div>
					</form>

			};
		}
	withSteam(err) {
		err.preventDefault();
		Meteor.loginWithSteam((er)=>{

		}) ;
	}
	dota2profile(e) {
		e.preventDefault();
		Meteor.call('userupdate.Dota2profile',(err)=>{if(err) console.log(err);});
		FlowRouter.go('/home/Games/dota2');
		//  console.log(Meteor.user());
	}
	lolprofile(e) {
		e.preventDefault();
		  const NameSummoner= ReactDOM.findDOMNode(this.refs.NameSummoner).value.trim();
		Meteor.call('userupdate.LolApi',NameSummoner,(err)=>{if(err) console.log(err);});
		FlowRouter.go('/home/Games');
		//  console.log(Meteor.user());
	}

	render(){
		return (
      <div className="row">
        <div className="col s6">
          <button
              onClick={this.withSteam.bind(this)}
            >
              Dota 2
            </button>
        </div>

      <button
          onClick={this.dota2profile.bind(this)}
        >
          Perfil Dota 2
        </button>
					{this.state.lol}

      </div>
		)
	}
}
