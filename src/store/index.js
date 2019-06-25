import Realm from 'realm';
 
let repository = new Realm({
    schema: [
        {
            name: 'Ute',
            properties: {
                name: 'string',
                pwd: 'string'
            }
        },
        {
            name: 'Gior',
            properties: {
                utente: 'string',
                data: 'string',
                tempoAttivita: 'string',
                tempoLavoro: 'string',
                task: 'string[]',
                tranche: 'string[]'
            }
        },
        {
            name: 'Proget',
            primaryKey : 'id',
            properties: {
                id: 'int',
                name: 'string',
                task: 'string[]',
                timer: 'string'
            }
        }
    ],
    schemaVersion: 5,
});
 
let Database = {
    getRepository: function(){
        console.log("db path: ", repository.path);
        return repository;
    }
};
 
export default Database;