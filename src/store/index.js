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
            name: 'Giorn',
            properties: {
                utente: 'string',
                data: 'string',
                tempoAttivita: 'string',
                tempoLavoro: 'string',
                task: 'string[]'
            }
        }
    ],
    schemaVersion: 4,
});
 
let Database = {
    getRepository: function(){
        console.log("db path: ", repository.path);
        return repository;
    }
};
 
export default Database;