import Database from '../index';
 
let repository = Database.getRepository();
 
let GiornataService = {

  findAllUser: function(){
    return repository.objects('Giornat')
  },
  
  saveGiornata: function(giornata) {
    // Se esiste già un utente con il nome inserito non verrà aggiunto, e ritorna false
    if (repository.objects('Giornat').filtered(" utente = '" + giornata.utente + "'").length) 
        return false;

    // Se l'utente non è presente, allora lo aggiungo e ritorno true
    repository.write(() => {
      repository.create('Giornat', giornata);
    })
  },

  updateTempoLavoro: function(utente,tempoAggiornato,dataGiornata) {
    aggiornaLavoro = repository.objects('Giornat').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
        for (let p of aggiornaLavoro) {
            p.tempoLavoro = tempoAggiornato
        }
    })
  },

  updateTempoAttivita: function(utente,tempoAggiornato,dataGiornata) {
    aggiornaAttivita = repository.objects('Giornat').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
        for (let p of aggiornaAttivita) {
            p.tempoAttivita = tempoAggiornato
        }
    })
  },

  findTempoLavoro: function(utente,dataGiornata) {
    trovaTempo = repository.objects('Giornat').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
      for (let p of trovaTempo) {
          tempoTrovato = p.tempoLavoro
      }
    })
    return tempoTrovato
  },

  findTempoAttivita: function(utente,dataGiornata) {
    trovaTempo = repository.objects('Giornat').filtered('utente == $0 && data == $1',utente,dataGiornata);
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