import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';

const ExitAppHOC = WrappedComponent => {
  const ExitAppWrapper = props => {
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

    return <WrappedComponent {...props} />;
  };

  return ExitAppWrapper;
};

export default ExitAppHOC;
