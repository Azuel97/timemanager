import Database from '../index';
 
let repository = Database.getRepository();
 
let ProgettiService = {

    findAllProgetti: function(){
        progetti = repository.objects('Progett')
        project = []
        for (let p of progetti) {
                project.push(p.name)
        }
      return project
    },

    findTask: function(nomeProgetto) {
        // Altrimenti eseguo la query ed aggiungo il task al DB
        trovaTask = repository.objects('Progett').filtered('name == $0',nomeProgetto);
        taskTrovati = []
        for (let p of trovaTask) {
            count = p.task.length
            for(let i=0; i<count; i++){
                taskTrovati.push(p.task[i])
            }
        }
        return taskTrovati
    }

};

export default ProgettiService;