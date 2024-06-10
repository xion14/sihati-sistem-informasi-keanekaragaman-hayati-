import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import SQLite from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Primary_C } from './styles/Css';

const Home2 = ({ navigation }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [qrDataFromDB, setQrDataFromDB] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleScanQRCode = () => {
    setShowScanner(true);
  };

  const onSuccess = (e) => {
    console.log('Scan result:', e.data);
    setScannedData(e.data);
    setShowScanner(false);
    fetchQRDataFromDB(e.data);
  };

  const fetchQRDataFromDB = (qrData) => {
    const db = SQLite.openDatabase({ name: 'db_sihati.db' });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM SIHATI WHERE id = ?', [qrData], (tx, results) => {
        if (results.rows.length > 0) {
          const row = results.rows.item(0);
          setQrDataFromDB(row);
          setShowModal(true);
        } else {
          setQrDataFromDB(null);
          console.log('data tidak ditemukan')
          Alert.alert('Scanned not found', 'data tidak ditemukan')
        }
      });
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setShowScanner(false);
      };
    }, [])
  );

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {showScanner ? (
        <QRCodeScanner
          onRead={onSuccess}
          containerStyle={StyleSheet.absoluteFillObject}
          cameraStyle={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={styles.centeredContent}>
          <Icon name="qrcode-scan" size={50} color={Primary_C} />
          <Text style={styles.scanButtonText} onPress={handleScanQRCode}>
            Scan QR Code
          </Text>
        </View>
      )}

      <Modal visible={qrDataFromDB !== null} transparent animationType="fade">
        <ScrollView style={{flex:1}}>
        <View style={styles.fetchedDataContainer}>
          <Text style={styles.modalTitle}>Data Scanned</Text>
          {qrDataFromDB && (
            <View style={{ backgroundColor: 'white', width: '100%', alignItems: 'center', height: '50%', justifyContent: 'center' }}>
              
            <View style={{ backgroundColor: 'white', flexDirection: 'row' }}>
             
                <Text style={styles.profileText}>ID :{qrDataFromDB.id}</Text>
              </View>
              
              <View style={styles.profileHeader}>
                {qrDataFromDB.image && (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: qrDataFromDB.image }} style={styles.image} />
                  </View>
                )}

              </View>

             

              <View style={{ backgroundColor: 'white', width: '100%', alignItems: 'center' }}>
                <Text style={styles.profileText}>Nama latin : {qrDataFromDB.namalatin}</Text>
                <Text style={styles.profileText}>Nama inggris: {qrDataFromDB.namainggris}</Text>
                <Text style={styles.profileText}>Nama Indonesia: {qrDataFromDB.namaindonesia}</Text>
                <Text style={styles.profileText}>Nama lokal: {qrDataFromDB.namalokal}</Text>
                <Text style={styles.profileText}>Penyebaran : {qrDataFromDB.namapenyebaran}</Text>
                <Text style={styles.profileText}>Deskripsi : {qrDataFromDB.namadeskripsi}</Text>
                <Text style={styles.profileText}>Habitan Dan Kebiasaan : {qrDataFromDB.habitatdankebiasaan}</Text>
                <Text style={styles.profileText}>Status Konversasi : {qrDataFromDB.statuskonversi}</Text>

              </View>

              <View style={{ backgroundColor: 'white', flexDirection: 'row' }}>
                <Text style={styles.profileText}>Keterangan :</Text>
                <Text style={styles.profileText}>{qrDataFromDB.hewan}</Text>
              </View>


              <TouchableOpacity style={styles.closeButton} onPress={() => setQrDataFromDB(null)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>


            </View>

          )}

        </View>
        </ScrollView>
      </Modal>




    </View>
  );
};

const styles = StyleSheet.create({
  profileText: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 10,
    margin: 10
  },

  dataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  dataItem: {
    width: '48%', // Adjusted width to accommodate two items with a small gap between them
    marginVertical: 5,
    marginHorizontal: '1%', // Small margin between items
    paddingHorizontal: 8,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: Primary_C,
    marginTop: 10,
    fontSize: 16,
  },
  fetchedDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    opacity: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    marginBottom: 10,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  itemTouch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 10,
    elevation: 10,

  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,

  },
  textContainer: {
    justifyContent: 'center',
  },
  namaText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Primary_C,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Home2;
