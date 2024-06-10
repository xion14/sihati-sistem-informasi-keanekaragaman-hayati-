import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const DB_NAME = 'db_sihati.db';
const TABLE_NAME = 'SIHATI';
let db;

const deleteDatabase = async () => {
  const dbPath = `${RNFS.DocumentDirectoryPath}/${DB_NAME}`;
  try {
    await RNFS.unlink(dbPath);
    console.log('Database deleted successfully');
  } catch (error) {
    console.log('Error deleting database: ', error);
  }
};

export const openOrCreateDatabase = () => {
  db = SQLite.openDatabase({ name: DB_NAME }, onSuccess, onError);
};

const onSuccess = () => {
  console.log('Database opened successfully');
  createTables(); // Ensure tables are created/checked when the database is opened
};

const onError = (error) => {
  if (error.code === 14) {
    console.log('Database does not exist. Creating a new one...');
    createDatabase();
  } else {
    console.log('Error opening database: ', error);
  }
};

const createDatabase = () => {
  db = SQLite.openDatabase({ name: DB_NAME, createFromLocation: '~db_sihati.db' }, onCreateSuccess, onError);
};

const onCreateSuccess = () => {
  console.log('Database created successfully');
  createTables();
};

export const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      openOrCreateDatabase(); // Open or create the database if it's not already opened
    }

    db.transaction((trans) => {
      trans.executeSql(
        query,
        params,
        (trans, results) => {
          resolve(results);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

const createTables = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      namalatin TEXT,
      namainggris TEXT,
      namaindonesia TEXT,
      namalokal TEXT,
      penyebaran TEXT,
      deskripsi TEXT,
      habitatdankebiasaan TEXT,
      statuskonversasi TEXT,
      image TEXT
    );
  `;
  executeQuery(createTableQuery)
    .then(() => {
      console.log('Table created successfully');
    })
    .catch((error) => {
      console.log('Error creating table: ', error);
    });
};

// Call createTables() function to create the table if it doesn't exist
createTables();

// Note: No need to call deleteDatabase() or dropTable() here
// This ensures that the database is not deleted if it exists and creates the table if it doesn't exist
