import Realm from 'realm';
 
let repository = new Realm({
    schema: [
        {
            name: 'Ute',
            properties: {
                name: 'string',
                pwd: 'string'
            }
        }
    ],
    schemaVersion: 3,
});
 
let Database = {
    getRepository: function(){
        console.log("db path: ", repository.path);
        return repository;
    }
};
 
export default Database;