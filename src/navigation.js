import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Calendar from './containers/calendar';

import styles from './globalstyles';

import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();
const headerTitleStyle = [styles.font22, styles.bold];


function Navigation() {
  var initialroute = global.initialroute
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialroute}>
        <Stack.Screen
          name="Calendar"
          component={Calendar}
          options={{ headerTitleStyle, title: 'Halaman Utama' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
