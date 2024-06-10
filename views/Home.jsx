import React, { useState, useEffect } from 'react';
import { View, Alert, PermissionsAndroid, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput, BackHandler, ScrollView } from 'react-native';
import SearchBar from './SearchBar'; // Assuming SearchBar component is in a separate file
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Gambar from '../assets/img/splash.jpg';
import Camera from '../assets/img/camera.png'
import * as ImagePicker from 'react-native-image-picker';
import { openDatabase, createTables, executeQuery, openOrCreateDatabase } from '../Sqlite/Sqlite'; // Replace with your database manager file path
import SQLite from 'react-native-sqlite-storage';
import { Primary_C } from './styles/Css';
import ExitAppHOC from './ExitAppHOC';

const Home = () => {
  const [data, setData] = useState([]); //variabel data dalang bentuk json parameter

  ExitAppHOC(); // Use the useExitApp hook


  const [filteredData, setFilteredData] = useState();

  // Function to fetch data from SQLite and update state
  const fetchDataFromSQLite = () => {
    const db = SQLite.openDatabase({ name: 'db_sihati.db' });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM SIHATI', [], (tx, results) => {
        const rows = results.rows.raw(); // Retrieve rows as plain JavaScript objects
        console.log('Fetched rows:', rows); // Log fetched rows
        setData(rows); // Update state with fetched data
        setFilteredData(rows); // Update state with fetched data
      });
    });
  };

  useEffect(() => {
    openOrCreateDatabase(); // Open the database when the component mounts
    fetchDataFromSQLite();
  }, []);

  const [capturedImage, setCapturedImage] = useState();


  // Function to handle image selection/capture
  const handleImageSelection = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchCamera({ mediaType: 'photo', includeBase64: false }, async (response) => {
          if (response.didCancel) {
            console.log('User cancelled camera picker');
          } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else {
            const newImageUri = response.assets[0].uri;
            setCapturedImage(newImageUri);
            setSelectedItemForEdit((prevItem) => ({
              ...prevItem,
              image: newImageUri,
            }));
            console.log('camera response array', newImageUri);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };



  const [showModal, setShowModal] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);


  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);

  const [newData, setNewData] = useState({
    id: '', // You can generate a new unique ID when adding new data
    namalatin: '',
    namainggris: '',
    namaindonesia: '',
    namalokal: '',
    penyebaran: '',
    deskripsi: '',
    habitatdankebiasaan: '',
    statuskonversasi: '',
    image: capturedImage, // Assuming the default image is provided
  });

  const refreshData = () => {
    fetchDataFromSQLite(); // Function to fetch data from SQLite and update state
  };

  // Function to handle adding new data
  const handleAddData = () => {
    if (newData.namalatin && newData.namainggris && newData.namaindonesia && newData.namalokal && newData.penyebaran && newData.deskripsi && newData.habitatdankebiasaan && newData.statuskonversasi && capturedImage) {
      // Execute SQL INSERT query
      const insertQuery = `
        INSERT INTO SIHATI (namalatin,namainggris,namaindonesia,namalokal,penyebaran,deskripsi,habitatdankebiasaan, statuskonversasi,image)
        VALUES (?, ?, ?,?,?,?,?,?,?);
      `;
      const insertParams = [newData.namalatin, newData.namainggris, newData.namaindonesia, newData.namalokal, newData.penyebaran, newData.deskripsi, newData.habitatdankebiasaan, newData.statuskonversasi, capturedImage];

      executeQuery(insertQuery, insertParams)
        .then(() => {
          console.log('Data inserted into SQLite database');
          // Reset newData state here if needed
          setNewData({
            id: '',
            namalatin: '',
            namainggris: '',
            namaindonesia: '',
            namalokal: '',
            penyebaran: '',
            deskripsi: '',
            habitatdankebiasaan: '',
            statuskonversasi: '',
            image: Gambar, // Assuming the default image is provided
          });
          setShowModal(false);
          refreshData(); // Call the refreshData function to update the FlatList
        })
        .catch((error) => {
          console.log('Error inserting data: ', error);
        });
    } else {
      console.log('Please fill in all fields and capture an image');
    }
  };


  function PILIH(item) {
    // Set the selected item's data to populate the modal fields
    setNewData({
      id: item.id,
      namalatin: item.namalatin,
      namainggris: item.namainggris,
      namaindonesia: item.namaindonesia,
      namalokal: item.namalokal,
      penyebaran: item.penyebaran,
      deskripsi: item.deskripsi,
      habitatdankebiasaan: item.habitatdankebiasaan,
      statuskonversasi: item.statuskonversasi,
      image: item.image,
    });
    console.log('id data :', item.id)
    // Show the modal
    setShowModalDetail(true);
  }



  function handleEdit(item) {
    setSelectedItemForEdit(item); // Set the selected item for editing
    setShowEditModal(true); // Open the edit modal
  }

  //delet function
  function handleDelete(item) {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${item.nama}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const deleteQuery = `
              DELETE FROM SIHATI
              WHERE id = ?;
            `;

            const deleteParams = [item.id]; // Assuming 'id' is the primary key of the table

            executeQuery(deleteQuery, deleteParams)
              .then(() => {
                console.log(`Successfully deleted item with id ${item.id} from SQLite database`);
                refreshData(); // Refresh the data after deletion
              })
              .catch((error) => {
                console.log('Error deleting data: ', error);
              });
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  }




  // Function to update the selected item's data
  const handleUpdateData = () => {
    if (selectedItemForEdit) {
      if (selectedItemForEdit.namalatin && selectedItemForEdit.namainggris && selectedItemForEdit.namaindonesia && selectedItemForEdit.namalokal && selectedItemForEdit.penyebaran && selectedItemForEdit.deskripsi && selectedItemForEdit.habitatdankebiasaan && selectedItemForEdit.statuskonversasi && capturedImage) {
        const updateQuery = `
          UPDATE SIHATI 
          SET namalatin=?, namainggris=?, namaindonesia=?, namalokal=?, penyebaran=?,deskripsi=?,habitatdankebiasaan=?,statuskonversasi=?, image=?
          WHERE id=?;
        `;
        const updateParams = [selectedItemForEdit.namalatin, selectedItemForEdit.namainggris, selectedItemForEdit.namaindonesia, selectedItemForEdit.namalokal, selectedItemForEdit.penyebaran, selectedItemForEdit.deskripsi, selectedItemForEdit.habitatdankebiasaan, selectedItemForEdit.statuskonversasi, capturedImage, selectedItemForEdit.id];

        executeQuery(updateQuery, updateParams)
          .then(() => {
            console.log('Data updated in SQLite database');
            // Reset state and close the modal
            setSelectedItemForEdit(null);
            setShowEditModal(false);
            refreshData(); // Refresh the data after updating
          })
          .catch((error) => {
            console.log('Error updating data: ', error);
          });
      } else {
        console.log('Please fill in all fields and capture an image');
      }
    }
  };



  //render item part
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity style={styles.itemTouch} onPress={() => PILIH(item)} onLongPress={() => handleDelete(item)}>
        <View style={styles.itemContent}>
          <View style={styles.imageContainer}>
            {item.image ? ( // Check if item.image is available and it is a string
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <Text>No Image</Text> // Placeholder if the image is not available
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.namaText}>Nama: {item.namalatin}</Text>
            <Text style={styles.detailText}>Kingdom: {item.deskripsi}</Text>
            {/* Other details */}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <Icon name="pencil" size={24} color="#e74c3c" style={styles.icon} onPress={() => handleEdit(item)} />
      </View>
    </View>
  );




  return (


    <View style={styles.container}>
      <SearchBar data={data} setFilteredData={setFilteredData} />


      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => {
        setNewData({
          id: '',
          namalatin: '',
          namainggris: '',
          namaindonesia: '',
          namalokal: '',
          penyebaran: '',
          deskripsi: '',
          habitatdankebiasaan: '',
          statuskonversasi: '',
          image: null, // Resetting newData state to empty
        });
        setShowModal(true);
      }}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      {/* Modal for adding new data */}
      <Modal visible={showModal} transparent animationType="slide">
        <ScrollView style={styles.ScrollContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Add New Data</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Latin"
              value={newData.namalatin}
              onChangeText={(text) => setNewData({ ...newData, namalatin: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Nama Inggris"
              value={newData.namainggris}
              onChangeText={(text) => setNewData({ ...newData, namainggris: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Nama Indonesia"
              value={newData.namaindonesia}
              onChangeText={(text) => setNewData({ ...newData, namaindonesia: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Nama Lokal"
              value={newData.namalokal}
              onChangeText={(text) => setNewData({ ...newData, namalokal: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Penyebaran"
              value={newData.penyebaran}
              onChangeText={(text) => setNewData({ ...newData, penyebaran: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Deskripsi"
              value={newData.deskripsi}
              onChangeText={(text) => setNewData({ ...newData, deskripsi: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Habitat dan Kebiasaan"
              value={newData.habitatdankebiasaan}
              onChangeText={(text) => setNewData({ ...newData, habitatdankebiasaan: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Status Konservasi"
              value={newData.statuskonversasi}
              onChangeText={(text) => setNewData({ ...newData, statuskonversasi: text })}
            />

            {/* Button to select/take picture */}
            {capturedImage ? (
              <Image
                source={{ uri: capturedImage }}
                style={styles.capturedImage}
              />
            ) : (
              <Text style={styles.takePictureText}>Take Picture</Text>
            )}

            <TouchableOpacity style={styles.addButtonModal} onPress={handleImageSelection}>
              <Text style={styles.addButtonText}>Take Picture</Text>
            </TouchableOpacity>

            {/* Button to add new data */}
            <TouchableOpacity style={styles.addButtonModal} onPress={handleAddData}>
              <Text style={styles.addButtonText}>Add Data</Text>
            </TouchableOpacity>

            {/* Button to close the modal */}
            <TouchableOpacity style={styles.closeButtonModal} onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Detail modal */}
      <Modal visible={showModalDetail} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Detail Data</Text>

            {/* Display selected image if available */}
            {newData.image ? (
              <Image source={{ uri: newData.image }} style={styles.capturedImage} />
            ) : (
              <Text style={styles.takePictureText}>No Image</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Nama Latin"
              value={newData.namalatin}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Nama Inggris"
              value={newData.namainggris}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Nama Indonesia"
              value={newData.namaindonesia}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Nama Lokal"
              value={newData.namalokal}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Penyebaran"
              value={newData.penyebaran}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Deskripsi"
              value={newData.deskripsi}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Habitat dan Kebiasaan"
              value={newData.habitatdankebiasaan}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Status Konservasi"
              value={newData.statuskonversasi}
              editable={false}
            />

            {/* Button to close the modal */}
            <TouchableOpacity style={styles.closeButtonModal} onPress={() => setShowModalDetail(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Edit Modal */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.modalContainer}>
            <View style={styles.editModalContent}>
              <Text style={styles.modalText}>Edit Data</Text>

              <TextInput
                style={styles.input}
                placeholder="Edit Nama Latin"
                value={selectedItemForEdit?.namalatin}
                onChangeText={(text) =>
                  setSelectedItemForEdit((prevItem) => ({
                    ...prevItem,
                    namalatin: text,
                  }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Edit Nama Inggris"
                value={selectedItemForEdit?.namainggris}
                onChangeText={(text) =>
                  setSelectedItemForEdit((prevItem) => ({
                    ...prevItem,
                    namainggris: text,
                  }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Edit Nama Indonesia"
                value={selectedItemForEdit?.namaindonesia}
                onChangeText={(text) =>
                  setSelectedItemForEdit((prevItem) => ({
                    ...prevItem,
                    namaindonesia: text,
                  }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Edit Nama Lokal"
                value={selectedItemForEdit?.namalokal}
                onChangeText={(text) =>
                  setSelectedItemForEdit((prevItem) => ({
                    ...prevItem,
                    namalokal: text,
                  }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Edit Penyebaran"
                value={selectedItemForEdit?.penyebaran}
                onChangeText={(text) =>
                  setSelectedItemForEdit((prevItem) => ({
                    ...prevItem,
                    penyebaran: text,
                  }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Edit Deskripsi"
                value={selectedItemForEdit?.deskripsi}
                onChangeText={(text) =>
                  setSelectedItemForEdit((prevItem) => ({
                    ...prevItem,
                    deskripsi: text,
                  }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Edit Habitat dan Kebiasaan"
                value={selectedItemForEdit?.habitatdankebiasaan}
                onChangeText={(text) =>
                  setSelectedItemForEdit((prevItem) => ({
                    ...prevItem,
                    habitatdankebiasaan: text,
                  }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Edit Status Konservasi"
                value={selectedItemForEdit?.statuskonversasi}
                onChangeText={(text) =>
                  setSelectedItemForEdit((prevItem) => ({
                    ...prevItem,
                    statuskonversasi: text,
                  }))
                }
              />



              {/* Display selected image if available */}
              {selectedItemForEdit?.image ? (
                <Image source={{ uri: selectedItemForEdit.image }} style={styles.capturedImage} />
              ) : (
                <Text style={styles.takePictureText}>No Image</Text>
              )}

              {/* Button to take a new picture */}
              <TouchableOpacity style={styles.addButtonModal} onPress={handleImageSelection}>
                <Text style={styles.addButtonText}>Take New Picture</Text>
              </TouchableOpacity>

              {/* Button to update data */}
              <TouchableOpacity style={styles.addButtonModal} onPress={handleUpdateData}>
                <Text style={styles.addButtonText}>Update Data</Text>
              </TouchableOpacity>

              {/* Button to close the edit modal */}
              <TouchableOpacity style={styles.closeButtonModal} onPress={() => setShowEditModal(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>




      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  editModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  editModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  editCapturedImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  editTakePictureText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  editAddButtonModal: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editAddButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  editCloseButtonModal: {
    marginTop: 10,
  },
  editCloseButtonText: {
    color: '#007bff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  capturedImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start', // Align items at the top
    alignItems: 'stretch', // Stretch to fill the width
    padding: 10
  },
  item2: {
    backgroundColor: '#99df99',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
  },
  item: {
    backgroundColor: '#99df99',
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
    flexDirection: 'row', // Updated to row layout
    alignItems: 'center', // Center items vertically
    paddingHorizontal: 16,
  },
  itemTouch: {
    backgroundColor: '#99df99',
    width: wp('70%'),
    flexDirection: 'row', // Updated to row layout
    alignItems: 'center', // Center items vertically
    paddingHorizontal: 16,
  },
  iconContainer: {
    flexDirection: 'column',
    marginRight: 16,
    margin: 10
  },
  icon: {
    marginHorizontal: 8,
    color: '#27ae60', // Set icon color to match the namaText style
    paddingVertical: 10
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  namaText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  // Add Button Styles
  addButton: {
    backgroundColor: Primary_C,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },


  // Modal Styles


  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },

  //new
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  ScrollContainer: {
    flex: 1,

    backgroundColor: 'white',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  addButtonModal: {
    backgroundColor: '#3498db',
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButtonModal: {
    backgroundColor: '#e74c3c',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '80%',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
