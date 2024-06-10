import React, { useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import Navigation from './Navigation/Navigation';

export default function App() {
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Navigation />
    </View>
  );
}
