import Database from '../index';
 
let repository = Database.getRepository();
 
let GiornataService = {

  findAllUser: function(){
    return repository.objects('Giorn')
  },
  
  saveGiornata: function(giornata) {
    // Se esiste già un utente con il nome inserito e con la data già esistente non verrà aggiunto, e ritorna false
    if (repository.objects('Giorn').filtered(" utente = '" + giornata.utente + "' && data = '" + giornata.data + "'").length) 
        return false;

    // Se l'utente non è presente, allora lo aggiungo e ritorno true
    repository.write(() => {
      repository.create('Giorn', giornata);
    })
  },

  findGiornata: function(utente,dataGiornata) {
    // Se esiste già un utente con il nome inserito e con la data già esistente non verrà aggiunto, e ritorna false
    if (repository.objects('Giorn').filtered(" utente = '" + utente + "' && data = '" + dataGiornata + "'").length) 
        return true;
    
    return false;
  }, 

  // Salva task effettuati duarante la giornata
  saveTask: function(utente,dataGiornata,mioTask) {
    salvaTask = repository.objects('Giorn').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
      for (let p of salvaTask) {
          p.task.push(mioTask)
      }
  })
  },

  updateTempoLavoro: function(utente,tempoAggiornato,dataGiornata) {
    aggiornaLavoro = repository.objects('Giorn').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
        for (let p of aggiornaLavoro) {
            p.tempoLavoro = tempoAggiornato
        }
    })
  },

  updateTempoAttivita: function(utente,tempoAggiornato,dataGiornata) {
    aggiornaAttivita = repository.objects('Giorn').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
        for (let p of aggiornaAttivita) {
            p.tempoAttivita = tempoAggiornato
        }
    })
  },

  findTempoLavoro: function(utente,dataGiornata) {
    // Se non è presente all'interno del DB la data cercata, allora ritorno come default il valore '000000'
    if (!repository.objects('Giorn').filtered(" utente = '" + utente + "' && data = '" + dataGiornata + "'").length) 
        return '000000';

    trovaTempo = repository.objects('Giorn').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
      for (let p of trovaTempo) {
          tempoTrovato = p.tempoLavoro
      }
    })
    return tempoTrovato
  },

  findTempoAttivita: function(utente,dataGiornata) {
    // Se non è presente all'interno del DB la data cercata, allora ritorno come default il valore '000000'
    if (!repository.objects('Giorn').filtered(" utente = '" + utente + "' && data = '" + dataGiornata + "'").length) 
        return '000000';
        
    trovaTempo = repository.objects('Giorn').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
      for (let p of trovaTempo) {
          tempoTrovato = p.tempoAttivita
      }
    })
    return tempoTrovato
  },
 
  update: function(callback) {
    if (!callback) return;
    repository.write(() => {
      callback();
    });
  }

};

export default GiornataService;