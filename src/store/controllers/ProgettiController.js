import Database from '../index';
 
let repository = Database.getRepository();
 
let ProgettiService = {

    findAllProgetti: function(){
        progetti = repository.objects('Proget')
        project = []
        for (let p of progetti) {
                project.push(p.name)
        }
      return project
    },

    findTask: function(nomeProgetto) {
        trovaTask = repository.objects('Proget').filtered('name == $0',nomeProgetto);
        taskTrovati = []
        for (let p of trovaTask) {
            count = p.task.length
            for(let i=0; i<count; i++){
                taskTrovati.push(p.task[i])
            }
        }
        return taskTrovati
    },

    // Salva task effettuati duarante la giornata
    saveTimerProgetto: function(nomeProgetto,tempoAggiornato) {
      salvaTimer = repository.objects('Proget').filtered('name == $0',nomeProgetto);
      timerTotale = 0     
      repository.write(() => {
      for (let p of salvaTimer) {
            // Controllo se il miotask da inserire è già esistente all'interno della lista dei task
            if(nomeProgetto === p.name){
              tempoTrovato = parseInt(p.timer)
              console.log(tempoTrovato)
              tempoAgg = parseInt(tempoAggiornato)
              console.log(tempoAgg)
              tran = parseInt(p.timer)
              aggiornaTempo = (tempoAgg - tempoTrovato)
              tran += aggiornaTempo
              p.timer = tran.toString()
              console.log(p.timer)
              return true
            }
          }
        aggiornaTempo = parseInt(tempoAggiornato - p.timer)
        console.log(aggiornaTempo)
        if((aggiornaTempo >=90) && (aggiornaTempo <=100) )
          aggiornaTempo -= 40
        else if((aggiornaTempo >=80) && (aggiornaTempo <=90) )
          aggiornaTempo -= 30
        else if((aggiornaTempo >=70) && (aggiornaTempo <=80) )
          aggiornaTempo -= 20
        else if((aggiornaTempo >=60) && (aggiornaTempo <=70) )
          aggiornaTempo -= 10
        p.timer = aggiornaTempo.toString()
    })
    return false
  },

};

export default ProgettiService;