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
    
    // Altrimenti se non esiste nessun accesso giornaliero ritorno false
    return false;
  }, 

  // Salva task effettuati duarante la giornata
  saveTask: function(utente,dataGiornata,mioTask) {
    // Se il task passato è vuoto, allora ritorna true che verrà utilizzato per la mamipolazione
    if(mioTask === ""){
        return true
    }

    // Altrimenti eseguo la query ed aggiungo il task al DB, controllando se però è già esistene lo stesso
    // task ed in quel caso non lo aggiungo ancora alla lista dei task nel DB
    salvaTask = repository.objects('Giorn').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
      for (let p of salvaTask) {
        count = p.task.length
          for(let i=0; i<count; i++){
            // Controllo se il miotask da inserire è già esistente all'interno della lista dei task
            if(mioTask === p.task[i]){
              return true
            }
          }
        // Se il task non è già presente lo aggiungo alla lista  
        p.task.push(mioTask)
      }
    })
    return false
  },

  // Recupero tutti task del utente e della giornata selezionata
  findAllTask: function(utente,dataGiornata) {
     // Altrimenti eseguo la query ed aggiungo il task al DB
     trovaTask = repository.objects('Giorn').filtered('utente == $0 && data == $1',utente,dataGiornata);
     taskTrovati = []
     repository.write(() => {
       for (let p of trovaTask) {
         count = p.task.length
          for(let i=0; i<count; i++)
           taskTrovati.push(p.task[i])
       }
   })
   return taskTrovati
  },

  findLastTask: function(utente,dataGiornata) {
    // Se non è presente all'interno del DB la data cercata, allora ritorno come default il valore '000000'
    if (!repository.objects('Giorn').filtered(" utente = '" + utente + "' && data = '" + dataGiornata + "'").length) 
        return '';

    trovaTask = repository.objects('Giorn').filtered('utente == $0 && data == $1',utente,dataGiornata);
    let taskTrovato
    repository.write(() => {
      for (let p of trovaTask) {
        count = p.task.length
        taskTrovato = p.task[count-1]
        console.log(taskTrovato)
      }
    })
    return taskTrovato
  },

  // Aggiorna nel database il valore del timer del lavoro
  updateTempoLavoro: function(utente,tempoAggiornato,dataGiornata) {
    aggiornaLavoro = repository.objects('Giorn').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
        for (let p of aggiornaLavoro) {
            p.tempoLavoro = tempoAggiornato
        }
    })
  },

  // Aggiorna nel database il valore del timer delle attività
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