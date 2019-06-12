import Database from '../index';
import PeopleModel from '../models/UserModel';
 
let repository = Database.getRepository();
 
 
let PeopleService = {
  findAll: function(sortBy) {
    if (!sortBy) sortBy = [['name', true]];
    return repository.objects('Ute').sorted(sortBy);
  },
 
  save: function(person) { 
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
