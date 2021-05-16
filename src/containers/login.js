import React, { useState } from 'react';
import { View,  Image, Dimensions, ScrollView, ImageBackground, TouchableOpacity, ToastAndroid } from 'react-native';
import { Input, Text, Button } from 'react-native-elements';

import { colors } from '../globalstyles';

import style from '../globalstyles';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
function Login(props) {
    const { width: DEVICE_WIDTH } = Dimensions.get('window');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isipesan, setisipesan] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const storeData = async (key) => {
        try {
            await AsyncStorage.setItem('key', key)
            global.key = key
        } catch (e) {
            // saving error
        }
    }

    const login = () => {
        setspinner(true)
        fetch(global.url + '/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                device_name: "xavier"
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if (json.role == "colleger") {
                    global.status = 0
                    storeData(json.token)
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Menu_bar' }],
                    });
                } else if (json.role == "admin") {
                    global.status = 1
                    storeData(json.token)
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Menu_bar' }],
                    });
                } else {
                    toggleModal()
                    setisipesan("Email atau password salah")
                }
                setspinner(false)
            })
            .catch((error) => {
                console.error(error)
                ToastAndroid.show(error.message == "Network request failed" ? "Mohon nyalakan internet" : error.message, ToastAndroid.SHORT)
                setspinner(false)
            });
    };
    const [spinner, setspinner] = React.useState(false)
    return (
        <View style={style.main}>
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={{ color: '#FFF' }}
            />
            <Modal isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                onBackButtonPress={toggleModal}>
                <View style={style.content}>
                    <View>
                        <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={toggleModal}>
                            <FontAwesomeIcon icon={faTimes} size={22} color={"black"}></FontAwesomeIcon>
                        </TouchableOpacity>
                        <View style={{ alignItems: "center" }}>
                            <Image
                                source={require("../assets/image/exit.png")}
                                style={{ width: 50, height: 50 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={[style.nunitosans, { textAlign: "center", marginTop: 15 }]}>{isipesan}</Text>
                    </View>

                </View>
            </Modal>
            <ImageBackground
                source={{ uri: "https://www.polytec.com.au/img/products/960-960/white-magnetic.jpg" }}
                style={{ flex: 1 }}
                resizeMode="stretch">
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <Image
                            source={require("../assets/image/login.png")}
                            style={{ width: "100%", height: DEVICE_WIDTH * 0.75 }}
                            resizeMode="stretch"
                        />
                        <View style={{ flex: 1, marginTop: 10, padding: 22 }}>
                            <Text style={[style.poppinsbold, { textAlign: "center" }]}>Selamat Datang</Text>
                            <Text style={[style.nunitosans, { textAlign: "center", marginTop: 5 }]}>"Sekali masuk TI selamanya kita saudara"</Text>
                            <View style={{ marginTop: 20 }}>
                                <Input onChangeText={setemail} placeholder="Email" autoCapitalize="none"></Input>
                                <Input onChangeText={setpassword} placeholder="Kata sandi" secureTextEntry={true}></Input>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20, marginRight: 10, marginLeft: 10 }}>
                        <View style={{ justifyContent: "center", alignItems: "flex-start", flex: 1, marginLeft: 15 }}>
                            <Button title="Masuk" onPress={login} buttonStyle={style.button} titleStyle={{ color: colors.black, fontFamily: "NunitoSans-SemiBold", fontSize: 18 }}></Button>
                        </View>

                        <View style={{ justifyContent: "center", alignItems: "flex-end", flex: 1, marginRight: 15 }}>
                            <Button title="Lupa Password" onPress={() => { props.navigation.navigate("Forgotpassword") }} buttonStyle={[style.button, { backgroundColor: "red", width: 170 }]} titleStyle={{ color: "white", fontFamily: "NunitoSans-SemiBold", fontSize: 18 }}></Button>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default Login;
