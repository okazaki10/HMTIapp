import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



import styles from './globalstyles';


import Mainpage from './containers/mainpage';
import Login from './containers/login';
import MenuBar from './menu_bar';
import Feeditem from './containers/feeditem';
import Profil from './containers/profil';
import Tambahfeed from './containers/tambahfeed';

import Tambahkalender from './containers/tambahkalender';
import Forgotpassword from './containers/forgotpassword';
import Checktoken from './containers/checktoken';
import Changepassword from './containers/changepassword';

const Stack = createStackNavigator();
const headerTitleStyle = [styles.font22, styles.bold];


function Navigation() {
  var initialroute = global.initialroute
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialroute}>
      <Stack.Screen
          name="Mainpage"
          component={Mainpage}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="Menu_bar"
          component={MenuBar}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="Feeditem"
          component={Feeditem}
          options={{ headerShown:false }}
        />
         <Stack.Screen
          name="Profil"
          component={Profil}
          options={{ headerShown:false }}
        />
          <Stack.Screen
          name="Tambahfeed"
          component={Tambahfeed}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="Tambahkalender"
          component={Tambahkalender}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="Forgotpassword"
          component={Forgotpassword}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="Checktoken"
          component={Checktoken}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="Changepassword"
          component={Changepassword}
          options={{ headerShown:false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
