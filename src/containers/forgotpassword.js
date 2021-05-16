import React, { useState } from 'react';
import { View,  Image, Dimensions, ScrollView,  ImageBackground } from 'react-native';
import { Input, Text, Button } from 'react-native-elements';

import  { colors } from '../globalstyles';

import style from '../globalstyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { TouchableOpacity } from 'react-native-gesture-handler';

import Spinner from 'react-native-loading-spinner-overlay';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';
function Forgotpassword(props) {
  
    const [email, setemail] = useState("")

    const ketoken = () => {
        setspinner(true)
        fetch(global.url + '/forgot-password', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                setspinner(false)
                if (json.errors) {
                    setisipesan2(json.errors.email)
                    toggleModal3()
                } else {
                    setisipesan2(json.message)
                    setshowerrorkah(false)
                    toggleModal3()
                    props.navigation.navigate("Checktoken",{email:email})
                }
            })
            .catch((error) => {
                console.error(error)
                setspinner(false)
            });
    };
    const [isipesan2, setisipesan2] = useState("")
    const toggleModal3 = () => {
        setModalVisible3(!isModalVisible3);
    };
    const [isModalVisible3, setModalVisible3] = useState(false);
    const [showerrorkah,setshowerrorkah] = useState(true)
    const [spinner, setspinner] = React.useState(false)
    return (
        <View style={style.main}>
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={{ color: '#FFF' }}
            />
            <Modal isVisible={isModalVisible3}
                onBackdropPress={toggleModal3}
                onBackButtonPress={toggleModal3}>
                <View style={style.content}>
                    <View>
                        <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={toggleModal3}>
                            <FontAwesomeIcon icon={faTimes} size={22} color={"black"}></FontAwesomeIcon>
                        </TouchableOpacity>
                        {showerrorkah?(  <View style={{ alignItems: "center" }}>
                            <Image
                                source={require("../assets/image/exit.png")}
                                style={{ width: 50, height: 50 }}
                                resizeMode="contain"
                            />
                        </View>):(null)}
                        <Text style={[style.nunitosans, { textAlign: "center", marginTop: 15 }]}>{isipesan2}</Text>
                    </View>
                </View>
            </Modal>
            <ImageBackground
                source={require("../assets/image/header.png")}
                style={{ height: 71, width: "100%" }}
                resizeMode="stretch"
            >
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 30, marginRight: 30 }}>
                    <Text style={[style.poppinsbold, { color: "white", fontSize: 20, textAlign: "center", flex: 1 }]}>Lupa Password</Text>
                </View>
            </ImageBackground>
            <ScrollView>
                <View style={{ marginTop: 15, marginRight: 10, marginLeft: 10 }}>
                    <Input placeholder="Masukan Email" onChangeText={setemail} autoCapitalize={"none"}></Input>
                </View>
            </ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20, marginRight: 10, marginLeft: 10 }}>
                <View style={{ justifyContent: "center", alignItems: "center", flex: 1, marginLeft: 15 }}>
                    <Button title="Lanjut" onPress={ketoken} buttonStyle={style.button} titleStyle={{ color: colors.black, fontFamily: "NunitoSans-SemiBold", fontSize: 18 }}></Button>
                </View>
            </View>

        </View>
    );
};

export default Forgotpassword;
