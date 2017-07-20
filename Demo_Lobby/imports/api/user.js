import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
let user;
for(user=3;user<10;user++){
Accounts.createUser({
  username:"user"+user,
  password:"user"+user,
  email:"user"+user+"@gmail.com",
});
};
