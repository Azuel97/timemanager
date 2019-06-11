import Realm from 'realm';

// Schema del database
export const Ute = {
  name: 'Ute',
  properties: {
    name: 'string'
  }
};

const databaseOptions = {
  path: 'timemanager.realm',
  schema: [Ute],
  schemaVersion: 1,
}