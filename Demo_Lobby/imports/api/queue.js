import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {Data_lobby} from './data_lobby.js';
export const Queue = new Mongo.Collection('queue');
Meteor.methods({
  'queue.insert'(text) {

    console.log('inserta a la cola');
    check(text, String);
    if (! Meteor.userId()) {
      throw new Meteor.Error('Usuario no Logeado');
    }
    if(Queue.find({iduser:Meteor.userId()}).count()== 0){
    Queue.insert({
      iduser: Meteor.userId(),
      username: Meteor.user().username,
      createdAt: new Date(),
    });
  }
  else{
    console.log('Usuario en la cola');
  }
  },
});
