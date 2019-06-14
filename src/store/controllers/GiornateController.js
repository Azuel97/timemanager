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

  updateTempoLavoro: function(utente,tempoAggiornato) {
    aggiornaLavoro = repository.objects('Giornat').filtered('utente == $0',utente);
    repository.write(() => {
        for (let p of aggiornaLavoro) {
            p.tempoLavoro = tempoAggiornato
        }
    })
  },

  updateTempoAttivita: function(utente,tempoAggiornato) {
    aggiornaAttivita = repository.objects('Giornat').filtered('utente == $0',utente);
    repository.write(() => {
        for (let p of aggiornaAttivita) {
            p.tempoAttivita = tempoAggiornato
        }
    })
  },
 
  update: function(callback) {
    if (!callback) return;
    repository.write(() => {
      callback();
    });
  }

};

export default GiornataService;