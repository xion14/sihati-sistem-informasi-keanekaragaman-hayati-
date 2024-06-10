import React from 'react';
import { View, Text, StyleSheet, BackHandler, Alert } from 'react-native';

const Home4 = () => {
  const handleExitApp = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      { cancelable: false }
    );
  };

  // Hook to handle the hardware back button press
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleExitApp();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About SIHATI App</Text>
      <Text style={styles.description}>
        SIHATI is an amazing app that provides information about various animals.
        This app helps users to explore details about different species, including their names, categories, and more.
        It is designed to offer an enjoyable learning experience about the animal kingdom.
      </Text>
      {/* You can add more information or sections about your app here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Home4;
