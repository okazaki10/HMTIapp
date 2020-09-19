import React from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, Alert } from 'react-native';
import { Input, Text, Button } from 'react-native-elements';

import { LogBox } from 'react-native';
import globalstyles, { colors } from '../globalstyles';

LogBox.ignoreLogs([
  'Require cycle:',
  'Encountered two children with the same key',
  'VirtualizedLists',
  'Each child in a list should',
  'VirtualizedList',
  'Looks like'
]);


function Calendar(props) {
  const NavigateToLogin = () => props.navigation.navigate('Login');
  const NavigateToSignUp = () => props.navigation.navigate('Signup');
 
  return (
    <View >

      <View >
        <Text>Hi, Selamat datang di Meet Jasa!</Text>
        <Text >
          Apa yang kamu butuhkan hari ini? Yuk login dan cari tahu lebih lanjut,
          karena kamu #bisa bareng meet jasa.
        </Text>
       <Button title="sadasasd" buttonStyle={{backgroundColor:colors.primary}}></Button>
      </View>
    </View>
  );
};

export default Calendar;
