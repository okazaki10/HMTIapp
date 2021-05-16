import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, Alert, ImageBackground, Keyboard } from 'react-native';
import {  Text, Button } from 'react-native-elements';

import { colors } from '../globalstyles';

import style from '../globalstyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {  faTimes } from '@fortawesome/free-solid-svg-icons';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';

function Tambahfeed(props) {

    const [options, setoptions] = useState({
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        quality: 0.5
    })
    const [gambar, setgambar] = useState("")
    const [hide, sethide] = useState(true)
    const [gambarstring, setgambarstring] = useState("")
    const [judul, setjudul] = useState("")
    const [description, setdescription] = useState("")
    const { feedsid, type, gambar2, judul2, description2 } = props.route.params ? props.route.params : "1"
    const showcamera = () => {

        ImagePicker.launchCamera(options, (response) => {
            if (response.error) {
                Alert.alert(response.error)
            } else {
                console.log(response.uri)
                if (response.uri) {
                    sethide(false)
                    setgambar(response.uri)
                    setgambarstring(response.data)
                }
            }
        });

    }
    const showimage = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.error) {
                Alert.alert(response.error)
            } else {
                console.log(response.uri)
                if (response.uri) {
                    sethide(false)
                    setgambar(response.uri)
                    setgambarstring(response.data)
                }
            }
        });
    }
    const keyboardshow = () => {
        console.log("show")

        sethide(true)
    }
    const keyboardhide = () => {
        console.log("hide")

        sethide(false)
    }
    const addfeed = () => {
        if (type == "2") {
            updatefeed()
        }else if (judul == "" || description == "") {
            setisipesan2("Data tidak boleh ada yang kosong")
            toggleModal3()
        } else if (gambarstring == "") {
            setisipesan2("Gambar tidak boleh kosong")
            toggleModal3()
        } else {
            setspinner(true)
            fetch(global.url + '/feed/post', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + global.key,
                },
                body: JSON.stringify({
                    image_strings: gambarstring,
                    title: judul,
                    caption: description,
                    day_of_week: "z"
                })
            })
                .then((response) => response.json())
                .then((json) => {
                    console.log(json)
                    //console.log(gambarstring)
                    setspinner(false)
                    if (!json.errors) {
                        props.navigation.reset({
                            index: 0,
                            routes: [{ name: 'Menu_bar' }],
                        });
                    } else {
                        Alert.alert(json.message)
                    }
                })
                .catch((error) => {
                    console.error(error)
                    setspinner(false)
                });
        }
    };
    const updatefeed = () => {
        setspinner(true)
        fetch(global.url + '/feed/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.key,
            },
            body: JSON.stringify({
                feed_id: feedsid,
                image_strings: gambarstring,
                title: judul,
                caption: description,
                day_of_week: "asdfasaasd"
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                //console.log(gambarstring)
                setspinner(false)
                if (!json.errors) {
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Menu_bar' }],
                    });
                } else {
                    Alert.alert(json.message)
                }
            })
            .catch((error) => {
                console.error(error)
                setspinner(false)
            });
    };

    useEffect(() => {
        const keyboardshowlistener = Keyboard.addListener('keyboardDidShow', keyboardshow)
        const keyboardhidelistener = Keyboard.addListener('keyboardDidHide', keyboardhide)
        return () => {
            keyboardshowlistener.remove()
            keyboardhidelistener.remove()
        }
    })
    const [spinner, setspinner] = React.useState(false)
    useState(() => {
        if (type == "2") {
            sethide(false)
            setgambar(gambar2)
            setjudul(judul2)
            setdescription(description2)
        }
    })
    const [isipesan2, setisipesan2] = useState("")
    const toggleModal3 = () => {
        setModalVisible3(!isModalVisible3);
    };
    const [isModalVisible3, setModalVisible3] = useState(false);
    const [showerrorkah, setshowerrorkah] = useState(true)
    return (
        <View style={style.main}>
            <Modal isVisible={isModalVisible3}
                onBackdropPress={toggleModal3}
                onBackButtonPress={toggleModal3}>
                <View style={style.content}>
                    <View>
                        <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={toggleModal3}>
                            <FontAwesomeIcon icon={faTimes} size={22} color={"black"}></FontAwesomeIcon>
                        </TouchableOpacity>
                        {showerrorkah ? (<View style={{ alignItems: "center" }}>
                            <Image
                                source={require("../assets/image/exit.png")}
                                style={{ width: 50, height: 50 }}
                                resizeMode="contain"
                            />
                        </View>) : (null)}
                        <Text style={[style.nunitosans, { textAlign: "center", marginTop: 15 }]}>{isipesan2}</Text>
                    </View>
                </View>
            </Modal>
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={{ color: '#FFF' }}
            />
            <ImageBackground
                source={require("../assets/image/header.png")}
                style={{ height: 71, width: "100%" }}
                resizeMode="stretch"
            >
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 30, marginRight: 30 }}>

                    <Text style={[style.poppinsbold, { color: "white", fontSize: 20, textAlign: "center", flex: 1 }]}>Feeds</Text>

                </View>
            </ImageBackground>
            <ScrollView>
                <View style={style.container}>

                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <Ionicons name={'close'} size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 6, alignItems: "center" }}>
                        {!hide && gambar != "" ? (<Image
                            source={{ uri: gambar == "" ? "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg" : gambar }}
                            style={{ width: "65%", height: 150 }}
                            resizeMode="contain"
                        ></Image>) : (null)}
                    </View>
                    <View>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput onChangeText={setjudul} placeholder={"Judul"} value={judul} style={[style.poppinsmedium, { flex: 1, marginTop: 5 }]}></TextInput>

                        </View>

                        <TextInput onChangeText={setdescription} placeholder={"Deskripsi"} value={description} style={[style.nunitosans, { maxHeight: 200 }]} multiline={true}></TextInput>

                    </View>

                </View>
            </ScrollView>
            <View style={{ alignItems: "flex-end", marginRight: 15 }}>
                <Button title="Simpan" onPress={addfeed} buttonStyle={[style.button, { height: 30, width: 100 }]} titleStyle={{ color: colors.black, fontFamily: "NunitoSans-SemiBold", fontSize: 14 }}></Button>
            </View>
            <View style={[style.line]}></View>

            <View style={{ flexDirection: "row", height: 50, alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={showcamera} style={{ alignItems: "center" }}>
                        <Ionicons name={'camera'} size={28} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={showimage} style={{ alignItems: "center" }}>
                        <Ionicons name={'image'} size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Tambahfeed;


const styles = StyleSheet.create({
    buttonblue: {
        backgroundColor: colors.primary, borderRadius: 50, marginRight: 40, marginLeft: 40, marginBottom: 20
    },
    fontsbold: {
        fontSize: 15,
        fontFamily: "Raleway-Bold",
    },
    fontsregular: {
        fontSize: 14,
        fontFamily: "Raleway-Regular",
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,

    },
    scrollableModal: {
        height: 300,
    },
    scrollableModalContent1: {
        height: 200,
        backgroundColor: '#87BBE0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollableModalText1: {
        fontSize: 20,
        color: 'white',
    },
    scrollableModalContent2: {
        height: 200,
        backgroundColor: '#A9DCD3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollableModalText2: {
        fontSize: 20,
        color: 'white',
    },
    isigender2: {
        backgroundColor: '#fff',
        height: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    harga2: {
        backgroundColor: '#fff',
        height: 70,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    isigender: {
        backgroundColor: colors.primary,
        height: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    isibutton2: {
        backgroundColor: '#fff',
        height: 70,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    isibutton: {
        backgroundColor: colors.primary,
        height: 70,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    harga: {
        backgroundColor: colors.primary,
        height: 70,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: '100%',
    },
    content2: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    judulmenu: {

        fontSize: 17,
        marginLeft: 10,
        marginRight: 50,
        fontFamily: "Raleway-Bold",
    },
    judul: {
        marginTop: 20,

        fontSize: 20,
        fontFamily: "Raleway-Bold",
    },
    judul2: {

        fontSize: 20,
        fontFamily: "Raleway-Bold",
    },
    cardview: {},
    meetmassage: {
        flex: 1,
        marginRight: 1,
        padding: 5,
    },
    meetclean: {
        flex: 1,
        marginLeft: 1,
        padding: 5,
    },
    gopay: {
        backgroundColor: '#fcfcfc',
        flex: 1,
        height: 30,
        marginRight: 1,
        flexDirection: 'row',
        padding: 5,
    },
    isi: {
        flex: 1,
        marginLeft: 1,
        backgroundColor: '#fcfcfc',
        height: 30,
        padding: 5,
    },

    item: {
        width: Dimensions.get('window').width * 0.5,
        height: 100,
        borderWidth: 1,
        borderColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemIcon: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    itemTitle: {
        marginTop: 16,
    },
    isitext: {
        marginLeft: 5,
        fontFamily: "Raleway-Bold",
        color: 'dimgray',
    },
    main: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {

        marginBottom: 15,
    },
    section_one: {
        marginVertical: 25,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    section_two: {
        flex: 3,
    },
    section_header: {
        color: 'blue',
    },
    tnc: {
        textAlign: 'center',
    },
    tnc_wrapper: {
        flex: 1,
        flexDirection: 'column-reverse',
        backgroundColor: 'red',
    },
});
