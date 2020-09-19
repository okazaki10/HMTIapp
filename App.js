/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { StatusBar, Alert } from 'react-native';
import Navigation from './src/navigation';
import AsyncStorage from '@react-native-community/async-storage';

global.initialroute = "Calendar"


function App() {
  const [sudah, setsudah] = React.useState(true);
  return (
    <>
    <StatusBar barStyle="dark-content" />
    {sudah ? <Navigation /> : null}
  </>
  );
};

export default App;
