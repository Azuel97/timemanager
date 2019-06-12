import Ute from '../models/User'

export const addUtenti = (email) =>  {
Realm.open([Ute]).then(realm => {
    realm.write(() => {
      //Creo un nuovo utente    
      realm.create('Ute', {name: email});
    });
  });
}