import { Alert } from 'react-native'
import Database from '../index';
import PeopleModel from '../models/UserModel';
 
let repository = Database.getRepository();
 
 
let PeopleService = {
  findAll: function(sortBy) {
    if (!sortBy) sortBy = [['name', true]];
    return repository.objects('Ute').sorted(sortBy);
  },

  find: function(){
    return repository.objects('Ute')
  },
 
  save: function(person) {
    // Se esiste già un utente con il nome inserito non verrà aggiunto
    if (repository.objects('Ute').filtered("name = '" + person.name + "'").length) return Alert.alert('Attenzione','Utente già esistente');

    repository.write(() => {
      repository.create('Ute', person);
    })
  },
 
  update: function(callback) {
    if (!callback) return;
    repository.write(() => {
      callback();
    });
  }
};

module.exports = PeopleService;
