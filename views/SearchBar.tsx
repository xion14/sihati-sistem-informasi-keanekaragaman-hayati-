import React, { useState } from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons from react-native-vector-icons

export default function SearchBar({ data, setFilteredData }) {
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = query => {
  setSearchQuery(query);
  // Filter the data based on the search query
  const filtered = data.filter(item =>
    item.namalatin.toLowerCase().includes(query.toLowerCase()) ||
    item.namainggris.toLowerCase().includes(query.toLowerCase()) ||
    item.namaindonesia.toLowerCase().includes(query.toLowerCase()) ||
    item.namalokal.toLowerCase().includes(query.toLowerCase()) ||
    item.penyebaran.toLowerCase().includes(query.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(query.toLowerCase()) ||
    item.habitatdankebiasaan.toLowerCase().includes(query.toLowerCase()) ||
    item.statuskonversasi.toLowerCase().includes(query.toLowerCase())
  );
  setFilteredData(filtered); // Pass the filtered data to the parent component
};


  return (
    <View style={{width: '100%'}}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        icon={() => <Icon name="magnify" size={24} />} // Search Icon
        style={{
          backgroundColor:'rgba(204, 239, 204, 0.8)',
          borderRadius:20,
          borderColor:'red', 
          marginBottom:10
        }}
      />
    </View>
  );
}
