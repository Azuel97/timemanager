
class User {
    get name() {
        return this.name;
    }
    get passwd() {
        return this.passwd;
    }
  }
  
User.schema = {
    name: 'User',
    properties: {
      name: 'string',
      passwd: 'string'
    }
  };