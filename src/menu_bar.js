import 'react-native-gesture-handler';
import * as React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {  faHome, faCalendarAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import Feed from './containers/feed';
import Kalender from './containers/kalender';
import Notifikasi from './containers/notifikasi';

const Tab = createBottomTabNavigator();

function MenuBar() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: "#FFC261",
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Kalender"
        component={Kalender}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon icon={faCalendarAlt} size={22} color={color}></FontAwesomeIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Feed}
        options={{
          tabBarLabel: 'Feeds',
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon icon={faHome} size={28} color={color}></FontAwesomeIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Notifikasi"
        component={Notifikasi}
        options={{
          tabBarLabel: 'Activities',
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon icon={faBell} size={22} color={color}></FontAwesomeIcon>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MenuBar;
