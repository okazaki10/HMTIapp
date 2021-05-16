/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useState } from 'react';
import { StatusBar, View, Dimensions, Image,  ImageBackground, ToastAndroid } from 'react-native';
import Navigation from './src/navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Require cycle:',
  'Encountered two children with the same key',
  'VirtualizedLists',
  'Each child in a list should',
  'VirtualizedList',
  'Looks like'
]);
global.url = "https://backend.hmti-its.com/api";
global.initialroute = "Mainpage"
global.status = 0
global.key = "";
global.user_id = "";
global.guide = "1";

function App() {
  const { width: DEVICE_WIDTH } = Dimensions.get('window');
  const [sudah, setsudah] = useState(false);
  const authorize = (key) => {
    fetch(global.url + "/user", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + key,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        if (json.role == "colleger") {
          global.status = 0
          global.initialroute = "Menu_bar"
        } else if (json.role == "admin") {
          global.status = 1
          global.initialroute = "Menu_bar"
        } else {
          if (global.guide == "0") {
            global.initialroute = "Login";
          } else {
            global.initialroute = "Mainpage";
          }
        }
        setTimeout(() => {
          setsudah(true)
        }, 500);
      })
      .catch((error) => {
        console.error(error)
        ToastAndroid.show(error.message == "Network request failed" ? "Mohon nyalakan internet" : error.message, ToastAndroid.SHORT)
      });
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('key')
      const guide = await AsyncStorage.getItem('guide')
      console.log(guide)
      global.guide = guide
      if (value !== null) {
        authorize(value)
        global.key = value
      } else {
        authorize("asdafasaasd")
      }

    } catch (e) {
      // error reading value
    }
  }
  useState(() => {
    getData()
  })
  return (
    <>
      <StatusBar barStyle="dark-content" />
      {sudah ? (<Navigation />) : (
        <View>
          <ImageBackground
            source={require("./src/assets/image/splash.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="stretch"
          >
            <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
              <Image
                source={require("./src/assets/image/LOGO_HMTI.png")}
                style={{ width: 300, height: 200 }}
                resizeMode="contain"
              ></Image>
            </View>
          </ImageBackground>

        </View>)}
    </>
  );
};

export default App;
