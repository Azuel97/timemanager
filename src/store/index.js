import Realm from 'realm';
 
let repository = new Realm({
    schema: [
        {
            name: 'Ute',
            properties: {
                name: 'string',
            }
        }
    ]
});
 
let Database = {
    getRepository: function(){
        console.log("db path: ", repository.path);
        return repository;
    }
};
 
module.exports = Database;