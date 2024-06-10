import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import SQLite from 'react-native-sqlite-storage';
import Share from 'react-native-share'; // Import Share from react-native-share
import { Primary_C } from './styles/Css';

const Home3 = () => {
  const [data, setData] = useState([]);

  // Create or open your database
  const db = SQLite.openDatabase(
    { name: 'db_sihati.db', location: 'default' },
    () => {
      console.log('Database opened successfully.');
    },
    error => {
      console.error('Error opening database:', error);
    }
  );

  // Function to fetch data from SQLite and store it in state
  const fetchDataFromSQLite = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SIHATI', // Replace 'your_table_name' with your table name
        [],
        (_, { rows }) => {
          const fetchedData = rows.raw(); // Extracting fetched data
          setData(fetchedData);
        },
        (_, error) => {
          console.log('Error:', error);
        }
      );
    });
  };

  useEffect(() => {
    fetchDataFromSQLite(); // Fetch data when component mounts
  }, []);

  // Function to handle downloading data into an Excel file
  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DataSheet');

    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
    const fileUri = RNFS.ExternalDirectoryPath + '/data.xlsx';

    RNFS.writeFile(fileUri, wbout, 'ascii')
      .then(() => {
        console.log('File downloaded successfully!');
        // Open the downloaded file using react-native-share
        Share.open({ url: `file://${fileUri}` })
          .then(res => {
            console.log('File opened:', res);
          })
          .catch(err => {
            console.error('Error opening file:', err);
          });
      })
      .catch(error => {
        console.error('Error downloading file: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Download Excel File</Text>
      <Text style={styles.description}>
        Tap the button below to download the SQLite data as an Excel file.
      </Text>
      <TouchableOpacity onPress={handleDownload} style={styles.button}>
        <Text style={styles.buttonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#777',
  },
  button: {
    backgroundColor: Primary_C,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Home3;
