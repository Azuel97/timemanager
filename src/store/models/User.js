import Realm from 'realm';
import { newExpression } from '@babel/types';
export const USERS_SCHEMA = "Users"

// Define the model
export const UsersSchema = {
  name: USERS_SCHEMA,
  primaryKey: 'uuid',
  properties: {
    uuid: 'int',  // PK
    name: 'string',
    passwd: 'string'
  } 
}

const databaseOptions = {
  path: 'timemanager.realm',
  schema: [UsersSchema],
  schemaVersion: 1,
}

// Function for UsersSchema
export const getUser = (uuid) => {
  const User = realm.objectForPrimaryKey(USERS_SCHEMA, uuid)
  return User
}

export default realm = new Realm(databaseOptions);