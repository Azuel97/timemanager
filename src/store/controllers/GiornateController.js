import Database from '../index';
 
let repository = Database.getRepository();
 
let GiornataService = {

  findAllUser: function(){
    return repository.objects('Gior')
  },
  
  saveGiornata: function(giornata) {
    // Se esiste già un utente con il nome inserito e con la data già esistente non verrà aggiunto, e ritorna false
    if (repository.objects('Gior').filtered(" utente = '" + giornata.utente + "' && data = '" + giornata.data + "'").length) 
        return false;

    // Se l'utente non è presente, allora lo aggiungo e ritorno true
    repository.write(() => {
      repository.create('Gior', giornata);
    })
  },

  findGiornata: function(utente,dataGiornata) {
    // Se esiste già un utente con il nome inserito e con la data già esistente non verrà aggiunto, e ritorna false
    if (repository.objects('Gior').filtered(" utente = '" + utente + "' && data = '" + dataGiornata + "'").length) 
        return true;
    
    // Altrimenti se non esiste nessun accesso giornaliero ritorno false
    return false;
  }, 

  // Salva task effettuati duarante la giornata
  saveTask: function(utente,dataGiornata,mioTask,tempoAggiornato) {
    // Se il task passato è vuoto, allora ritorna true che verrà utilizzato per la mamipolazione
    if(mioTask === ""){
        return true
    }

    trovaTempo = repository.objects('Gior').filtered('utente == $0 && data == $1',utente,dataGiornata);
    // Altrimenti eseguo la query ed aggiungo il task al DB, controllando se però è già esistene lo stesso
    // task ed in quel caso non lo aggiungo ancora alla lista dei task nel DB
    salvaTask = repository.objects('Gior').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
      for (let p of salvaTask) {
        count = p.task.length
          for(let i=0; i<count; i++){
            // Controllo se il miotask da inserire è già esistente all'interno della lista dei task
            if(mioTask === p.task[i]){
              tempoTrovato = parseInt(p.tempoAttivita)
              tempoAgg = parseInt(tempoAggiornato)
              //console.log(tempoTrovato)
              //console.log(tempoAgg)
              tran = parseInt(p.tranche[i])
              aggiornaTempo = parseInt(tempoAggiornato - p.tempoAttivita)
              tran += aggiornaTempo
              p.tranche[i] = tran.toString()
              //console.log(p.tranche[i])
              return true
            }
          }
        // Se il task non è già presente lo aggiungo alla lista  
        p.task.push(mioTask)
        aggiornaTempo = parseInt(tempoAggiornato - p.tempoAttivita)
        console.log(aggiornaTempo)
        if((aggiornaTempo >=90) && (aggiornaTempo <=100) )
          aggiornaTempo -= 40
        else if((aggiornaTempo >=80) && (aggiornaTempo <=90) )
          aggiornaTempo -= 30
        else if((aggiornaTempo >=70) && (aggiornaTempo <=80) )
          aggiornaTempo -= 20
        else if((aggiornaTempo >=60) && (aggiornaTempo <=70) )
          aggiornaTempo -= 10
        p.tranche.push(aggiornaTempo.toString())
      }
    })
    return false
  },

  // Recupero tutti task del utente e della giornata selezionata
  findAllTask: function(utente,dataGiornata) {
     // Altrimenti eseguo la query ed aggiungo il task al DB
     trovaTask = repository.objects('Gior').filtered('utente == $0 && data == $1',utente,dataGiornata);
     taskTrovati = []
     repository.write(() => {
       for (let p of trovaTask) {
         count = p.task.length
          for(let i=0; i<count; i++){
           lunghezza = p.tranche[i].length
           console.log(lunghezza)
           if(lunghezza === 2){
              t = p.tranche[i]
              sec = t.substring(0,2)
              min = '00'
              hou = '00'
              taskTrovati.push(p.task[i] + '  -->  ' + hou + ':' + min + ':' + sec)
           }else if(lunghezza === 3){
              t = p.tranche[i]
              sec = t.substring(1,3)
              min = '0' + t.substring(0,1)
              hou = '00'
              taskTrovati.push(p.task[i] + '  -->  ' + hou + ':' + min + ':' + sec)
           }else if(lunghezza === 4){
              t = p.tranche[i]
              sec = t.substring(2,4)
              min = t.substring(0,2)
              hou = '00'
              taskTrovati.push(p.task[i] + '  -->  ' + hou + ':' + min + ':' + sec)
            }else if(lunghezza === 5){
              t = p.tranche[i]
              sec = t.substring(3,5)
              min = t.substring(1,3)
              hou = '0' + t.substring(0,1)
              taskTrovati.push(p.task[i] + '  -->  ' + hou + ':' + min + ':' + sec)
            }else if(lunghezza === 6){
              t = p.tranche[i]
              sec = t.substring(4,6)
              min = t.substring(2,4)
              hou = t.substring(0,2)
              taskTrovati.push(p.task[i] + '  -->  ' + hou + ':' + min + ':' + sec)
            }
        }
       }
   })
   return taskTrovati
  },

  findLastTask: function(utente,dataGiornata) {
    // Se non è presente all'interno del DB la data cercata, allora ritorno come default il valore '000000'
    if (!repository.objects('Gior').filtered(" utente = '" + utente + "' && data = '" + dataGiornata + "'").length) 
        return '';

    trovaTask = repository.objects('Gior').filtered('utente == $0 && data == $1',utente,dataGiornata);
    let taskTrovato
    repository.write(() => {
      for (let p of trovaTask) {
        count = p.task.length
        taskTrovato = p.task[count - 1]
        console.log(taskTrovato)
      }
    })
    return taskTrovato
  },

  // Aggiorna nel database il valore del timer del lavoro
  updateTempoLavoro: function(utente,tempoAggiornato,dataGiornata) {
    aggiornaLavoro = repository.objects('Gior').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
        for (let p of aggiornaLavoro) {
            p.tempoLavoro = tempoAggiornato
        }
    })
  },

  // Aggiorna nel database il valore del timer delle attività
  updateTempoAttivita: function(utente,tempoAggiornato,dataGiornata) {
    aggiornaAttivita = repository.objects('Gior').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
        for (let p of aggiornaAttivita) {
            p.tempoAttivita = tempoAggiornato
        }
    })
  },

  findTempoLavoro: function(utente,dataGiornata) {
    // Se non è presente all'interno del DB la data cercata, allora ritorno come default il valore '000000'
    if (!repository.objects('Gior').filtered(" utente = '" + utente + "' && data = '" + dataGiornata + "'").length) 
        return '000000';

    trovaTempo = repository.objects('Gior').filtered('utente == $0 && data == $1',utente,dataGiornata);
    repository.write(() => {
      for (let p of trovaTempo) {
          tempoTrovato = p.tempoLavoro
      }
    })
    return tempoTrovato
  },

  findTempoAttivita: function(utente,dataGiornata) {
    // Se non è presente all'interno del DB la data cercata, allora ritorno come default il valore '000000'
    if (!repository.objects('Gior').filtered(" utente = '" + utente + "' && data = '" + dataGiornata + "'").length) 
        return '000000';

    trovaTempo = repository.objects('Gior').filtered('utente == $0 && data == $1',utente,dataGiornata);
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